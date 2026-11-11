<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { IonContent, IonFooter, IonPage, IonRefresher, IonRefresherContent } from '@ionic/vue'
import type { RefresherCustomEvent } from '@ionic/vue'
import { ArrowLeft, ArrowRight, Check, ShieldAlert, Star, Stethoscope } from '@lucide/vue'
import { useRoute } from 'vue-router'
import AppLink from '@/components/AppLink.vue'
import PageHeader from '@/components/PageHeader.vue'
import ServiceIcon from '@/components/ServiceIcon.vue'
import { useSession } from '@/composables/useSession'
import { refreshPage } from '@/composables/usePageRefresh'
import {
  NONE_OF_THESE_ID,
  URGENCY_OPTIONS,
  diagnose,
  findSymptom,
  getSymptoms,
  parseUrgency,
  requestHref,
} from '@/domain/diagnostics'
import type { DiagnosisUrgency } from '@/domain/diagnostics'
import { SERVICES, getService } from '@/domain/services'
import { ServiceIdSchema } from '@/domain/types'
import type { ServiceId } from '@/domain/types'

type Step = 'service' | 'symptom' | 'urgency' | 'result'

const PROGRESS = ['Service', 'Symptom', 'Urgency'] as const
const STEP_INDEX: Record<Step, number> = { service: 0, symptom: 1, urgency: 2, result: 3 }

const route = useRoute()
const { state } = useSession()

const step = ref<Step>('service')
const serviceId = ref<ServiceId | null>(null)
const symptomId = ref<string | null>(null)
const urgency = ref<DiagnosisUrgency | null>(null)
const heading = ref<HTMLElement | null>(null)

const symptoms = computed(() => (serviceId.value === null ? [] : getSymptoms(serviceId.value)))
const selectedService = computed(() => (serviceId.value === null ? null : getService(serviceId.value)))
const progressIndex = computed(() => STEP_INDEX[step.value])
const signedIn = computed(() => state.value.status === 'signedIn')

const result = computed(() => {
  if (serviceId.value === null) return null
  return diagnose(serviceId.value, symptomId.value, urgency.value)
})

const requestLink = computed(() => {
  if (result.value === null) return '/request/new'
  return requestHref(result.value.serviceId, result.value.symptom.id, result.value.urgency)
})

/** One badge per result, so the screen never shows two labels that disagree. */
const badgeClass = computed(() => {
  if (result.value === null) return ''
  if (result.value.variant === 'safety') return 'ff-badge--danger'
  if (result.value.variant === 'known') return 'ff-badge--brand'
  return ''
})

const requestCtaLabel = computed(() => {
  if (result.value === null) return 'Send this as a request'
  if (result.value.variant === 'unknown') {
    return signedIn.value ? 'Describe the problem' : 'Sign in and describe the problem'
  }
  return signedIn.value ? 'Send this as a request' : 'Sign in and send this request'
})

const appFeedbackLink = computed(() => {
  if (result.value === null) return '/feedback?source=quick_check'
  const params = new URLSearchParams({
    source: 'quick_check',
    service: result.value.serviceId,
    issue: result.value.symptom.id,
    urgency: result.value.urgency,
  })
  return `/feedback?${params.toString()}`
})

onMounted(() => {
  // The landing page can deep-link a service, for example /diagnose?service=electrical.
  const parsed = ServiceIdSchema.safeParse(route.query['service'])
  if (!parsed.success) return
  serviceId.value = parsed.data

  // App feedback can return here with the full diagnosis so the result is not lost.
  const issue = typeof route.query['issue'] === 'string' ? route.query['issue'] : null
  const restoredUrgency = parseUrgency(route.query['urgency'])
  const symptom = findSymptom(parsed.data, issue)
  if (symptom !== null && restoredUrgency !== null) {
    symptomId.value = symptom.id
    urgency.value = restoredUrgency
    step.value = 'result'
    return
  }
  if (symptom !== null) {
    symptomId.value = symptom.id
    step.value = 'urgency'
    return
  }
  step.value = 'symptom'
})

watch(step, async () => {
  await nextTick()
  const target = heading.value
  if (target === null) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.focus({ preventScroll: true })
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
})

