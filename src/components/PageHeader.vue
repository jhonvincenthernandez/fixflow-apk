<script setup lang="ts">
import { IonBackButton, IonButtons, IonHeader, IonToolbar } from '@ionic/vue'

withDefaults(
  defineProps<{
    title: string
    /** When set, shows a back button that falls back to this path if there is no history. */
    backHref?: string
    /** Aligns the bar with the page content width. Narrow pages use the reading column. */
    width?: 'narrow' | 'wide'
  }>(),
  { width: 'wide' },
)
</script>

<template>
  <ion-header>
    <ion-toolbar class="page-toolbar" :class="`page-toolbar--${width}`">
      <ion-buttons v-if="backHref" slot="start">
        <ion-back-button :default-href="backHref" text="" />
      </ion-buttons>
      <h1 class="page-title ff-h3">{{ title }}</h1>
      <ion-buttons slot="end">
        <slot name="actions" />
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<style scoped>
.page-toolbar {
  --background: var(--color-surface);
  --padding-start: max(var(--page-pad), calc((100% - var(--content-max-wide)) / 2 + var(--page-pad)));
  --padding-end: max(var(--page-pad), calc((100% - var(--content-max-wide)) / 2 + var(--page-pad)));
}

.page-toolbar--narrow {
  --padding-start: max(var(--page-pad), calc((100% - var(--content-max)) / 2 + var(--page-pad)));
  --padding-end: max(var(--page-pad), calc((100% - var(--content-max)) / 2 + var(--page-pad)));
}

.page-title {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--text-md);
  font-weight: var(--weight-extrabold);
  letter-spacing: -0.015em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 48rem) {
  .page-title {
    font-size: var(--text-lg);
  }
}
</style>
