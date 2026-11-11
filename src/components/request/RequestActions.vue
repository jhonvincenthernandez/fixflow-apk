<script setup lang="ts">
import { computed, ref, shallowRef, useId } from 'vue'
import type { Component } from 'vue'
import {
  Ban,
  BadgeCheck,
  CalendarCheck,
  CircleCheck,
  CircleX,
  PencilLine,
  Play,
  Receipt,
  Search,
  Star,
} from '@lucide/vue'
import AppButton from '@/components/AppButton.vue'
import FormField from '@/components/FormField.vue'
import QuotationEditor from '@/components/QuotationEditor.vue'
import RatingInput from '@/components/RatingInput.vue'
import SheetModal from '@/components/SheetModal.vue'
import SlotPicker from '@/components/SlotPicker.vue'
import SkeletonList from '@/components/SkeletonList.vue'
import ErrorState from '@/components/ErrorState.vue'
import { useAsyncAction } from '@/composables/useAsyncAction'
import { runAction } from '@/composables/useRequests'
import { requireActor } from '@/composables/useSession'
import { showToast } from '@/composables/useToast'
import { getScheduleContext } from '@/data/repo'
import type { ScheduleContext } from '@/data/repo'
import type { AsyncState } from '@/domain/async'
import { toAppError, userMessage } from '@/domain/errors'
import { logger } from '@/domain/logger'
import type { QuotationDraft, Role, ServiceRequest } from '@/domain/types'
import { actionLabel, availableActions, hasRevisionRequest } from '@/domain/workflow'
import type { ActionId, ActionInput } from '@/domain/workflow'

const props = defineProps<{ request: ServiceRequest; role: Role }>()

const emit = defineEmits<{
  /** The request changed. The parent swaps it in without another round trip. */
  updated: [request: ServiceRequest]
  /** The request moved on elsewhere (a conflict). The parent should reload it. */
  stale: []
}>()

type SheetKind = 'quotation' | 'schedule' | 'reason' | 'feedback'
type ReasonAction = Extract<ActionId, 'cancel' | 'decline_quotation' | 'request_revision'>

const ICONS: Record<ActionId, Component> = {
  start_review: Search,
  send_quotation: Receipt,
  revise_quotation: PencilLine,
  accept_quotation: BadgeCheck,
  request_revision: PencilLine,
  decline_quotation: CircleX,
  schedule: CalendarCheck,
  start_service: Play,
  complete_service: CircleCheck,
  submit_feedback: Star,
  cancel: Ban,
}

const SUCCESS_TEXT: Record<ActionId, string> = {
  start_review: 'Review started. The customer was notified.',
  send_quotation: 'Quotation sent to the customer.',
  revise_quotation: 'Quotation taken back. You can prepare a new one.',
  accept_quotation: 'Quotation accepted. Next, choose an appointment time.',
  request_revision: 'Revision requested. The shop was notified.',
  decline_quotation: 'Quotation declined.',
  schedule: 'Appointment saved.',
  start_service: 'Service started.',
  complete_service: 'Marked as completed. The customer can now leave feedback.',
  submit_feedback: 'Thanks for your feedback.',
  cancel: 'Request cancelled.',
}

/** Copy for the shared reason sheet. Each reason action has its own wording. */
interface ReasonSheetCopy {
  readonly title: string
  readonly body: string
  readonly label: string
  readonly secondaryLabel: string
  readonly placeholder: string
  readonly optional: boolean
  readonly danger: boolean
}