function selectService(id: ServiceId): void {
  serviceId.value = id
  symptomId.value = null
  urgency.value = null
  step.value = 'symptom'
}

function selectSymptom(id: string): void {
  symptomId.value = id
  urgency.value = null
  step.value = 'urgency'
}

function selectUrgency(value: DiagnosisUrgency): void {
  urgency.value = value
  step.value = 'result'
}

function restart(): void {
  serviceId.value = null
  symptomId.value = null
  urgency.value = null
  step.value = 'service'
}

function onPullRefresh(event: RefresherCustomEvent): Promise<void> {
  return refreshPage(event)
}
</script>

<template>
  <ion-page>
    <PageHeader title="Quick check" back-href="/" width="wide" />
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="onPullRefresh">
        <ion-refresher-content />
      </ion-refresher>
      <main class="ff-container ff-container--wide diagnose" tabindex="-1">
        <div class="ff-stack ff-stack--loose">
          <ol class="progress" aria-label="Quick check progress">
            <li
              v-for="(label, index) in PROGRESS"
              :key="label"
              class="progress__item"
              :class="{ 'is-current': progressIndex === index, 'is-done': progressIndex > index }"
              :aria-current="progressIndex === index ? 'step' : undefined"
            >
              <span class="progress__dot" aria-hidden="true">
                <Check v-if="progressIndex > index" class="ff-icon ff-icon--sm" />
                <span v-else>{{ index + 1 }}</span>
              </span>
              <span class="progress__label">{{ label }}</span>
            </li>
          </ol>

          <section v-if="step === 'service'" class="ff-stack step" aria-labelledby="service-step-title">
            <div class="ff-stack ff-stack--tight">
              <p class="ff-overline">Step 1 of 3</p>
              <h2 id="service-step-title" ref="heading" class="ff-h2" tabindex="-1">What needs fixing?</h2>
              <p class="ff-meta">Choose the closest category. You can change it on the next step.</p>
              <p class="ff-meta diagnose__note">
                <Stethoscope class="ff-icon ff-icon--sm" aria-hidden="true" />
                This check is general guidance. It does not replace an inspection by the shop.
              </p>
            </div>
            <div class="options">
              <button
                v-for="service in SERVICES"
                :key="service.id"
                type="button"
                class="option option--row"
                :class="{ 'is-selected': serviceId === service.id }"
                :aria-pressed="serviceId === service.id"
                @click="selectService(service.id)"
              >
                <ServiceIcon :service-id="service.id" />
                <span class="option__text">
                  <span class="option__label">{{ service.name }}</span>
                  <span class="option__hint">{{ service.blurb }}</span>
                </span>
                <ArrowRight class="ff-icon ff-icon--sm option__arrow" aria-hidden="true" />
              </button>
            </div>
          </section>

          <section v-else-if="step === 'symptom'" class="ff-stack step" aria-labelledby="symptom-step-title">
            <div class="ff-stack ff-stack--tight">
              <button type="button" class="back" @click="step = 'service'">
                <ArrowLeft class="ff-icon ff-icon--sm" aria-hidden="true" />
                Back to services
              </button>
              <p class="ff-overline">Step 2 of 3</p>
              <h2 id="symptom-step-title" ref="heading" class="ff-h2" tabindex="-1">
                {{ selectedService?.name ?? 'Choose a symptom' }}
              </h2>
              <p class="ff-meta">Which of these is closest to what you see?</p>
              <p class="ff-meta diagnose__note">
                <Stethoscope class="ff-icon ff-icon--sm" aria-hidden="true" />
                This check is general guidance. It does not replace an inspection by the shop.
              </p>
            </div>
            <div class="options">
              <button
                v-for="symptom in symptoms"
                :key="symptom.id"
                type="button"
                class="option option--row"
                :class="{ 'is-selected': symptomId === symptom.id }"
                :aria-pressed="symptom.id === symptomId"
                @click="selectSymptom(symptom.id)"
              >
                <span class="option__text">
                  <span class="option__label">{{ symptom.label }}</span>
                  <span class="option__hint">{{ symptom.hint }}</span>
                </span>
                <ArrowRight class="ff-icon ff-icon--sm option__arrow" aria-hidden="true" />
              </button>
              <button
                type="button"
                class="option option--row option--escape"
                :aria-pressed="symptomId === NONE_OF_THESE_ID"
                @click="selectSymptom(NONE_OF_THESE_ID)"
              >
                <span class="option__text">
                  <span class="option__label">None of these match</span>
                  <span class="option__hint">Describe it in your own words and the shop will check it.</span>
                </span>
                <ArrowRight class="ff-icon ff-icon--sm option__arrow" aria-hidden="true" />
              </button>
            </div>
          </section>

          <section v-else-if="step === 'urgency'" class="ff-stack step" aria-labelledby="urgency-step-title">
            <div class="ff-stack ff-stack--tight">
              <button type="button" class="back" @click="step = 'symptom'">
                <ArrowLeft class="ff-icon ff-icon--sm" aria-hidden="true" />
                Back to symptoms
              </button>
              <p class="ff-overline">Step 3 of 3</p>
              <h2 id="urgency-step-title" ref="heading" class="ff-h2" tabindex="-1">
                How soon do you need help?
              </h2>
              <p class="ff-meta">
                This helps the shop prioritize the request. It does not confirm urgency.
              </p>
              <p class="ff-meta diagnose__note">
                <Stethoscope class="ff-icon ff-icon--sm" aria-hidden="true" />
                This check is general guidance. It does not replace an inspection by the shop.
              </p>
            </div>
            <div class="options">
              <button
                v-for="option in URGENCY_OPTIONS"
                :key="option.value"
                type="button"
                class="option option--row"
                :class="{ 'is-selected': urgency === option.value }"
                :aria-pressed="urgency === option.value"
                @click="selectUrgency(option.value)"
              >
                <span class="option__text">
                  <span class="option__label">{{ option.label }}</span>
                  <span class="option__hint">{{ option.hint }}</span>
                </span>
                <ArrowRight class="ff-icon ff-icon--sm option__arrow" aria-hidden="true" />
              </button>
            </div>
          </section>

          <section
            v-else-if="result !== null"
            class="ff-stack result"
            aria-labelledby="result-title"
          >
            <div class="result__lead">
              <div class="result__intro">
                <div class="result__tags">
                  <p class="ff-badge" :class="badgeClass">{{ result.badgeLabel }}</p>
                  <p class="ff-overline">{{ selectedService?.name }}</p>
                </div>
                <h2 id="result-title" ref="heading" class="ff-h2" tabindex="-1">
                  {{ result.title }}
                </h2>
                <p class="ff-lead">{{ result.symptom.likelyCause }}</p>
              </div>

              <aside
                v-if="result.safetyNote.length > 0"
                class="result__safety"
                :class="{ 'is-urgent': result.safety === 'urgent' }"
                aria-labelledby="safety-title"
              >
                <ShieldAlert class="ff-icon ff-icon--lg" aria-hidden="true" />
                <div class="result__safety-body">
                  <h3 id="safety-title" class="ff-h3">{{ result.safetyTitle }}</h3>
                  <p class="ff-meta">{{ result.safetyNote }}</p>
                </div>
              </aside>

              <div class="result__restart-row">
                <button type="button" class="result__restart" @click="restart">
                  <ArrowLeft class="ff-icon ff-icon--sm" aria-hidden="true" />
                  Check another problem
                </button>
              </div>
            </div>

            <div class="result__detail">
              <section class="result__section">
                <h3 class="ff-h3">What you can do now</h3>
                <p class="result__text">{{ result.symptom.safeStep }}</p>
              </section>

              <section class="result__section">
                <h3 class="ff-h3">Before you book</h3>
                <p class="ff-meta">A few details help the shop quote faster.</p>
                <ul class="prep">
                  <li v-for="tip in result.prepTips" :key="tip">
                    <Check class="ff-icon ff-icon--sm" aria-hidden="true" />
                    <span>{{ tip }}</span>
                  </li>
                </ul>
              </section>

              <section class="result__section">
                <h3 class="ff-h3">What happens next</h3>
                <p class="result__text">
                  {{ result.nextStep }} You will review an itemized quotation before any work starts.
                </p>
                <p class="ff-meta result__disclaimer">
                  This is general guidance, not a final diagnosis. The shop confirms the fault after
                  inspection.
                </p>
              </section>
            </div>

            <section class="result__feedback" aria-labelledby="result-app-feedback-title">
              <div class="result__feedback-body">
                <p class="ff-overline">App feedback</p>
                <h3 id="result-app-feedback-title" class="ff-h3">Did this quick check help?</h3>
                <p class="ff-meta">
                  Send a note to the FixFlow app team. This is separate from shop feedback.
                </p>
              </div>
              <AppLink
                :to="appFeedbackLink"
                class="ff-btn ff-btn--secondary result__feedback-btn"
              >
                <Star class="ff-icon ff-icon--sm" aria-hidden="true" />
                Rate this app
              </AppLink>
            </section>
          </section>
        </div>
      </main>
    </ion-content>

    <ion-footer v-if="step === 'result' && result !== null" class="result__footer-bar">
      <div class="ff-container ff-container--wide result__footer">
        <div class="result__footer-inner">
          <AppLink :to="requestLink" class="ff-btn ff-btn--primary ff-btn--block">
            {{ requestCtaLabel }}
            <ArrowRight class="ff-icon ff-icon--sm" aria-hidden="true" />
          </AppLink>
          <p class="ff-meta result__hint">
            Add photos on the next screen to help the shop quote faster.
          </p>
        </div>
      </div>
    </ion-footer>
  </ion-page>
