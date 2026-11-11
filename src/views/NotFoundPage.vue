<script setup lang="ts">
import { IonContent, IonPage, IonRefresher, IonRefresherContent } from '@ionic/vue'
import type { RefresherCustomEvent } from '@ionic/vue'
import { Compass } from '@lucide/vue'
import AppLink from '@/components/AppLink.vue'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'
import { refreshPage } from '@/composables/usePageRefresh'

function onPullRefresh(event: RefresherCustomEvent): Promise<void> {
  return refreshPage(event)
}
</script>

<template>
  <ion-page>
    <PageHeader title="Page not found" width="narrow" />
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="onPullRefresh">
        <ion-refresher-content />
      </ion-refresher>
      <main class="ff-container not-found" tabindex="-1">
        <EmptyState
          :icon="Compass"
          title="We could not find that page"
          body="The link may be old or mistyped. Head back to your requests."
        >
          <AppLink to="/tabs/home" class="ff-btn ff-btn--primary">Go to home</AppLink>
        </EmptyState>
      </main>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}
</style>
