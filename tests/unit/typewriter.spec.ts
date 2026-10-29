import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useTypewriter } from '@/composables/useTypewriter'

const TEXT = 'Fix, flow'

const Host = defineComponent({
  props: {
    text: { type: String, default: TEXT },
    loop: { type: Boolean, default: false },
  },
  setup(props) {
    const { typed, isTyping } = useTypewriter(props.text, {
      startDelayMs: 100,
      letterDelayMs: 10,
      spaceDelayMs: 20,
      punctuationDelayMs: 30,
      loop: props.loop,
      holdMs: 60,
      deleteDelayMs: 5,
      restartDelayMs: 20,
    })
    return { typed, isTyping }
  },
  template: '<p data-test="typed">{{ typed }}</p><p data-test="typing">{{ isTyping }}</p>',
})

function stubReducedMotion(matches: boolean): void {
  const mediaQuery = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList

  vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery))
}

async function advanceUntil(predicate: () => boolean, maxMs = 2000): Promise<void> {
  for (let elapsed = 0; elapsed < maxMs; elapsed += 10) {
    await vi.advanceTimersByTimeAsync(10)
    await nextTick()
    if (predicate()) return
  }
  throw new Error('Condition was not reached before the time limit')
}

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  test('reveals the text one character at a time and then stops', async () => {
    stubReducedMotion(false)
    const wrapper = mount(Host)

    expect(wrapper.get('[data-test="typed"]').text()).toBe('')
    expect(wrapper.get('[data-test="typing"]').text()).toBe('true')

    await vi.advanceTimersByTimeAsync(100)
    await nextTick()
    expect(wrapper.get('[data-test="typed"]').text()).toBe('F')

    await vi.advanceTimersByTimeAsync(10_000)
    await nextTick()
    expect(wrapper.get('[data-test="typed"]').text()).toBe(TEXT)
    expect(wrapper.get('[data-test="typing"]').text()).toBe('false')

    await vi.advanceTimersByTimeAsync(10_000)
    await nextTick()
    expect(wrapper.get('[data-test="typed"]').text()).toBe(TEXT)

    wrapper.unmount()
  })

  test('holds, erases, and retypes the text when looping', async () => {
    stubReducedMotion(false)
    const wrapper = mount(Host, { props: { loop: true } })
    const typed = (): string => wrapper.get('[data-test="typed"]').text()

    await advanceUntil(() => typed() === TEXT)
    expect(wrapper.get('[data-test="typing"]').text()).toBe('true')

    await advanceUntil(() => typed() === '')
    await advanceUntil(() => typed().length > 0)
    expect(wrapper.get('[data-test="typing"]').text()).toBe('true')

    await advanceUntil(() => typed() === TEXT)
    expect(wrapper.get('[data-test="typing"]').text()).toBe('true')

    wrapper.unmount()
  })

  test('shows the full text immediately when reduced motion is requested', async () => {
    stubReducedMotion(true)
    const wrapper = mount(Host, { props: { loop: true } })

    expect(wrapper.get('[data-test="typed"]').text()).toBe(TEXT)
    expect(wrapper.get('[data-test="typing"]').text()).toBe('false')

    await vi.advanceTimersByTimeAsync(10_000)
    await nextTick()
    expect(wrapper.get('[data-test="typed"]').text()).toBe(TEXT)

    wrapper.unmount()
  })

  test('does not start an animation for empty text', () => {
    stubReducedMotion(false)
    const wrapper = mount(Host, { props: { text: '', loop: true } })

    expect(wrapper.get('[data-test="typed"]').text()).toBe('')
    expect(wrapper.get('[data-test="typing"]').text()).toBe('false')

    wrapper.unmount()
  })
})
