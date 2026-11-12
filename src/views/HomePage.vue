<script setup lang="ts">
import { ref } from 'vue'
import { IonContent, IonPage, IonRefresher, IonRefresherContent, onIonViewWillEnter } from '@ionic/vue'
import type { RefresherCustomEvent } from '@ionic/vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import PageHeader from '@/components/PageHeader.vue'
import { loadRequests } from '@/composables/useRequests'
import { refreshPage } from '@/composables/usePageRefresh'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { useSession } from '@/composables/useSession'
import CustomerHome from './home/CustomerHome.vue'
import OwnerDashboard from './home/OwnerDashboard.vue'

const { user } = useSession()

/** One clock per visit, so every relative time on the page agrees. */
const now = ref(Date.now())

onIonViewWillEnter(() => {
  now.value = Date.now()
  // loadRequests handles its own errors and never rejects.
  void loadRequests({ silent: true })
})

// Keeps the screen in step with the other device.
useAutoRefresh(() => {
  now.value = Date.now()
  return loadRequests({ silent: true })
}, 15000)

function onPullRefresh(event: RefresherCustomEvent): Promise<void> {
  return refreshPage(event, () => loadRequests({ silent: true }))
}
</script>

<template>
  <ion-page>
    <PageHeader :title="user?.role === 'owner' ? 'Dashboard' : 'Home'" :heading="false" />
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="onPullRefresh">
        <ion-refresher-content />
      </ion-refresher>
      <main class="ff-container ff-container--wide" tabindex="-1">
        <ErrorBoundary title="Home could not load">
          <CustomerHome v-if="user?.role === 'customer'" :name="user.name" :now="now" />
          <OwnerDashboard v-else-if="user?.role === 'owner'" :name="user.name" :now="now" />
        </ErrorBoundary>
      </main>
    </ion-content>
  </ion-page>
</template>
