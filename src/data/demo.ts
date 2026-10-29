/**
 * Demo accounts created on first launch. FixFlow stores accounts in a shared
 * PostgreSQL database through Firebase Data Connect, so these exist to let a
 * reviewer try both sides of the workflow.
 */
export const DEMO_PASSWORD = 'fixflow123'

export const DEMO_ACCOUNTS = {
  customer: { label: 'Customer', name: 'Ana Reyes', email: 'ana@fixflow.app', phone: '09171234567' },
  owner: { label: 'Business owner', name: 'Marco Villanueva', email: 'owner@fixflow.app', phone: '09189876543' },
  secondCustomer: { label: 'Customer', name: 'Ben Santos', email: 'ben@fixflow.app', phone: '09205550123' },
} as const
