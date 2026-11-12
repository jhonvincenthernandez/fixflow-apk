import type { RefresherCustomEvent } from '@ionic/vue'
import { showToast } from './useToast'

/** Reloads the whole page. Used by the pages that have no data of their own. */
function reloadPage(): void {
  showToast('info', 'Refreshing this page. Please wait...')
  window.setTimeout(() => window.location.reload(), 350)
}

/**
 * Ends the pull to refresh gesture. A page that has its own loader passes it
 * so the data refreshes in place. The pages without one fall back to a full
 * reload of the app.
 */
export async function refreshPage(
  event: RefresherCustomEvent,
  reload: () => void | Promise<void> = reloadPage,
): Promise<void> {
  await reload()
  await event.target.complete()
}