const REASON_SHEET: Record<ReasonAction, ReasonSheetCopy> = {
  cancel: {
    title: 'Cancel this request?',
    body: 'The request will close and the other side will be notified. This cannot be undone.',
    label: 'Cancel request',
    secondaryLabel: 'Keep request',
    placeholder: 'Tell them why',
    optional: true,
    danger: true,
  },
  decline_quotation: {
    title: 'Decline this quotation?',
    body: 'The request will close and the shop will be notified. You can send a new request any time. If the price is the problem, ask for a revised quotation instead.',
    label: 'Decline quotation',
    secondaryLabel: 'Review again',
    placeholder: 'Tell them why',
    optional: true,
    danger: true,
  },
  request_revision: {
    title: 'Request a revised quotation?',
    body: 'The shop is asked to send a new quotation. You can accept or decline it once it arrives.',
    label: 'Request revision',
    secondaryLabel: 'Not now',
    placeholder: 'Tell the shop what to change',
    optional: false,
    danger: false,
  },
}

const quotationFormId = useId()

const sheet = ref<SheetKind | null>(null)
const reasonAction = ref<ReasonAction>('cancel')
const pending = ref<ActionId | null>(null)

const reason = ref('')
const rating = ref(0)
const comment = ref('')
const selectedStart = ref<number | null>(null)
const slotsNow = ref(Date.now())
/** The owner's availability plus the appointments already booked, read together. */
const schedule = shallowRef<AsyncState<ScheduleContext>>({ status: 'idle' })

const runner = useAsyncAction((input: ActionInput) => runAction(props.request.id, input))

const actions = computed(() => {
  const all = availableActions(props.request.status, props.role)
  // Declining a quotation already closes the request, so a second "cancel" would be redundant.
  const withoutCancel = all.includes('decline_quotation') ? all.filter((action) => action !== 'cancel') : all
  // One revision round per request, so the customer cannot ask for a second one.
  return withoutCancel.filter((action) => action !== 'request_revision' || !hasRevisionRequest(props.request))
})

const reasonCopy = computed(() => REASON_SHEET[reasonAction.value])

function variantOf(action: ActionId): 'primary' | 'secondary' | 'danger' {
  if (action === 'cancel' || action === 'decline_quotation') return 'danger'
  if (action === 'revise_quotation' || action === 'request_revision') return 'secondary'
  if (action === 'schedule' && props.request.status === 'scheduled') return 'secondary'
  return 'primary'
}

/** By the workflow rules at most one action per status and role is primary. */
const primaryAction = computed(() => actions.value.find((action) => variantOf(action) === 'primary'))
const otherActions = computed(() => actions.value.filter((action) => action !== primaryAction.value))

const inlineError = computed(() => {
  const error = runner.error.value
  if (error === null) return null
  return runner.fieldErrors.value['_form']?.[0] ?? userMessage(error)
})

function immediateInput(action: ActionId): ActionInput | null {
  switch (action) {
    case 'start_review':
      return { action }
    case 'revise_quotation':
      return { action }
    case 'accept_quotation':
      return { action }
    case 'start_service':
      return { action }
    case 'complete_service':
      return { action }
    case 'send_quotation':
    case 'request_revision':
    case 'decline_quotation':
    case 'schedule':
    case 'submit_feedback':
    case 'cancel':
      return null
    default: {
      const unreachable: never = action
      return unreachable
    }
  }
}

/** Runs one action; on success tells the parent and the user, on a conflict asks for a reload. */
async function perform(input: ActionInput): Promise<boolean> {
  const next = await runner.run(input)
  if (next !== undefined) {
    emit('updated', next)
    showToast('success', SUCCESS_TEXT[input.action])
    return true
  }
  if (runner.error.value?.code === 'CONFLICT') emit('stale')
  return false
}

function closeSheet(): void {
  sheet.value = null
  runner.reset()
}

async function loadSchedule(): Promise<void> {
  schedule.value = { status: 'loading' }
  try {
    schedule.value = { status: 'success', data: await getScheduleContext(requireActor(), props.request.id) }
  } catch (error) {
    const appError = toAppError(error)
    logger.error('Loading the shop schedule failed', appError)
    schedule.value = { status: 'error', error: appError }
  }
}

