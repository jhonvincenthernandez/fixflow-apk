import type { RefresherCustomEvent } from '@ionic/vue'
import { showToast } from './useToast'

export async function refreshPage(event: RefresherCustomEvent): Promise<void> {
  await event.target.complete()
  showToast('info', 'Refreshing this page. Please wait...')
  await new Promise<void>((resolve) => window.setTimeout(resolve, 350))
  window.location.reload()
}
