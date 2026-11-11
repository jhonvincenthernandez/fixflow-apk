<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import {
  Ban,
  BadgeCheck,
  CalendarCheck,
  CircleCheck,
  CircleX,
  ClipboardList,
  PencilLine,
  Receipt,
  Search,
  Star,
  Wrench,
} from '@lucide/vue'
import type { RequestStatus, ServiceRequest } from '@/domain/types'
import { STATUS_LABEL, pendingRevision } from '@/domain/workflow'

const props = defineProps<{ request: ServiceRequest }>()

type Tone = '' | 'brand' | 'solid' | 'success' | 'danger'

/**
 * Three semantic hues only (policy): neutral and brand tints for the open stages,
 * solid brand for active work, green for finished, red for closed early.
 * Every badge also carries an icon and a text label, so color is never the only signal.
 */
const META: Record<RequestStatus, { icon: Component; tone: Tone }> = {
  requested: { icon: ClipboardList, tone: '' },
  under_review: { icon: Search, tone: '' },
  quotation_sent: { icon: Receipt, tone: 'brand' },
  quotation_accepted: { icon: BadgeCheck, tone: 'brand' },
  scheduled: { icon: CalendarCheck, tone: 'brand' },
  in_progress: { icon: Wrench, tone: 'solid' },
  completed: { icon: CircleCheck, tone: 'success' },
  feedback: { icon: Star, tone: 'success' },
  declined: { icon: CircleX, tone: 'danger' },
  cancelled: { icon: Ban, tone: 'danger' },
}

/** A revision round is the state the request is really in, so it takes over the badge. */
const revision = computed(() => pendingRevision(props.request) !== null)

const meta = computed(() =>
  revision.value ? { icon: PencilLine, tone: 'brand' as Tone } : META[props.request.status],
)

const label = computed(() => (revision.value ? 'Revision requested' : STATUS_LABEL[props.request.status]))
</script>

<template>
  <span class="ff-badge" :class="meta.tone === '' ? undefined : `ff-badge--${meta.tone}`">
    <component :is="meta.icon" class="ff-icon ff-icon--sm" aria-hidden="true" />
    {{ label }}
  </span>
</template>
