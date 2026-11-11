<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
    block?: boolean
  }>(),
  { variant: 'primary', type: 'button', loading: false, disabled: false, block: false },
)
</script>

<template>
  <button
    :type="type"
    class="ff-btn"
    :class="[`ff-btn--${variant}`, { 'ff-btn--block': block, 'ff-btn--loading': loading }]"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
  >
    <span v-if="loading" class="ff-spinner" aria-hidden="true" />
    <span class="ff-btn__label"><slot /></span>
    <span v-if="loading" class="ff-sr-only">Loading</span>
  </button>
</template>

<style scoped>
/* While loading, the label keeps its space and a spinner takes its place. */
.ff-btn--loading {
  position: relative;
}

.ff-btn--loading .ff-btn__label {
  visibility: hidden;
}

.ff-btn--loading .ff-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: calc(var(--icon-md) / -2) 0 0 calc(var(--icon-md) / -2);
}

.ff-btn--loading.ff-btn:disabled {
  opacity: 1;
}
</style>