</template>

<style scoped>
.diagnose {
  padding-block: var(--space-5) var(--space-12);
}

.diagnose > .ff-stack {
  gap: var(--space-6);
  margin-inline: auto;
  max-width: 760px;
}

/* ------------------------------------------------------------
   Progress
   ------------------------------------------------------------ */
.progress {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
  padding: var(--space-2);
  background: var(--color-track);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  list-style: none;
}

.progress__item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  flex: 1 1 0;
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
}

.progress__item:not(:last-child)::after {
  content: '';
  flex: 1 1 auto;
  height: 1px;
  margin-inline: var(--space-1);
  background: var(--color-border);
}

.progress__item.is-done:not(:last-child)::after {
  background: var(--color-brand-border);
}

.progress__dot {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--space-6);
  height: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
}

.progress__label {
  white-space: nowrap;
}

.progress__item.is-current {
  color: var(--color-text-primary);
}

.progress__item.is-current .progress__dot {
  background: var(--color-brand);
  border-color: var(--color-brand);
  color: var(--color-text-on-brand);
}

.progress__item.is-done .progress__dot {
  background: var(--color-brand-light);
  border-color: var(--color-brand-border);
  color: var(--color-brand-dark);
}

/* ------------------------------------------------------------
   Steps
   ------------------------------------------------------------ */
