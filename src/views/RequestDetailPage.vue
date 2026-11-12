<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { IonContent, IonFooter, IonPage, IonRefresher, IonRefresherContent, onIonViewWillEnter } from '@ionic/vue'
import type { RefresherCustomEvent } from '@ionic/vue'
import { SearchX } from '@lucide/vue'
import AppButton from '@/components/AppButton.vue'
import AppLink from '@/components/AppLink.vue'
import DisclosureSection from '@/components/DisclosureSection.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import ErrorState from '@/components/ErrorState.vue'
import ImageGallery from '@/components/ImageGallery.vue'
import PageHeader from '@/components/PageHeader.vue'
import QuotationSummary from '@/components/QuotationSummary.vue'
import RatingStars from '@/components/RatingStars.vue'
import SkeletonList from '@/components/SkeletonList.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import StatusStepper from '@/components/StatusStepper.vue'
import RequestActions from '@/components/request/RequestActions.vue'
import { refreshPage } from '@/composables/usePageRefresh'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { loadRequests, upsertRequest, useRequests } from '@/composables/useRequests'
import { requireActor, useSession } from '@/composables/useSession'
import { showToast } from '@/composables/useToast'
import { getRequest, getRequestImages } from '@/data/repo'
import type { StoredImage } from '@/data/repo'
import type { AsyncState } from '@/domain/async'
import { toAppError, userMessage } from '@/domain/errors'
import { formatDate, formatDateTime, formatLongDay, formatRelative, formatTime } from '@/domain/format'
import { logger } from '@/domain/logger'
import { getService } from '@/domain/services'
import type { ServiceRequest } from '@/domain/types'
import { actionOwner, availableActions, nextStepText, pendingRevision } from '@/domain/workflow'

// Props instead of useRoute(): see the route definition.
const props = defineProps<{ id: string }>()

const { role } = useSession()
const { list, customerOf, customersById } = useRequests()

const detail = shallowRef<AsyncState<ServiceRequest>>({ status: 'loading' })
const images = shallowRef<AsyncState<StoredImage[]>>({ status: 'idle' })
const now = ref(Date.now())

const request = computed(() => (detail.value.status === 'success' ? detail.value.data : null))
const service = computed(() => (request.value === null ? null : getService(request.value.serviceId)))
const customer = computed(() => (request.value === null ? undefined : customerOf(request.value.customerId)))
const hasActions = computed(
  () => request.value !== null && role.value !== null && availableActions(request.value.status, role.value).length > 0,
)
const yourTurn = computed(() => request.value !== null && actionOwner(request.value.status) === role.value)
/** The revision request the shop still owes a revised quotation for. */
const revision = computed(() => (request.value === null ? null : pendingRevision(request.value)))

/** Shows the cached copy at once, then refreshes it. A failed refresh keeps what is on screen. */
async function loadRequest(options: { silent?: boolean } = {}): Promise<void> {
  if (detail.value.status !== 'success') {
    const cached = list.value.find((item) => item.id === props.id)
    detail.value = cached === undefined ? { status: 'loading' } : { status: 'success', data: cached }
  }
  try {
    const fresh = await getRequest(requireActor(), props.id)
    // A read that started earlier can finish later. It must not undo a newer change.
    if (detail.value.status === 'success' && detail.value.data.updatedAt > fresh.updatedAt) return
    upsertRequest(fresh)
    detail.value = { status: 'success', data: fresh }
  } catch (error) {
    const appError = toAppError(error)
    logger.error('Loading a request failed', appError, { requestId: props.id })
    if (detail.value.status !== 'success') {
      detail.value = { status: 'error', error: appError }
      return
    }
    if (options.silent !== true) showToast('error', `Could not refresh. ${userMessage(appError)}`)
  }
}

async function loadImages(): Promise<void> {
  images.value = { status: 'loading' }
  try {
    images.value = { status: 'success', data: await getRequestImages(requireActor(), props.id) }
  } catch (error) {
    const appError = toAppError(error)
    logger.error('Loading request photos failed', appError, { requestId: props.id })
    images.value = { status: 'error', error: appError }
  }
}