async function onAction(action: ActionId): Promise<void> {
  const immediate = immediateInput(action)
  if (immediate !== null) {
    pending.value = action
    const done = await perform(immediate)
    pending.value = null
    // Immediate actions have no form to show an error in, so report it as a toast.
    if (!done && runner.error.value !== null) showToast('error', userMessage(runner.error.value))
    return
  }

  runner.reset()
  switch (action) {
    case 'send_quotation':
      sheet.value = 'quotation'
      return
    case 'schedule':
      selectedStart.value = null
      slotsNow.value = Date.now()
      sheet.value = 'schedule'
      await loadSchedule()
      return
    case 'request_revision':
    case 'decline_quotation':
    case 'cancel':
      reasonAction.value = action
      reason.value = ''
      sheet.value = 'reason'
      return
    case 'submit_feedback':
      rating.value = 0
      comment.value = ''
      sheet.value = 'feedback'
      return
    default:
      return
  }
}

async function onQuotationSubmit(draft: QuotationDraft): Promise<void> {
  if (await perform({ action: 'send_quotation', draft })) closeSheet()
}

async function onScheduleConfirm(): Promise<void> {
  const startAt = selectedStart.value
  if (startAt === null) return
  if (await perform({ action: 'schedule', startAt })) {
    closeSheet()
    return
  }
  const code = runner.error.value?.code
  if (code === 'CONFLICT' || code === 'VALIDATION_FAILED') {
    // Someone took the slot first, or the shop changed its hours. Show fresh times and let the user choose again.
    selectedStart.value = null
    await loadSchedule()
  }
}

function buildReasonInput(action: ReasonAction, value: string): ActionInput {
  switch (action) {
    case 'cancel':
      return { action: 'cancel', reason: value }
    case 'decline_quotation':
      return { action: 'decline_quotation', reason: value }
    case 'request_revision':
      return { action: 'request_revision', reason: value }
    default: {
      const unreachable: never = action
      return unreachable
    }
  }
}

async function onReasonConfirm(): Promise<void> {
  const input = buildReasonInput(reasonAction.value, reason.value)
  if (await perform(input)) closeSheet()
}

async function onFeedbackSubmit(): Promise<void> {
  if (await perform({ action: 'submit_feedback', feedback: { rating: rating.value, comment: comment.value } })) {
    closeSheet()
  }
}
</script>

