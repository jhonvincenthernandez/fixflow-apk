#!/usr/bin/env node
import {
  EMAIL_PATTERN,
  confirm,
  createRunner,
  fail,
  formatAccounts,
  readConfig,
  readProjectId,
} from './admin-cli.mjs'

const ADMIN_FILE = 'dataconnect/admin/owner-admin.gql'

function usage() {
  console.log(`
Promote one account to the shop owner role.

Usage:
  npm run owner:promote -- <email> [--yes]
  npm run owner:promote -- --email <email> [--yes]
  npm run owner:promote -- --list
  npm run owner:promote -- --help

Options:
  --email <email>  Account to promote. The account must already exist.
  --yes            Skip the confirmation prompt.
  --list           List the current owner accounts and exit.
  --help           Show this message.

The command promotes the target account, demotes every other owner to customer,
and verifies that exactly one owner remains.
`)
}

function parseArgs(argv) {
  const result = { email: null, yes: false, list: false, help: false }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--yes' || arg === '-y') result.yes = true
    else if (arg === '--list') result.list = true
    else if (arg === '--help' || arg === '-h') result.help = true
    else if (arg === '--email') {
      const value = argv[index + 1]
      if (value === undefined) fail('--email needs an address.')
      result.email = value
      index += 1
    } else if (arg.startsWith('--email=')) {
      result.email = arg.slice('--email='.length)
    } else if (arg.startsWith('-')) {
      fail(`Unknown option: ${arg}`)
    } else if (result.email === null) {
      result.email = arg
    } else {
      fail(`Unexpected argument: ${arg}`)
    }
  }
  return result
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    usage()
    return
  }

  const config = readConfig()
  const run = createRunner({ adminFile: ADMIN_FILE, ...config, projectId: readProjectId() })

  if (args.list) {
    const result = run('ListOwnerAccounts')
    const owners = result?.data?.fixflowUsers ?? []
    console.log(`Current owner accounts:\n${formatAccounts(owners)}`)
    return
  }

  if (args.email === null) {
    usage()
    process.exitCode = 1
    return
  }

  const email = args.email.trim().toLowerCase()
  if (!EMAIL_PATTERN.test(email)) {
    fail(`Enter a valid email address, not "${args.email}".`)
  }

  const accountResult = run('GetAccountByEmail', { email })
  const account = accountResult?.data?.fixflowUsers?.[0]
  if (account === undefined) {
    fail(`No account found for ${email}. Register this email in the app first, then run the command again.`)
  }

  const ownerResult = run('ListOwnerAccounts')
  const owners = ownerResult?.data?.fixflowUsers ?? []
  const others = owners.filter((owner) => owner.email.toLowerCase() !== email)

  if (others.length === 0 && account.role === 'owner') {
    console.log(`${email} is already the only owner. Nothing to change.`)
    return
  }

  console.log(`Target account:\n  - ${account.name} <${account.email}> (${account.role})`)
  console.log(`Current owner accounts:\n${formatAccounts(owners)}`)
  if (others.length > 0) {
    const noun = others.length === 1 ? 'account' : 'accounts'
    console.log(`\nThis will demote ${others.length} other owner ${noun} to customer.`)
  }

  if (!args.yes) {
    const approved = await confirm(`Promote ${email} to owner? [y/N] `)
    if (!approved) {
      console.log('No changes made.')
      return
    }
  }

  const promote = run('SetUserRole', { email, role: 'owner' })
  const promoted = promote?.data?.fixflowUser_updateMany ?? 0
  if (promoted !== 1) {
    fail(`Expected to update one account, but the database reported ${promoted}.`)
  }

  for (const owner of others) {
    const demote = run('SetUserRole', { email: owner.email.toLowerCase(), role: 'customer' })
    const demoted = demote?.data?.fixflowUser_updateMany ?? 0
    if (demoted !== 1) {
      fail(`Could not demote ${owner.email}. The database reported ${demoted} updated rows.`)
    }
    console.log(`Demoted ${owner.email} to customer.`)
  }

  const finalResult = run('ListOwnerAccounts')
  const finalOwners = finalResult?.data?.fixflowUsers ?? []
  if (finalOwners.length !== 1 || finalOwners[0].email.toLowerCase() !== email) {
    fail(`The final check failed. Current owners:\n${formatAccounts(finalOwners)}`)
  }

  console.log(`\nOwner updated. The only owner is now:\n${formatAccounts(finalOwners)}`)
  console.log('\nReload the app, or sign out and sign in again, to open the owner dashboard.')
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`\n${message}\n`)
  process.exitCode = 1
})
