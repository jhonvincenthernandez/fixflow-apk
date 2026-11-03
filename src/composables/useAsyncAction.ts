import { computed, shallowRef } from 'vue'
import type { AsyncState } from '@/domain/async'
import { toAppError } from '@/domain/errors'
import type { AppError, FieldErrors } from '@/domain/errors'
import { ValidationError } from '@/domain/errors'
import { logger } from '@/domain/logger'
import { dismissToast, showToast } from './useToast'

const SLOW_OPERATION_DELAY_MS = 700
const SLOW_OPERATION_MESSAGE = 'Still working. This may take a little longer on a slow connection.'

/**
 * Wraps one user-triggered async operation with the four required states:
 * idle, loading, success, error. A second call while loading is ignored, which
 * prevents double submits. The error state is cleared by the next run or by reset().
 */
export function useAsyncAction<Args extends unknown[], Result>(operation: (...args: Args) => Promise<Result>) {
  const state = shallowRef<AsyncState<Result>>({ status: 'idle' })

  async function run(...args: Args): Promise<Result | undefined> {
    if (state.value.status === 'loading') return undefined
    state.value = { status: 'loading' }
    let slowStatusToast: number | null = null
    const slowStatusTimer = setTimeout(() => {
      slowStatusToast = showToast('info', SLOW_OPERATION_MESSAGE, 12000)
    }, SLOW_OPERATION_DELAY_MS)
    try {
      const data = await operation(...args)
      state.value = { status: 'success', data }
      return data
    } catch (error) {
      const appError = toAppError(error)
      // Validation and conflict errors are expected user feedback; only log the unexpected ones.
      if (appError.code === 'STORAGE_FAILED' || appError.code === 'UNKNOWN') {
        logger.error('Action failed', appError)
      }
      state.value = { status: 'error', error: appError }
      return undefined
    } finally {
      clearTimeout(slowStatusTimer)
      if (slowStatusToast !== null) dismissToast(slowStatusToast)
    }
  }

  function reset(): void {
    state.value = { status: 'idle' }
  }

  const loading = computed(() => state.value.status === 'loading')
  const error = computed<AppError | null>(() => (state.value.status === 'error' ? state.value.error : null))
  const fieldErrors = computed<FieldErrors>(() => {
    const current = error.value
    return current instanceof ValidationError ? current.fields : {}
  })

  return { state, run, reset, loading, error, fieldErrors }
}
