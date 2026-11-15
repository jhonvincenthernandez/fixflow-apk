import { computed, shallowRef, watch } from 'vue'
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '@/data/repo'
import type { AsyncState } from '@/domain/async'
import { toAppError, userMessage } from '@/domain/errors'
import { logger } from '@/domain/logger'
import type { AppNotification } from '@/domain/types'
import { requireActor, useSession } from './useSession'
import { showToast } from './useToast'

const notificationsState = shallowRef<AsyncState<AppNotification[]>>({ status: 'idle' })
let inflight: Promise<void> | null = null
/** The ids of the alerts the user has already been told about. Null until the first load. */
let seenIds: Set<string> | null = null

/**
 * Loads the alerts.
 * `silent` keeps the current list on screen while refreshing.
 * `quiet` keeps a failure out of a toast, for the background refresh that runs every few seconds.
 * `announce` tells the user about an alert that arrived while they were on another screen.
 */
export function loadNotifications(options: { silent?: boolean; quiet?: boolean; announce?: boolean } = {}): Promise<void> {
  if (inflight !== null) return inflight

  const run = async (): Promise<void> => {
    const hadData = notificationsState.value.status === 'success'
    if (!(options.silent === true && hadData)) notificationsState.value = { status: 'loading' }
    try {
      const actor = requireActor()
      const items = await listNotifications(actor.id)
      // A local copy, because seenIds is replaced on the next line.
      const known = seenIds
      const fresh = known === null ? [] : items.filter((item) => !known.has(item.id))
      seenIds = new Set(items.map((item) => item.id))
      notificationsState.value = { status: 'success', data: items }
      if (options.announce === true) announce(fresh)
    } catch (error) {
      const appError = toAppError(error)
      logger.error('Loading notifications failed', appError)
      if (hadData && options.silent === true) {
        if (options.quiet !== true) showToast('error', `Could not refresh alerts. ${userMessage(appError)}`)
        return
      }
      notificationsState.value = { status: 'error', error: appError }
    }
  }

  inflight = run().finally(() => {
    inflight = null
  })
  return inflight
}

/**
 * Tells the user about an alert that arrived on another device.
 * The newest one is enough: the badge on the Alerts tab carries the full count.
 */
function announce(fresh: readonly AppNotification[]): void {
  const newest = fresh[0]
  if (newest === undefined) return
  const extra = fresh.length > 1 ? ` (+${fresh.length - 1} more)` : ''
  showToast('info', `${newest.title}. ${newest.body}${extra}`, 6000)
}

function replaceAll(update: (items: readonly AppNotification[]) => AppNotification[]): void {
  const current = notificationsState.value
  if (current.status !== 'success') return
  notificationsState.value = { status: 'success', data: update(current.data) }
}

export async function markRead(id: string): Promise<void> {
  const actor = requireActor()
  await markNotificationRead(actor.id, id)
  const readAt = Date.now()
  replaceAll((items) => items.map((item) => (item.id === id && item.readAt === null ? { ...item, readAt } : item)))
}

export async function markAllRead(): Promise<void> {
  const actor = requireActor()
  await markAllNotificationsRead(actor.id)
  const readAt = Date.now()
  replaceAll((items) => items.map((item) => (item.readAt === null ? { ...item, readAt } : item)))
}

// `immediate` matters: this module loads lazily with the tabs page, after sign-in has already happened.
const { user } = useSession()
watch(
  () => user.value?.id,
  (id) => {
    notificationsState.value = { status: 'idle' }
    // A different account has not been told about its alerts yet, so its first load only fills the badge.
    seenIds = null
    // Load right away so the tab badge is correct before the Alerts tab is ever opened.
    if (id !== undefined) void loadNotifications({ silent: true })
  },
  { immediate: true },
)

export function useNotifications() {
  const list = computed(() => (notificationsState.value.status === 'success' ? notificationsState.value.data : []))
  const unreadCount = computed(() => list.value.filter((item) => item.readAt === null).length)
  return { state: notificationsState, list, unreadCount }
}