<template>
  <div class="actions">
    <AppButton
      v-if="primaryAction"
      block
      :loading="pending === primaryAction && runner.loading.value"
      :disabled="runner.loading.value && pending !== primaryAction"
      @click="onAction(primaryAction)"
    >
      <component :is="ICONS[primaryAction]" class="ff-icon ff-icon--sm" aria-hidden="true" />
      {{ actionLabel(primaryAction, request.status) }}
    </AppButton>

    <div v-if="otherActions.length > 0" class="actions__row">
      <AppButton
        v-for="action in otherActions"
        :key="action"
        :variant="variantOf(action)"
        :loading="pending === action && runner.loading.value"
        :disabled="runner.loading.value && pending !== action"
        @click="onAction(action)"
      >
        <component :is="ICONS[action]" class="ff-icon ff-icon--sm" aria-hidden="true" />
        {{ actionLabel(action, request.status) }}
      </AppButton>
    </div>
  </div>

  <SheetModal :open="sheet === 'quotation'" title="Prepare quotation" @close="closeSheet">
    <div class="ff-stack">
      <p class="ff-meta">List each part and service. The customer sees this exactly as you write it.</p>
      <QuotationEditor :form-id="quotationFormId" :errors="runner.fieldErrors.value" @submit="onQuotationSubmit" />
      <p v-if="inlineError && Object.keys(runner.fieldErrors.value).length === 0" class="ff-error-text" role="alert">
        {{ inlineError }} Try again.
      </p>
    </div>
    <template #footer>
      <AppButton type="submit" block :form="quotationFormId" :loading="runner.loading.value">Send quotation</AppButton>
    </template>
  </SheetModal>

  <SheetModal
    :open="sheet === 'schedule'"
    :title="request.status === 'scheduled' ? 'Reschedule appointment' : 'Schedule appointment'"
    @close="closeSheet"
  >
    <div class="ff-stack">
      <SkeletonList v-if="schedule.status === 'loading' || schedule.status === 'idle'" :count="1" />
      <ErrorState
        v-else-if="schedule.status === 'error'"
        :error="schedule.error"
        title="Open times could not load"
        @retry="loadSchedule"
      />
      <SlotPicker
        v-else
        v-model="selectedStart"
        :availability="schedule.data.availability"
        :bookings="schedule.data.bookings"
        :now="slotsNow"
      />
      <p v-if="inlineError" class="ff-error-text" role="alert">{{ inlineError }}</p>
    </div>
    <template #footer>
      <AppButton block :disabled="selectedStart === null" :loading="runner.loading.value" @click="onScheduleConfirm">
        Confirm appointment
      </AppButton>
    </template>
  </SheetModal>

  <SheetModal :open="sheet === 'reason'" :title="reasonCopy.title" @close="closeSheet">
    <div class="ff-stack">
      <p>{{ reasonCopy.body }}</p>
      <FormField
        v-slot="field"
        label="Reason"
        :optional="reasonCopy.optional"
        :error="runner.fieldErrors.value['_form']?.[0]"
      >
        <textarea
          :id="field.id"
          v-model="reason"
          class="ff-textarea"
          maxlength="200"
          :placeholder="reasonCopy.placeholder"
          :aria-invalid="field.invalid"
          :aria-describedby="field.describedBy"
        />
      </FormField>
      <p v-if="inlineError && !runner.fieldErrors.value['_form']" class="ff-error-text" role="alert">
        {{ inlineError }} Try again.
      </p>
    </div>
    <template #footer>
      <AppButton
        :variant="reasonCopy.danger ? 'danger' : 'primary'"
        block
        :loading="runner.loading.value"
        @click="onReasonConfirm"
      >
        {{ reasonCopy.label }}
      </AppButton>
      <AppButton variant="secondary" block @click="closeSheet">
        {{ reasonCopy.secondaryLabel }}
      </AppButton>
    </template>
  </SheetModal>

  <SheetModal :open="sheet === 'feedback'" title="Leave feedback" @close="closeSheet">
    <div class="ff-stack">
      <RatingInput v-model="rating" :error="runner.fieldErrors.value['rating']?.[0]" />
      <FormField v-slot="field" label="Comment" optional :error="runner.fieldErrors.value['comment']?.[0]">
        <textarea
          :id="field.id"
          v-model="comment"
          class="ff-textarea"
          maxlength="500"
          placeholder="What went well? What could be better?"
          :aria-invalid="field.invalid"
          :aria-describedby="field.describedBy"
        />
      </FormField>
      <p v-if="inlineError && Object.keys(runner.fieldErrors.value).length === 0" class="ff-error-text" role="alert">
        {{ inlineError }} Try again.
      </p>
    </div>
    <template #footer>
      <AppButton block :loading="runner.loading.value" @click="onFeedbackSubmit">Send feedback</AppButton>
    </template>
  </SheetModal>
</template>

<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  max-width: var(--content-max-wide);
  margin-inline: auto;
  padding: var(--surface-pad) var(--page-pad);
  padding-bottom: calc(var(--surface-pad) + var(--safe-bottom));
}

.actions__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.actions__row > * {
  flex: 1 1 10rem;
}

@media (min-width: 64rem) {
  .actions {
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-start;
  }

  .actions > .ff-btn--block {
    width: auto;
  }

  .actions__row {
    justify-content: flex-end;
  }

  .actions__row > * {
    flex: 0 0 auto;
  }
}
</style>