onIonViewWillEnter(() => {
  now.value = Date.now()
  // Independent requests start together, so none waits on another.
  // Each function handles its own errors and never rejects.
  const jobs: Promise<void>[] = [loadRequest(), loadImages()]
  if (role.value === 'owner' && customersById.value.size === 0) jobs.push(loadRequests({ silent: true }))
  void Promise.all(jobs)
})

// Keeps the screen in step with the other device. A finished request cannot change, so the reads stop.
useAutoRefresh(
  () => {
    now.value = Date.now()
    return loadRequest({ silent: true })
  },
  8000,
  () => {
    const status = request.value?.status
    return status !== 'completed' && status !== 'declined'
  },
)

function onUpdated(next: ServiceRequest): void {
  detail.value = { status: 'success', data: next }
  now.value = Date.now()
}

function onPullRefresh(event: RefresherCustomEvent): Promise<void> {
  return refreshPage(event, () => loadRequest())
}
</script>

<template>
  <ion-page>
    <PageHeader :title="request?.ref ?? 'Request'" back-href="/tabs/requests" :heading="false" />

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="onPullRefresh">
        <ion-refresher-content />
      </ion-refresher>
      <main class="ff-container ff-container--wide ff-stack" tabindex="-1">
        <ErrorBoundary title="This request could not be shown">
          <SkeletonList v-if="detail.status === 'loading' || detail.status === 'idle'" :count="2" />

          <EmptyState
            v-else-if="detail.status === 'error' && detail.error.code === 'NOT_FOUND'"
            :icon="SearchX"
            title="Request not found"
            body="It may have been removed, or it belongs to another account."
          >
            <AppLink to="/tabs/requests" class="ff-btn ff-btn--primary">Back to requests</AppLink>
          </EmptyState>

          <ErrorState
            v-else-if="detail.status === 'error'"
            :error="detail.error"
            title="This request could not load"
            @retry="loadRequest"
          />

          <template v-else-if="request && service && role">
            <header class="masthead" aria-labelledby="detail-title">
              <div class="masthead__identity">
                <div class="masthead__status">
                  <StatusBadge :request="request" />
                  <span class="ff-meta">Updated {{ formatRelative(request.updatedAt, now) }}</span>
                </div>
                <h1 id="detail-title" class="ff-h1 masthead__title">{{ request.itemName }}</h1>
                <p class="ff-meta">{{ service.name }}, submitted {{ formatDate(request.createdAt) }}</p>
              </div>
              <p class="ff-inset next" :class="{ 'is-turn': yourTurn }">
                <strong v-if="yourTurn" class="next__turn">Your turn: </strong>{{ nextStepText(request, role) }}
              </p>
            </header>

            <div class="detail__layout">
              <div class="detail__main">
                <section class="ff-card ff-stack problem-card" aria-labelledby="detail-problem">
                  <h2 id="detail-problem" class="ff-h3">The problem</h2>
                  <p class="problem">{{ request.description }}</p>
                  <dl class="facts">
                    <div>
                      <dt class="ff-meta">Service</dt>
                      <dd>{{ request.mode === 'home_visit' ? 'Home visit' : 'Drop off at the shop' }}</dd>
                    </div>
                    <div v-if="request.mode === 'home_visit'">
                      <dt class="ff-meta">Address</dt>
                      <dd>{{ request.address }}</dd>
                    </div>
                  </dl>

                  <template v-if="request.imageIds.length > 0">
                    <h3 class="ff-h3">Photos</h3>
                    <SkeletonList v-if="images.status === 'loading' || images.status === 'idle'" :count="1" />
                    <template v-else-if="images.status === 'error'">
                      <p class="ff-error-text" role="alert">{{ userMessage(images.error) }}</p>
                      <AppButton variant="secondary" @click="loadImages">Try again</AppButton>
                    </template>
                    <ImageGallery v-else :images="images.data" />
                  </template>
                </section>

                <section v-if="role === 'owner'" class="ff-card ff-stack customer-card" aria-labelledby="detail-customer">
                  <h2 id="detail-customer" class="ff-h3">Customer</h2>
                  <dl class="facts">
                    <div>
                      <dt class="ff-meta">Name</dt>
                      <dd>{{ customer?.name ?? 'Customer' }}</dd>
                    </div>
                    <div v-if="customer">
                      <dt class="ff-meta">Mobile</dt>
                      <dd><a :href="`tel:${customer.phone}`">{{ customer.phone }}</a></dd>
                    </div>
                    <div v-if="customer">
                      <dt class="ff-meta">Email</dt>
                      <dd><a :href="`mailto:${customer.email}`">{{ customer.email }}</a></dd>
                    </div>
                  </dl>
                </section>

                <section v-if="revision" class="ff-card ff-stack ff-stack--tight" aria-labelledby="detail-revision">
                  <h2 id="detail-revision" class="ff-h3">Revision requested</h2>
                  <p class="revision__reason">{{ revision.note }}</p>
                  <p class="ff-meta">
                    {{ role === 'owner' ? 'By the customer' : 'Requested by you' }}, {{ formatDateTime(revision.at) }}
                  </p>
                </section>

                <section v-if="request.quotation" class="ff-card ff-stack" aria-labelledby="detail-quote">
                  <h2 id="detail-quote" class="ff-h3">Quotation</h2>
                  <QuotationSummary :quotation="request.quotation" :now="now" />
                </section>

                <section v-if="request.feedback" class="ff-card ff-stack ff-stack--tight" aria-labelledby="detail-feedback">
                  <h2 id="detail-feedback" class="ff-h3">Feedback</h2>
                  <RatingStars :rating="request.feedback.rating" />
                  <p v-if="request.feedback.comment.length > 0" class="feedback__comment">{{ request.feedback.comment }}</p>
                  <p class="ff-meta">{{ formatDate(request.feedback.createdAt) }}</p>
                </section>
              </div>

              <div class="detail__aside">
                <DisclosureSection title="Progress" default-open>
                  <StatusStepper :request="request" :role="role" />
                </DisclosureSection>

                <section v-if="request.appointment" class="ff-card ff-stack ff-stack--tight" aria-labelledby="detail-appointment">
                  <h2 id="detail-appointment" class="ff-h3">Appointment</h2>
                  <p class="ff-h2">{{ formatLongDay(request.appointment.startAt) }}</p>
                  <p class="ff-meta">
                    {{ formatTime(request.appointment.startAt) }},
                    {{ request.mode === 'home_visit' ? 'the technician will visit the address above' : 'bring the item to the shop' }}.
                  </p>
                </section>
              </div>
            </div>
          </template>
        </ErrorBoundary>
      </main>
    </ion-content>

    <ion-footer v-if="request && role && hasActions">
      <RequestActions :request="request" :role="role" @updated="onUpdated" @stale="loadRequest" />
    </ion-footer>
  </ion-page>
