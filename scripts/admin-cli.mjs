import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const CONFIG_FILE = 'dataconnect/dataconnect.yaml'
const FIREBASE_BIN = 'node_modules/firebase-tools/lib/bin/firebase.js'
const ANSI_PATTERN = /\u001B\[[0-9;]*m/g

export class CliError extends Error {}

export function fail(message) {
  throw new CliError(message)
}

export function readConfig() {
  if (!existsSync(CONFIG_FILE)) {
    fail(`Missing ${CONFIG_FILE}. Run this command from the project root.`)
  }
  const yaml = readFileSync(CONFIG_FILE, 'utf8')
  const serviceId = yaml.match(/^serviceId:\s*["']?([^"'\n#]+)["']?\s*$/m)?.[1]?.trim()
  const location = yaml.match(/^location:\s*["']?([^"'\n#]+)["']?\s*$/m)?.[1]?.trim()
  if (serviceId === undefined || location === undefined) {
    fail(`Could not read serviceId and location from ${CONFIG_FILE}.`)
  }
  return { serviceId, location }
}

export function readProjectId() {
  if (!existsSync('.firebaserc')) return null
  try {
    const config = JSON.parse(readFileSync('.firebaserc', 'utf8'))
    return config?.projects?.default ?? null
  } catch {
    return null
  }
}

export function parseJson(stdout) {
  const clean = stdout.replace(ANSI_PATTERN, '')
  const start = clean.indexOf('{')
  if (start === -1) fail(`The Firebase CLI returned no JSON.\n\n${clean.trim()}`)
  try {
    return JSON.parse(clean.slice(start))
  } catch {
    fail(`The Firebase CLI returned invalid JSON.\n\n${clean.trim()}`)
  }
}

export function createRunner({ adminFile, serviceId, location, projectId }) {
  if (!existsSync(FIREBASE_BIN)) {
    fail('Firebase CLI is not installed. Run npm install first.')
  }

  return function run(operation, variables = null) {
    let tempDir = null
    try {
      const args = [
        FIREBASE_BIN,
        'dataconnect:execute',
        adminFile,
        operation,
        '--service',
        serviceId,
        '--location',
        location,
        '--non-interactive',
      ]
      if (projectId !== null) args.push('--project', projectId)
      if (variables !== null) {
        tempDir = mkdtempSync(join(tmpdir(), 'fixflow-admin-'))
        const varsFile = join(tempDir, 'vars.json')
        writeFileSync(varsFile, JSON.stringify(variables))
        args.push('--vars', `@${varsFile}`)
      }

      const stdout = execFileSync(process.execPath, args, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      const parsed = parseJson(stdout)
      if (Array.isArray(parsed.errors) && parsed.errors.length > 0) {
        const detail = parsed.errors.map((entry) => entry?.message ?? String(entry)).join('\n')
        fail(`The database rejected ${operation}.\n\n${detail}`)
      }
      return parsed
    } catch (error) {
      if (error instanceof CliError) throw error
      const stdout = typeof error?.stdout === 'string' ? error.stdout : ''
      const stderr = typeof error?.stderr === 'string' ? error.stderr : ''
      const detail = `${stdout}\n${stderr}`.replace(ANSI_PATTERN, '').trim()
      fail(
        detail === ''
          ? `The Firebase CLI failed to run ${operation}.`
          : `The Firebase CLI failed to run ${operation}.\n\n${detail}`,
      )
    } finally {
      if (tempDir !== null) rmSync(tempDir, { recursive: true, force: true })
    }
  }
}

export function formatAccounts(rows) {
  if (rows.length === 0) return '  none'
  return rows.map((row) => `  - ${row.name} <${row.email}>`).join('\n')
}

export async function confirm(question) {
  if (!input.isTTY) {
    fail('No interactive terminal. Add --yes to run without confirmation.')
  }
  const rl = createInterface({ input, output })
  try {
    const answer = (await rl.question(question)).trim().toLowerCase()
    return answer === 'y' || answer === 'yes'
  } finally {
    rl.close()
  }
}
