import { onIonViewDidLeave, onIonViewWillEnter } from '@ionic/vue'
import { onUnmounted } from 'vue'

/**
 * The shared part of both pollers: a timer that refreshes while the tab is
 * visible, and never runs two refreshes at the same time.
 */
function createPoll(
  refresh: () => void | Promise<void>,
  intervalMs: number,
  shouldPoll: () => boolean,
  isActive: () => boolean,
): { start: () => void; stop: () => void } {
  let timer: number | null = null
  let running = false

  async function tick(): Promise<void> {
    if (running || !isActive()) return
    if (!shouldPoll()) return
    if (document.visibilityState !== 'visible') return
    running = true
    try {
      await refresh()
    } finally {
      running = false
    }
  }

  function start(): void {
    if (timer !== null) return
    timer = window.setInterval(() => void tick(), intervalMs)
  }

  function stop(): void {
    if (timer === null) return
    window.clearInterval(timer)
    timer = null
  }

  function onVisibilityChange(): void {
    if (document.visibilityState === 'visible') void tick()
  }

  document.addEventListener('visibilitychange', onVisibilityChange)
  onUnmounted(() => {
    stop()
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return { start, stop }
}

/**
 * Polls a loader while the page is on screen and the tab is visible.
 *
 * Ionic keeps pages mounted after you leave them, so the polling starts when
 * the view is entered and stops when the view is left. A hidden tab stops the
 * reads too, and the data refreshes as soon as the tab comes back.
 *
 * `shouldPoll` lets a page stop the reads on its own, for example when the
 * request it shows will not change anymore.
 */
export function useAutoRefresh(
  refresh: () => void | Promise<void>,
  intervalMs: number,
  shouldPoll: () => boolean = () => true,
): void {
  let active = false
  const poll = createPoll(refresh, intervalMs, shouldPoll, () => active)
  onIonViewWillEnter(() => {
    active = true
    poll.start()
  })
  onIonViewDidLeave(() => {
    active = false
    poll.stop()
  })
}

/**
 * Polls a loader for as long as the app is in the foreground. Use it in the
 * app shell, where there is no page to enter or leave.
 */
export function useAppRefresh(
  refresh: () => void | Promise<void>,
  intervalMs: number,
  shouldPoll: () => boolean = () => true,
): void {
  const poll = createPoll(refresh, intervalMs, shouldPoll, () => true)
  poll.start()
}
