# FixFlow

FixFlow is a repair shop workflow app. Customers submit a service request with photos,
the shop sends a quotation, the customer books a slot, and both sides follow the repair
through completion and feedback.

## Stack

- Ionic Vue with Vite and TypeScript.
- Firebase Data Connect on Cloud SQL for PostgreSQL.
- Custom PBKDF2 email and password sign-in for the demo.

## Demo accounts

The first launch seeds these accounts, sample requests, notifications, and shop settings
into the shared database. The password for every demo account is `fixflow123`.

| Role           | Email               |
| -------------- | ------------------- |
| Customer       | `ana@fixflow.app`   |
| Customer       | `ben@fixflow.app`   |
| Business owner | `owner@fixflow.app` |

The seed is for the demo database. For a real deployment, register the owner account in
the app and promote it with the command in the next section. Do not rely on the demo
owner credentials in production.

Set `VITE_DEMO_SEED=false` in the build environment for a clean production database. That
build skips the demo seed and hides the Reset demo data button.

## Shop owner account

The app serves one shop and has one owner. Customers sign up through the app. The owner
account is created the same way, then promoted from the command line. Do not add an
owner creation form to the app.

1. Register the owner email in the app as a customer.
2. Sign in to the Firebase CLI with an account that can access the project:

```bash
npx firebase login
npx firebase use fixflow-5d7c5
```

3. Promote the account:

```bash
npm run owner:promote -- owner@example.com
```

The command promotes that account to `owner`, demotes every other owner to `customer`,
and verifies that exactly one owner remains. Add `--yes` in scripts or CI to skip the
confirmation prompt. Reload the app, or sign out and sign in again, to open the owner
dashboard.

List the current owners:

```bash
npm run owner:promote -- --list
```

The admin operations live in `dataconnect/admin/owner-admin.gql`. That directory is not
listed in `connectorDirs`, so the operations are never deployed to the client.

## Delete an account

Delete a customer account and its related requests, images, and notifications:

```bash
npm run account:delete -- customer@example.com
```

The command shows the data that will be removed and asks for confirmation. Add `--yes`
to skip the prompt. It refuses to delete the only owner. Promote another account first
if you need to remove the current owner.

The admin operations live in `dataconnect/admin/account-admin.gql`. That directory is
outside `connectorDirs`, so the operations are never deployed to the client.

## Local development

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build       # type check and production build
npm run lint        # ESLint
npm run test:unit   # Vitest
npm run test:e2e    # Cypress, with the dev server running on port 5173
```

## Database

The app uses the Data Connect service `fixflow-5d7c5-service` in `asia-southeast1`,
connector `example`, and Cloud SQL database `fixflow-5d7c5-database`.

Regenerate the typed client after changing the schema or connector files:

```bash
npx firebase dataconnect:sdk:generate --service fixflow-5d7c5-service --location asia-southeast1
```

Review and apply database changes:

```bash
npx firebase dataconnect:sql:diff
npx firebase deploy --only dataconnect
```

Nested workflow data (quotation, appointment, feedback, closure, history, and image
identifiers) is stored as validated JSON text columns. Photos are downscaled in the
browser and stored as data URLs in the `request_image` table.

## Storage notes

- Application data lives in PostgreSQL through Data Connect.
- The signed-in session is a per-tab handle in `sessionStorage` with an in-memory fallback.
- The appearance preference is a device-only value in `localStorage`.
- Repository reads use `SERVER_ONLY` so the SDK query cache cannot hide another device's changes.

## Security note

The connector marks its operations `PUBLIC` because Firebase Authentication is not
configured. Anyone with the web API key can read and write the demo data, including the
stored password hashes. Do not use this configuration with real customer data. Adding
Firebase Authentication and per-user authorization rules is required before production use.

The owner promotion and account delete commands keep those changes out of the app, but
the public connector still accepts direct writes. Treat them as operational controls
until Firebase Authentication and per-user authorization are in place.
