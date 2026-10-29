<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { IonContent, IonPage } from '@ionic/vue'
import { Check, Send } from '@lucide/vue'
import { useRoute } from 'vue-router'
import AppButton from '@/components/AppButton.vue'
import AppLink from '@/components/AppLink.vue'
import FormField from '@/components/FormField.vue'
import PageHeader from '@/components/PageHeader.vue'
import RatingInput from '@/components/RatingInput.vue'
import { useAsyncAction } from '@/composables/useAsyncAction'
import { submitAppFeedback } from '@/data/repo'
import { diagnosisHref, findSymptom, parseUrgency } from '@/domain/diagnostics'
import { ValidationError, userMessage } from '@/domain/errors'
import { APP_FEEDBACK_COMMENT_LIMIT, ServiceIdSchema } from '@/domain/types'
import type { AppFeedbackSource, AppFeedbackTopic } from '@/domain/types'

const TOPIC_OPTIONS = [
  { value: 'quick_check', label: 'Quick check result' },
  { value: 'app_problem', label: 'App problem' },
  { value: 'idea', label: 'Idea or suggestion' },
  { value: 'other', label: 'Something else' },
] as const satisfies readonly { value: AppFeedbackTopic; label: string }[]

const route = useRoute()

const source = computed<AppFeedbackSource>(() =>
  route.query['source'] === 'quick_check' ? 'quick_check' : 'direct',
)
const rating = ref(0)
const topic = ref<AppFeedbackTopic>(source.value === 'quick_check' ? 'quick_check' : 'other')
const comment = ref('')
const sent = ref(false)
const successHeading = ref<HTMLElement | null>(null)

const backHref = computed(() => {
  const parsedService = ServiceIdSchema.safeParse(route.query['service'])
  const issue = typeof route.query['issue'] === 'string' ? route.query['issue'] : null
  const urgency = parseUrgency(route.query['urgency'])
  if (!parsedService.success || issue === null || urgency === null) return '/diagnose'
  if (findSymptom(parsedService.data, issue) === null) return '/diagnose'
  return diagnosisHref(parsedService.data, issue, urgency)
})

const submit = useAsyncAction(async () =>
  submitAppFeedback(
    {
      rating: rating.value,
      topic: topic.value,
      comment: comment.value,
    },
    source.value,
  ),
)

const formError = computed(() => {
  const error = submit.error.value
  return error === null || error instanceof ValidationError ? null : userMessage(error)
})

function fieldError(field: string): string | undefined {
  return submit.fieldErrors.value[field]?.[0]
}

async function onSubmit(): Promise<void> {
  const id = await submit.run()
  if (id === undefined) return
  sent.value = true
  await nextTick()
  successHeading.value?.focus()
}
</script>

<template>
  <ion-page>
    <PageHeader title="App feedback" :back-href="backHref" width="wide" />
    <ion-content>
      <main class="ff-container ff-container--wide feedback" tabindex="-1">
        <div class="feedback__layout">
          <section class="feedback__intro ff-stack" aria-labelledby="feedback-title">
            <div class="ff-stack ff-stack--tight">
              <p class="ff-overline">FixFlow app</p>
              <h2 id="feedback-title" class="ff-h1">Help improve FixFlow</h2>
            </div>
            <p class="ff-lead">
              Tell us what worked, what felt confusing, or what you want to see next.
            </p>
            <p class="ff-meta">
              This feedback goes to the FixFlow app team, not the repair shop. For a completed
              repair, open the request in your account and use the service feedback option.
            </p>
            <p class="ff-meta">
              Do not include passwords, payment details, or other personal information.
            </p>
          </section>

          <div class="ff-card feedback__card">
            <div v-if="sent" class="ff-stack">
              <span class="feedback__success-icon" aria-hidden="true">
                <Check class="ff-icon ff-icon--lg" />
              </span>
              <h3 ref="successHeading" class="ff-h2" tabindex="-1">Thanks for the feedback</h3>
              <p class="ff-meta">Your note helps us improve the Quick check and the app.</p>
              <div class="feedback__success-actions">
                <AppLink :to="backHref" class="ff-btn ff-btn--primary ff-btn--block">
                  Back to Quick check
                </AppLink>
                <AppLink to="/" class="ff-btn ff-btn--secondary ff-btn--block">Go home</AppLink>
              </div>
            </div>

            <form
              v-else
              class="ff-stack ff-stack--loose"
              aria-labelledby="feedback-form-title"
              novalidate
              @submit.prevent="onSubmit"
            >
              <div class="ff-stack ff-stack--tight">
                <h3 id="feedback-form-title" class="ff-h2">Your feedback</h3>
                <p class="ff-meta">A rating alone helps. Add a note if something needs attention.</p>
              </div>

              <RatingInput
                v-model="rating"
                legend="How useful is FixFlow so far?"
                :error="fieldError('rating')"
              />

              <FormField v-slot="field" label="What is this about?" :error="fieldError('topic')">
                <select
                  :id="field.id"
                  v-model="topic"
                  class="ff-select"
                  :aria-invalid="field.invalid"
                  :aria-describedby="field.describedBy"
                >
                  <option v-for="option in TOPIC_OPTIONS" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </FormField>

              <FormField
                v-slot="field"
                label="What should we improve?"
                optional
                :hint="`${comment.length} of ${APP_FEEDBACK_COMMENT_LIMIT} characters`"
                :error="fieldError('comment')"
              >
                <textarea
                  :id="field.id"
                  v-model="comment"
                  class="ff-textarea"
                  :maxlength="APP_FEEDBACK_COMMENT_LIMIT"
                  placeholder="What were you trying to do? What worked or felt confusing?"
                  :aria-invalid="field.invalid"
                  :aria-describedby="field.describedBy"
                />
              </FormField>

              <p v-if="formError" class="ff-error-text" role="alert">{{ formError }}</p>

              <AppButton type="submit" block :loading="submit.loading.value">
                <Send class="ff-icon ff-icon--sm" aria-hidden="true" />
                Send app feedback
              </AppButton>
            </form>
          </div>
        </div>
      </main>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.feedback {
  padding-block: var(--space-4) var(--space-10);
}

.feedback__layout {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.feedback__intro {
  max-width: 42rem;
}

.feedback__card {
  width: 100%;
  max-width: 40rem;
  padding: var(--space-4);
}

.feedback__success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--space-10);
  height: var(--space-10);
  background: var(--color-success-light);
  border: 1px solid var(--color-success-border);
  border-radius: var(--radius-full);
  color: var(--color-success);
}

.feedback__success-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

@media (min-width: 48rem) {
  .feedback__success-actions {
    flex-direction: row;
  }

  .feedback__success-actions .ff-btn {
    width: auto;
    flex: 1 1 12rem;
  }
}

@media (min-width: 48rem) and (max-width: 63.999rem) {
  .feedback__layout {
    align-items: center;
  }

  .feedback__intro {
    width: 100%;
    max-width: 40rem;
  }
}

@media (min-width: 64rem) {
  .feedback {
    padding-block: var(--space-6) var(--space-12);
  }

  .feedback__layout {
    display: grid;
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: var(--space-6) var(--space-12);
    align-items: start;
  }

  .feedback__card {
    padding: var(--space-6);
  }
}
</style>
