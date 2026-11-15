import { readonly, ref } from 'vue'

export type ToastKind = 'success' | 'error' | 'info'

export interface Toast {
  readonly id: number
  readonly kind: ToastKind
  readonly message: string
  /** When set, the message becomes a link to this route. */
  readonly to?: string
  /** Runs when the toast is tapped. */
  readonly onSelect?: () => void
}

export interface ToastOptions {
  /** How long the toast stays on screen. */
  readonly durationMs?: number
  /** When set, the message becomes a link to this route. */
  readonly to?: string
  /** Runs when the toast is tapped. */
  readonly onSelect?: () => void
}

const DEFAULT_DURATION_MS = 4500

const toasts = ref<Toast[]>([])
const timers = new Map<number, ReturnType<typeof setTimeout>>()
let nextId = 1

export function dismissToast(id: number): void {
  const timer = timers.get(id)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(id)
  }
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

export function showToast(kind: ToastKind, message: string, options: ToastOptions = {}): number {
  const id = nextId
  nextId += 1
  toasts.value = [
    ...toasts.value,
    { id, kind, message, to: options.to, onSelect: options.onSelect },
  ]
  timers.set(
    id,
    setTimeout(() => dismissToast(id), options.durationMs ?? DEFAULT_DURATION_MS),
  )
  return id
}

export function useToasts() {
  return { toasts: readonly(toasts), dismissToast }
}
