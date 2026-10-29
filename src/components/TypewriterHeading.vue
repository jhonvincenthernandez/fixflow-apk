<script setup lang="ts">
import { useTypewriter } from '@/composables/useTypewriter'

const props = withDefaults(
  defineProps<{
    text: string
    loop?: boolean
  }>(),
  { loop: false },
)

const { typed, isTyping } = useTypewriter(props.text, { loop: props.loop })
</script>

<template>
  <h1 class="ff-typewriter" :aria-label="text">
    <span class="ff-typewriter__ghost" aria-hidden="true">{{ text }}<span class="ff-typewriter__caret ff-typewriter__caret--ghost"></span></span>
    <span class="ff-typewriter__live" :class="{ 'ff-typewriter__live--typing': isTyping }" aria-hidden="true"><span>{{ typed }}</span><span class="ff-typewriter__caret"></span></span>
  </h1>
</template>

<style scoped>
.ff-typewriter {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  text-wrap: balance;
}

/* The hidden copy reserves the final line count so typing cannot shift the page. */
.ff-typewriter__ghost,
.ff-typewriter__live {
  grid-area: 1 / 1;
  min-width: 0;
}

.ff-typewriter__ghost {
  visibility: hidden;
  pointer-events: none;
}

.ff-typewriter__caret {
  display: inline-block;
  width: 0.08em;
  height: 1.05em;
  margin-inline-start: 0.06em;
  border-radius: 1px;
  background: var(--color-brand);
  vertical-align: -0.12em;
}

.ff-typewriter__caret--ghost {
  animation: none;
  opacity: 0;
}

.ff-typewriter__live--typing .ff-typewriter__caret {
  animation: ff-typewriter-caret 1.06s steps(1, end) infinite;
}

.ff-typewriter__live:not(.ff-typewriter__live--typing) .ff-typewriter__caret {
  opacity: 0;
  transition: opacity var(--transition-base) 500ms;
}

@keyframes ff-typewriter-caret {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ff-typewriter__caret {
    animation: none;
    opacity: 0;
  }
}
</style>