</template>

<style scoped>
.masthead {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.masthead__identity {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}

.masthead__status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.next {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.next.is-turn {
  background: var(--color-brand-light);
  border-color: var(--color-brand-border);
  color: var(--color-text-primary);
}

.next__turn {
  color: var(--color-brand-dark);
}

.problem {
  max-width: 68ch;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.facts {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: 0;
}

.facts dd {
  margin: 0;
  font-weight: var(--weight-semibold);
  overflow-wrap: anywhere;
}

/* Contact links get the same 44px row treatment as the profile screen. */
.facts dd a {
  display: flex;
  align-items: center;
  min-height: var(--touch-min);
  margin-inline: calc(var(--space-2) * -1);
  padding-inline: var(--space-2);
  border-radius: var(--radius-sm);
  color: var(--color-brand-dark);
  text-decoration: none;
}

@media (hover: hover) {
  .facts dd a:hover {
    background: var(--color-overlay);
  }
}

.feedback__comment {
  max-width: 68ch;
  overflow-wrap: anywhere;
}

.revision__reason {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.detail__layout {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.detail__main,
.detail__aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

@media (min-width: 64rem) {
  .masthead {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 24rem);
    align-items: end;
    gap: var(--space-6);
  }

  .masthead__title {
    overflow-wrap: anywhere;
  }

  .detail__layout {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(20rem, 1fr);
    align-items: start;
    gap: var(--space-6);
  }

  .detail__main,
  .detail__aside {
    gap: var(--space-6);
  }

  .problem-card .facts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-4);
    padding-top: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  .customer-card .facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
  }
}
</style>
