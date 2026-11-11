<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { useBlobUrls } from '@/composables/useBlobUrls'
import type { StoredImage } from '@/data/repo'
import SheetModal from './SheetModal.vue'

const props = defineProps<{ images: readonly StoredImage[] }>()

const { items, replace } = useBlobUrls()
watch(
  () => props.images,
  (images) => replace(images),
  { immediate: true },
)

const viewing = ref<number | null>(null)
const viewed = computed(() => (viewing.value === null ? undefined : items.value[viewing.value]))
const viewerTitle = computed(() =>
  items.value.length > 1 ? 'Problem photos' : 'Problem photo',
)

function step(delta: number): void {
  const count = items.value.length
  if (viewing.value === null || count < 2) return
  viewing.value = (viewing.value + delta + count) % count
}

function onKeydown(event: KeyboardEvent): void {
  if (viewing.value === null || items.value.length < 2) return
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    step(-1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    step(1)
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <ul class="gallery">
    <li v-for="(item, index) in items" :key="item.id">
      <button
        type="button"
        class="gallery__thumb"
        :aria-label="`View photo ${index + 1} of ${items.length}`"
        @click="viewing = index"
      >
        <img class="gallery__image" :src="item.url" :alt="`Problem photo ${index + 1}`" width="72" height="72" loading="lazy" />
      </button>
    </li>
  </ul>

  <SheetModal
    class="ff-photo-modal"
    :open="viewing !== null"
    :title="viewerTitle"
    @close="viewing = null"
  >
    <div v-if="viewed" class="viewer">
      <div class="viewer__stage">
        <img
          class="viewer__image"
          :src="viewed.url"
          :alt="`Problem photo ${(viewing ?? 0) + 1} of ${items.length}, enlarged`"
        />
        <template v-if="items.length > 1">
          <button
            type="button"
            class="viewer__nav viewer__nav--prev"
            aria-label="Previous photo"
            @click="step(-1)"
          >
            <ChevronLeft class="ff-icon" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="viewer__nav viewer__nav--next"
            aria-label="Next photo"
            @click="step(1)"
          >
            <ChevronRight class="ff-icon" aria-hidden="true" />
          </button>
          <p class="viewer__counter" aria-live="polite" aria-atomic="true">
            {{ (viewing ?? 0) + 1 }} of {{ items.length }}
          </p>
        </template>
      </div>
      <ul v-if="items.length > 1" class="viewer__thumbs" aria-label="Problem photos">
        <li v-for="(item, index) in items" :key="item.id">
          <button
            type="button"
            class="viewer__thumb"
            :aria-label="`View photo ${index + 1} of ${items.length}`"
            :aria-pressed="index === viewing"
            @click="viewing = index"
          >
            <img :src="item.url" alt="" width="56" height="56" />
          </button>
        </li>
      </ul>
    </div>
  </SheetModal>
</template>

<style scoped>
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.gallery__thumb {
  display: block;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.gallery__image {
  display: block;
  width: var(--thumb-size);
  height: var(--thumb-size);
  object-fit: cover;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  transition:
    box-shadow var(--transition-base),
    transform var(--transition-base);
}

@media (hover: hover) {
  .gallery__thumb:hover .gallery__image {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}

.viewer {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-height: 0;
}

.viewer__stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  background: var(--color-track);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  isolation: isolate;
}

.viewer__image {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: min(60vh, 40rem);
  height: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.viewer__nav {
  position: absolute;
  top: 50%;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--touch-min);
  height: var(--touch-min);
  padding: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    background var(--transition-base),
    border-color var(--transition-base),
    box-shadow var(--transition-base),
    transform var(--transition-base);
}

.viewer__nav--prev {
  left: var(--space-2);
}

.viewer__nav--next {
  right: var(--space-2);
}

@media (hover: hover) {
  .viewer__nav:hover {
    background: var(--color-overlay);
    border-color: var(--color-border-strong);
    transform: translateY(-50%) scale(1.04);
  }
}

.viewer__nav:active {
  box-shadow: var(--shadow-xs);
  transform: translateY(-50%) scale(0.98);
}

.viewer__counter {
  position: absolute;
  left: 50%;
  bottom: var(--space-2);
  z-index: 1;
  padding: var(--space-1) var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-xs);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  white-space: nowrap;
  transform: translateX(-50%);
}

.viewer__thumbs {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-1) 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.viewer__thumb {
  display: block;
  padding: 2px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color var(--transition-base);
}

.viewer__thumb img {
  display: block;
  width: var(--thumb-size-sm);
  height: var(--thumb-size-sm);
  object-fit: cover;
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius-sm) - 2px);
}

.viewer__thumb[aria-pressed='true'] {
  border-color: var(--color-brand);
}

@media (hover: hover) {
  .viewer__thumb:hover {
    border-color: var(--color-border-strong);
  }

  .viewer__thumb[aria-pressed='true']:hover {
    border-color: var(--color-brand);
  }
}

@media (min-width: 64rem) {
  :global(ion-modal.ff-sheet.ff-photo-modal) {
    --width: min(calc(100% - var(--space-12)), 76rem);
    --max-width: 76rem;
  }
}
</style>