.step {
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.step > .ff-stack--tight {
  gap: var(--space-2);
}

.step .options {
  margin-top: var(--space-2);
}

.options {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.option {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: var(--space-3);
  min-height: 72px;
  padding: var(--space-4);
  appearance: none;
  background: var(--color-surface);
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-lg);
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color var(--transition-base),
    border-color var(--transition-base),
    box-shadow var(--transition-base),
    transform var(--transition-base);
}

.option:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-brand);
  outline-offset: var(--focus-ring-offset);
}

.option.is-selected {
  background: var(--color-brand-light);
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-light);
}

.option--row {
  align-items: center;
}

/* The escape option sits apart from the listed symptoms, so a miss never looks like a match. */
.option--escape {
  background: transparent;
  border-style: dashed;
}

.option__text {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.option__label {
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
}

.option__hint {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-base);
}

.option__arrow {
  flex: none;
  color: var(--color-text-muted);
}

.back {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: var(--space-1);
  min-height: var(--touch-min);
  padding: 0;
  background: transparent;
  border: 0;
  color: var(--color-brand);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
}

.back:hover {
  color: var(--color-brand-dark);
}

/* ------------------------------------------------------------
   Result
   Every block on this screen uses the same radius and border
   language, so the eye reads one system, not five boxes.
   ------------------------------------------------------------ */
