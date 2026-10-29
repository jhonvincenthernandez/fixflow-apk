import { onBeforeUnmount, onMounted, ref } from 'vue'

export interface TypewriterOptions {
  /** Delay before the first character appears, in milliseconds. */
  readonly startDelayMs?: number
  /** Delay between letters, in milliseconds. */
  readonly letterDelayMs?: number
  /** Delay after a space, in milliseconds. */
  readonly spaceDelayMs?: number
  /** Delay after a comma or a full stop, in milliseconds. */
  readonly punctuationDelayMs?: number
  /** Keep cycling after the full string is revealed. */
  readonly loop?: boolean
  /** Time the full string stays on screen before it is erased, in milliseconds. */
  readonly holdMs?: number
  /** Delay between erased characters, in milliseconds. */
  readonly deleteDelayMs?: number
  /** Pause before the string starts typing again, in milliseconds. */
  readonly restartDelayMs?: number
}

const PUNCTUATION = new Set(['.', ',', '!', '?', ':', ';'])
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function getReducedMotionQuery(): MediaQueryList | undefined {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined
  return window.matchMedia(REDUCED_MOTION_QUERY)
}

/**
 * Reveals a string one character at a time with a short pause at word and
 * sentence boundaries. In loop mode the full string is held, erased, and
 * typed again. The full string is available immediately when the user asks
 * for reduced motion, and every timer is cancelled on unmount.
 */
export function useTypewriter(text: string, options: TypewriterOptions = {}) {
  const {
    startDelayMs = 220,
    letterDelayMs = 26,
    spaceDelayMs = 50,
    punctuationDelayMs = 180,
    loop = false,
    holdMs = 3200,
    deleteDelayMs = 14,
    restartDelayMs = 450,
  } = options

  const motionQuery = getReducedMotionQuery()
  const canAnimate =
    typeof window !== 'undefined' && motionQuery?.matches !== true && text.length > 0
  const typed = ref(canAnimate ? '' : text)
  const isTyping = ref(canAnimate)
  let timer: ReturnType<typeof setTimeout> | undefined
  let index = 0
  let stopped = false

  function delayAfter(char: string): number {
    if (char === ' ') return spaceDelayMs
    if (PUNCTUATION.has(char)) return punctuationDelayMs
    return letterDelayMs
  }

  function clearTimer(): void {
    if (timer === undefined) return
    clearTimeout(timer)
    timer = undefined
  }

  function finish(): void {
    stopped = true
    clearTimer()
    typed.value = text
    isTyping.value = false
  }

  function typeNext(): void {
    if (stopped) return
    index += 1
    typed.value = text.slice(0, index)
    if (index < text.length) {
      timer = setTimeout(typeNext, delayAfter(text[index - 1]))
      return
    }
    if (!loop) {
      isTyping.value = false
      return
    }
    timer = setTimeout(eraseNext, holdMs)
  }

  function eraseNext(): void {
    if (stopped) return
    index -= 1
    typed.value = text.slice(0, index)
    if (index > 0) {
      timer = setTimeout(eraseNext, deleteDelayMs)
      return
    }
    timer = setTimeout(startNextCycle, restartDelayMs)
  }

  function startNextCycle(): void {
    if (stopped) return
    index = 0
    typed.value = ''
    timer = setTimeout(typeNext, letterDelayMs)
  }

  function onMotionChange(event: MediaQueryListEvent): void {
    if (event.matches) finish()
  }

  onMounted(() => {
    if (!canAnimate) return
    motionQuery?.addEventListener('change', onMotionChange)
    timer = setTimeout(typeNext, startDelayMs)
  })

  onBeforeUnmount(() => {
    stopped = true
    motionQuery?.removeEventListener('change', onMotionChange)
    clearTimer()
  })

  return { typed, isTyping }
}
