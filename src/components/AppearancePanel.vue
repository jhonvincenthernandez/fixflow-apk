<script setup lang="ts">
import AppearanceControl from '@/components/AppearanceControl.vue'

withDefaults(
  defineProps<{
    headingId: string
    /** Card is used on pages. Plain is used inside surfaces that already provide the frame. */
    variant?: 'card' | 'plain'
  }>(),
  { variant: 'card' },
)
</script>

<template>
  <section
    class="appearance-panel"
    :class="variant === 'card' ? 'ff-card' : 'appearance-panel--plain'"
    :aria-labelledby="headingId"
  >
    <div class="appearance-panel__body">
      <div class="ff-stack ff-stack--tight">
        <h2 :id="headingId" class="ff-h3">Appearance</h2>
        <p class="ff-meta">Match this device or choose light or dark&nbsp;mode.</p>
      </div>
      <AppearanceControl />
    </div>
  </section>
</template>

<style scoped>
/* The panel adapts to its own width, not the viewport. */
.appearance-panel {
  container: appearance-panel / inline-size;
}

.appearance-panel__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Wide cards use a settings row; narrow cards stay stacked. */
@container appearance-panel (min-width: 36rem) {
  .appearance-panel__body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 22rem);
    align-items: center;
    gap: var(--space-4);
  }
}
</style>