.result {
  gap: var(--space-5);
}

/* On phones the lead column dissolves, so its blocks join the main flow in reading order. */
.result__lead {
  display: contents;
}

.result__intro {
  order: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.result__intro .ff-h2 {
  max-width: 28rem;
  text-wrap: balance;
}

.result__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2) var(--space-3);
}

.result__safety {
  order: 2;
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--color-overlay);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-xl);
  color: var(--color-text-secondary);
}

.result__safety.is-urgent {
  background: var(--color-danger-light);
  border-color: var(--color-danger-border);
  color: var(--color-danger);
}

.result__safety .ff-icon {
  flex: none;
  margin-top: 2px;
}

.result__safety-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.result__safety .ff-h3 {
  color: inherit;
}

.result__safety.is-urgent .ff-meta {
  color: var(--color-danger);
}

/* One card, three sections, hairline dividers between them. */
.result__detail {
  order: 3;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
}

.result__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-5);
}

.result__section + .result__section {
  border-top: 1px solid var(--color-border);
}

.result__text {
  max-width: 62ch;
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  line-height: var(--leading-base);
}

.prep {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
}

.prep li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-base);
}

.prep .ff-icon {
  flex: none;
  margin-top: 2px;
  color: var(--color-brand);
}

.result__disclaimer {
  padding-top: var(--space-1);
  font-size: var(--text-xs);
}

.result__restart-row {
  order: 4;
  display: flex;
  justify-content: flex-start;
}

.result__restart {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  min-height: var(--touch-min);
  padding: 0;
  background: transparent;
  border: 0;
  color: var(--color-brand);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
}

.result__restart:hover {
  color: var(--color-brand-dark);
}

/* App feedback reads as the quiet footer of the page, not another card. */
.result__feedback {
  order: 5;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-5);
  border-top: 1px solid var(--color-border);
}

.result__feedback-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.result__feedback-btn {
  width: 100%;
}

/* ------------------------------------------------------------
   Footer action
   ------------------------------------------------------------ */
.result__footer-bar {
  --background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

/* The footer reuses the page container so the action lines up with the content column. */
.result__footer.ff-container {
  padding-block: var(--space-3);
  padding-bottom: calc(var(--space-3) + var(--safe-bottom));
}

.result__footer-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 760px;
  margin-inline: auto;
}

.result__hint {
  text-align: center;
}

.diagnose__note {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

@media (hover: hover) {
  .option:hover:not(.is-selected) {
    background: var(--color-overlay);
    border-color: var(--color-border-strong);
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
}

@media (max-width: 30rem) {
  .diagnose {
    padding-block: var(--space-3) var(--space-8);
  }

  .progress {
    gap: var(--space-1);
    padding: var(--space-1);
  }

  .progress__item {
    gap: var(--space-1);
  }

  .progress__item:not(:last-child)::after {
    margin-inline: 0;
  }

  .progress__label {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .step,
  .result__intro {
    padding: var(--space-4);
  }

  .result__section {
    padding: var(--space-4);
  }

  .result__safety {
    padding: var(--space-4);
  }
}

@media (min-width: 48rem) {
  .diagnose > .ff-stack {
    gap: var(--space-8);
  }

  .result {
    gap: var(--space-6);
  }

  .result__feedback {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-6);
  }

  .result__feedback-btn {
    width: auto;
    flex: none;
  }
}

@media (min-width: 64rem) {
  .diagnose {
    padding-block: var(--space-10) var(--space-12);
  }

  .diagnose > .ff-stack {
    max-width: 960px;
  }

  .result__footer-inner {
    max-width: 960px;
  }

  .step {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-4) var(--space-12);
    align-items: start;
  }

  .step > .ff-stack--tight {
    position: sticky;
    top: var(--space-4);
  }

  .result {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: var(--space-6) var(--space-10);
    align-items: start;
  }

  .result__lead {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    grid-column: 1;
    grid-row: 1;
  }

  .result__detail {
    grid-column: 2;
    grid-row: 1;
  }

  .result__feedback {
    grid-column: 1 / -1;
  }
}
</style>
