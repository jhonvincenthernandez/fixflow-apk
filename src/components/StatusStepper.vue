<script setup lang="ts">
import { computed } from 'vue'
import { Ban, Check, CircleX } from '@lucide/vue'
import { formatDateTime } from '@/domain/format'
import type { Role, ServiceRequest } from '@/domain/types'
import { STAGES, STATUS_LABEL, isClosedEarly } from '@/domain/workflow'

const props = defineProps<{ request: ServiceRequest; role: Role }>()

type StepState = 'done' | 'current' | 'upcoming' | 'closed'

interface Step {
  readonly key: string
  readonly label: string
  readonly description: string
  readonly state: StepState
  readonly at: number | null
  readonly note: string
}

const STATE_PREFIX: Record<StepState, string> = {
  done: 'Completed: ',
  current: 'Current step: ',
  upcoming: 'Upcoming: ',
  closed: 'Closed: ',
}

/** One moment in the request, taken from the history. */
interface Moment {
  readonly key: string
  readonly label: string
  readonly description: string
  readonly at: number
  readonly note: string
  /** The stage this moment belongs to, or a synthetic one for a revision round. */
  readonly stage: string
}

/**
 * The moments of the request in the order they happened.
 * A revision round is a real step, so it gets its own label instead of
 * pretending to be a second review.
 */
function buildMoments(request: ServiceRequest, role: Role): Moment[] {
  const moments: Moment[] = []
  for (const [index, entry] of request.history.entries()) {
    const revision = entry.status === 'under_review' && entry.by === 'customer'
    const stage = STAGES.find((item) => item.status === entry.status)
    moments.push({
      key: `${entry.status}-${entry.at}-${index}`,
      label: revision ? 'Revision requested' : (stage?.label ?? STATUS_LABEL[entry.status]),
      description: revision
        ? role === 'owner'
          ? 'The customer asked for a revised quotation.'
          : 'You asked for a revised quotation.'
        : (stage?.description ?? ''),
      at: entry.at,
      note: entry.note,
      stage: revision ? 'revision_requested' : entry.status,
    })
  }
  return moments
}

/** Two moments on the same stage back to back are one stage, shown at the later time. */
function collapse(moments: Moment[]): Moment[] {
  const result: Moment[] = []
  for (const moment of moments) {
    const previous = result[result.length - 1]
    if (previous !== undefined && previous.stage === moment.stage) {
      result[result.length - 1] = moment
      continue
    }
    result.push(moment)
  }
  return result
}

/** The stages that still lie ahead, judged by the furthest stage already reached. */
function upcomingStages(moments: Moment[]): Step[] {
  const reached = moments
    .map((moment) => STAGES.findIndex((stage) => stage.status === moment.stage))
    .filter((index) => index >= 0)
  const furthest = reached.length > 0 ? Math.max(...reached) : -1
  return STAGES.slice(furthest + 1).map((stage) => ({
    key: stage.status,
    label: stage.label,
    description: stage.description,
    state: 'upcoming' as StepState,
    at: null,
    note: '',
  }))
}

const steps = computed<Step[]>(() => {
  const { request } = props
  const closedEarly = isClosedEarly(request.status)
  const moments = collapse(buildMoments(request, props.role))

  if (closedEarly) {
    // A closed request shows the steps it reached, then how it ended.
    const closure = moments[moments.length - 1]
    const past: Step[] = moments.slice(0, -1).map((moment) => ({
      key: moment.key,
      label: moment.label,
      description: moment.description,
      state: 'done',
      at: moment.at,
      note: moment.note,
    }))
    return [
      ...past,
      {
        key: request.status,
        label: STATUS_LABEL[request.status],
        description: request.closure === null ? '' : `By the ${request.closure.by === 'owner' ? 'shop' : 'customer'}`,
        state: 'closed',
        at: closure?.at ?? null,
        note: request.closure?.reason ?? '',
      },
    ]
  }

  // The last moment is where the request stands now. Everything before it is done.
  const allDone = request.status === 'feedback'
  const timeline: Step[] = moments.map((moment, index) => ({
    key: moment.key,
    label: moment.label,
    description: moment.description,
    state: allDone ? 'done' : index === moments.length - 1 ? 'current' : 'done',
    at: moment.at,
    note: moment.note,
  }))

  return [...timeline, ...upcomingStages(moments)]
})
</script>

<template>
  <ol class="stepper" aria-label="Request progress">
    <li
      v-for="step in steps"
      :key="step.key"
      class="step"
      :class="`step--${step.state}`"
      :aria-current="step.state === 'current' ? 'step' : undefined"
    >
      <span class="step__marker" aria-hidden="true">
        <Check v-if="step.state === 'done'" class="ff-icon ff-icon--sm" />
        <Ban v-else-if="step.state === 'closed' && request.status === 'cancelled'" class="ff-icon ff-icon--sm" />
        <CircleX v-else-if="step.state === 'closed'" class="ff-icon ff-icon--sm" />
        <span v-else-if="step.state === 'current'" class="step__dot" />
      </span>
      <div class="step__body">
        <p class="step__label">
          <span class="ff-sr-only">{{ STATE_PREFIX[step.state] }}</span>{{ step.label }}
        </p>
        <p v-if="step.at !== null" class="ff-meta">{{ formatDateTime(step.at) }}</p>
        <p v-if="step.state === 'current' || step.state === 'closed'" class="ff-meta">{{ step.description }}</p>
        <p v-if="step.note.length > 0" class="ff-meta step__note">{{ step.note }}</p>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.stepper {
  display: flex;
  flex-direction: column;
}

.step {
  position: relative;
  display: flex;
  gap: var(--space-3);
  padding-bottom: var(--space-4);
}

.step:last-child {
  padding-bottom: 0;
}

/* Connector line between markers. */
.step:not(:last-child)::before {
  content: '';
  position: absolute;
  top: var(--stepper-marker);
  bottom: 0;
  left: calc(var(--stepper-marker) / 2 + 1px);
  width: 1px;
  background: var(--color-border);
}

.step--done:not(:last-child)::before {
  background: var(--color-brand);
}

.step__marker {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--stepper-marker);
  height: var(--stepper-marker);
  background: var(--color-surface);
  border: 2px solid var(--color-border-strong);
  border-radius: var(--radius-full);
  color: var(--color-text-on-brand);
  transition:
    background-color var(--transition-base),
    border-color var(--transition-base);
}

.step--done .step__marker {
  background: var(--color-brand);
  border-color: var(--color-brand);
}

.step--current .step__marker {
  background: var(--color-brand-light);
  border-color: var(--color-brand);
}

.step--closed .step__marker {
  background: var(--color-danger);
  border-color: var(--color-danger);
}

.step__dot {
  width: var(--space-2);
  height: var(--space-2);
  background: var(--color-brand);
  border-radius: var(--radius-full);
}

.step__body {
  min-width: 0;
  padding-top: var(--space-1);
}

.step__label {
  font-weight: var(--weight-bold);
  color: var(--color-text-secondary);
}

.step--done .step__label,
.step--current .step__label {
  color: var(--color-text-primary);
}

.step--closed .step__label {
  color: var(--color-danger);
}

.step__note {
  color: var(--color-text-primary);
}
</style>
