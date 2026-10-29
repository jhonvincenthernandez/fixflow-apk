# FixFlow

FixFlow is a repair shop workflow app. Customers submit a service request with photos,
the shop sends a quotation, the customer books a slot, and both sides follow the repair
through completion and feedback.

## Stack

- Ionic Vue with Vite and TypeScript.
- Firebase Data Connect on Cloud SQL for PostgreSQL.
- App-level PBKDF2 email and password accounts.
- Capacitor Android shell with a GitHub Actions APK build.

## Accounts

Customers create an account in the app. The app serves one shop and has one owner. The
owner account is created the same way, then promoted from the command line. Do not add an
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

## Build the Android APK

### GitHub Actions

The workflow in `.github/workflows/build-apk.yaml` runs on every push to `main` and can
also be started manually from the Actions tab.

Add this repository secret before the first build:

- `FIREBASE_ENV`: the full contents of the production `.env` file. It must define
  `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, and
  `VITE_FIREBASE_APP_ID`. See `.env.example` for the shape.

Without signing secrets, the workflow produces an installable debug APK named
`FixFlow-debug.apk`.

For a signed release APK, add these repository secrets:

- `ANDROID_KEYSTORE_BASE64`: the release keystore encoded as base64.
- `ANDROID_KEYSTORE_PASSWORD`: the keystore password.
- `ANDROID_KEY_ALIAS`: the key alias.
- `ANDROID_KEY_PASSWORD`: the key password.

Create a keystore once and keep it outside the repository:

```bash
keytool -genkeypair -v -keystore fixflow-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias fixflow
base64 -w 0 fixflow-release.jks
```

On Windows PowerShell, encode the keystore with:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('fixflow-release.jks')) | Set-Clipboard
```

When all four signing secrets are present, the workflow builds `FixFlow-release.apk`.
Otherwise it falls back to the debug APK. The resulting APK is uploaded as a workflow
artifact for 30 days.

### Local build

Install Node.js 24, JDK 21, and Android SDK Platform 36. Then run:

```bash
npm ci
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

For a local signed release build, create `android/key.properties` with the keystore
details and run `./gradlew assembleRelease`:

```properties
storeFile=fixflow-release.jks
storePassword=change-me
keyAlias=fixflow
keyPassword=change-me
```

Place the keystore beside `android/app/build.gradle`, or use an absolute path in
`storeFile`. The keystore and `key.properties` are ignored by Git.

## Local development

Copy `.env.example` to `.env` and fill in the Firebase web configuration, then run:

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
- The signed-in session is a device handle in `localStorage` with an in-memory fallback.
  It persists across app launches until the user signs out.
- The appearance preference is a device-only value in `localStorage`.
- Repository reads use `SERVER_ONLY` so the SDK query cache cannot hide another device's changes.

## Security status

The APK packaging is release-ready, but the current backend is not safe for real customer
data. The Data Connect connector marks its operations `PUBLIC` because the app performs
its own email and password check instead of using Firebase Authentication. Anyone with the
web API key can call the connector directly, read stored password hashes, and write rows.
The app-level role checks in the Vue client do not protect the database.

Before a public launch:

1. Move sign-in and registration to Firebase Authentication.
2. Add Data Connect `@auth` rules that bind each row to `auth.uid` and use a custom claim
   for the single shop owner.
3. Remove the password hash columns from the schema and migrate existing accounts.
4. Enable Firebase App Check and restrict the web API key to the app.
5. Add rate limiting, email verification, and server-side audit logging.

Until those steps are deployed, treat the APK as a private build or an internal pilot.
