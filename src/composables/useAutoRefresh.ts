import { onIonViewDidLeave, onIonViewWillEnter } from '@ionic/vue'
import { onUnmounted } from 'vue'

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
  let timer: number | null = null
  let running = false
  let active = false

  async function tick(): Promise<void> {
    if (running || !active) return
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
    active = true
    if (timer !== null) return
    timer = window.setInterval(() => void tick(), intervalMs)
  }

  function stop(): void {
    active = false
    if (timer === null) return
    window.clearInterval(timer)
    timer = null
  }

  function onVisibilityChange(): void {
    if (document.visibilityState === 'visible') void tick()
  }

  onIonViewWillEnter(start)
  onIonViewDidLeave(stop)
  document.addEventListener('visibilitychange', onVisibilityChange)
  onUnmounted(() => {
    stop()
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })
}
