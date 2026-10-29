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

const ADMIN_FILE = 'dataconnect/admin/account-admin.gql'

function usage() {
  console.log(`
Delete one account and its related data.

Usage:
  npm run account:delete -- <email> [--yes]
  npm run account:delete -- --email <email> [--yes]
  npm run account:delete -- --help

Options:
  --email <email>  Account to delete. The account must already exist.
  --yes            Skip the confirmation prompt.
  --help           Show this message.

The command refuses to delete the only owner. It removes the account's requests,
request images, and notifications in one transaction. This cannot be undone.
`)
}

function parseArgs(argv) {
  const result = { email: null, yes: false, help: false }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--yes' || arg === '-y') result.yes = true
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

function countLabel(count, singular, plural = `${singular}s`) {
  const noun = count === 1 ? singular : plural
  return `${count} ${noun}`
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    usage()
    return
  }

  const config = readConfig()
  const run = createRunner({ adminFile: ADMIN_FILE, ...config, projectId: readProjectId() })

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
    fail(`No account found for ${email}.`)
  }

  if (account.role === 'owner') {
    const ownersResult = run('ListAccountOwners')
    const owners = ownersResult?.data?.fixflowUsers ?? []
    const others = owners.filter((owner) => owner.email.toLowerCase() !== email)
    if (others.length === 0) {
      fail(
        `Refusing to delete ${email}. It is the only owner. Promote another account first with: npm run owner:promote -- <email>`,
      )
    }
  }

  const requestsResult = run('ListAccountRequests', { customerId: account.id })
  const requests = requestsResult?.data?.serviceRequests ?? []
  const requestIds = requests.map((request) => request.id)

  const imageIds = []
  for (const requestId of requestIds) {
    const imagesResult = run('ListAccountRequestImages', { requestId })
    const images = imagesResult?.data?.requestImages ?? []
    imageIds.push(...images.map((image) => image.id))
  }

  const notificationIds = new Set()
  const notificationsResult = run('ListAccountNotifications', { userId: account.id })
  for (const notification of notificationsResult?.data?.notifications ?? []) {
    notificationIds.add(notification.id)
  }
  if (requestIds.length > 0) {
    const requestNotificationsResult = run('ListAccountRequestNotifications', { requestIds })
    for (const notification of requestNotificationsResult?.data?.notifications ?? []) {
      notificationIds.add(notification.id)
    }
  }

  console.log(`Target account:\n${formatAccounts([account])}`)
  console.log(`Role: ${account.role}`)
  console.log(`Requests: ${requests.length}`)
  console.log(`Images: ${imageIds.length}`)
  console.log(`Notifications: ${notificationIds.size}`)
  if (account.role === 'owner') {
    console.log('This account is an owner. Another owner will remain.')
  }
  console.log('This deletes the account and all related requests, images, and notifications. It cannot be undone.')

  if (!args.yes) {
    const approved = await confirm(`Delete ${email}? [y/N] `)
    if (!approved) {
      console.log('No changes made.')
      return
    }
  }

  let result
  if (requestIds.length === 0) {
    result = run('DeleteAccountOnly', { userId: account.id })
  } else if (imageIds.length === 0) {
    result = run('DeleteAccountRequests', { userId: account.id, requestIds })
  } else {
    result = run('DeleteAccountData', { userId: account.id, requestIds, imageIds })
  }

  const deletedId = result?.data?.fixflowUser_delete?.id
  if (deletedId !== account.id) {
    fail('The delete response did not confirm the account removal. Check the database before retrying.')
  }

  const verifyResult = run('GetAccountByEmail', { email })
  const remaining = verifyResult?.data?.fixflowUsers?.[0]
  if (remaining !== undefined) {
    fail('The account still exists after the delete. Check the database.')
  }

  console.log(`\nAccount deleted: ${account.name} <${account.email}>`)
  console.log(
    `Removed ${countLabel(requests.length, 'request')}, ${countLabel(imageIds.length, 'image')}, and ${countLabel(notificationIds.size, 'notification')}.`,
  )
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`\n${message}\n`)
  process.exitCode = 1
})
