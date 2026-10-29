import { initializeApp } from 'firebase/app'
import { getDataConnect } from 'firebase/data-connect'
import { connectorConfig } from '@dataconnect/generated'

/**
 * Firebase configuration comes from the .env file. Data Connect talks to the
 * PostgreSQL database behind the fixflow-5d7c5 service.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

/** Shared Data Connect client used by every repository operation. */
const dataConnect = getDataConnect(app, connectorConfig)

export { app, dataConnect }
