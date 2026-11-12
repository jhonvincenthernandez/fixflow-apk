<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  onIonViewWillEnter,
} from '@ionic/vue'
import type { RefresherCustomEvent } from '@ionic/vue'
import { ChevronRight, Star } from '@lucide/vue'
import AppLink from '@/components/AppLink.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import ErrorState from '@/components/ErrorState.vue'
import PageHeader from '@/components/PageHeader.vue'
import RatingStars from '@/components/RatingStars.vue'
import SkeletonList from '@/components/SkeletonList.vue'
import { loadRequests, useRequests } from '@/composables/useRequests'
import { refreshPage } from '@/composables/usePageRefresh'
import { formatRelative } from '@/domain/format'
import type { ServiceRequest } from '@/domain/types'

type Review = ServiceRequest & { feedback: NonNullable<ServiceRequest['feedback']> }

const { state, list, customerName } = useRequests()
const now = ref(Date.now())

onIonViewWillEnter(() => {
  now.value = Date.now()
  void loadRequests({ silent: true })
})

/** Every review the shop received, newest first. */
const reviews = computed<Review[]>(() =>
  list.value
    .filter((request): request is Review => request.feedback !== null)
    .sort((a, b) => b.feedback.createdAt - a.feedback.createdAt),
)

const average = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((total, review) => total + review.feedback.rating, 0)
  return Math.round((sum / reviews.value.length) * 10) / 10
})

/** How many reviews each star rating covers, from five stars down to one. */
const distribution = computed(() => {
  const total = reviews.value.length
  const counts = new Map<number, number>()
  for (const review of reviews.value) {
    counts.set(review.feedback.rating, (counts.get(review.feedback.rating) ?? 0) + 1)
  }
  return [5, 4, 3, 2, 1].map((rating) => {
    const count = counts.get(rating) ?? 0
    return { rating, count, percent: total === 0 ? 0 : Math.round((count / total) * 100) }
  })
})

function onPullRefresh(event: RefresherCustomEvent): Promise<void> {
  return refreshPage(event, () => loadRequests({ silent: true }))
}
</script>

<template>
  <ion-page>
    <PageHeader title="Customer feedback" back-href="/tabs/home" />

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="onPullRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <main class="ff-container ff-container--wide ff-stack" tabindex="-1">
        <ErrorBoundary title="Customer feedback could not be shown">
          <SkeletonList v-if="state.status === 'loading' || state.status === 'idle'" :count="4" grid />

          <ErrorState
            v-else-if="state.status === 'error'"
            :error="state.error"
            title="Customer feedback could not load"
            @retry="loadRequests()"
          />

          <template v-else>
            <EmptyState
              v-if="reviews.length === 0"
              :icon="Star"
              title="No customer feedback yet"
              body="Feedback appears here after customers rate a completed repair."
            />

            <template v-else>
              <section class="ff-card summary" aria-labelledby="cf-summary-title">
                <div class="summary__score">
                  <span class="summary__value">{{ average.toFixed(1) }}</span>
                  <div class="ff-stack ff-stack--tight">
                    <h2 id="cf-summary-title" class="ff-h3">Average rating</h2>
                    <RatingStars :rating="Math.round(average)" />
                    <p class="ff-meta">
                      {{ reviews.length }} {{ reviews.length === 1 ? 'review' : 'reviews' }} from customers
                    </p>
                  </div>
                </div>

                <dl class="dist">
                  <div v-for="row in distribution" :key="row.rating" class="dist__row">
                    <dt class="dist__label">{{ row.rating }} {{ row.rating === 1 ? 'star' : 'stars' }}</dt>
                    <dd class="dist__value">
                      <span class="dist__track">
                        <span class="dist__fill" :style="{ width: `${row.percent}%` }" />
                      </span>
                      <span class="dist__count">{{ row.count }}</span>
                    </dd>
                  </div>
                </dl>
              </section>

              <section class="ff-stack" aria-labelledby="cf-reviews-title">
                <div class="ff-row ff-row--between">
                  <h2 id="cf-reviews-title" class="ff-h3">All reviews</h2>
                  <p class="ff-meta">Newest first</p>
                </div>

                <ul class="reviews">
                  <li v-for="review in reviews" :key="review.id">
                    <AppLink :to="`/request/${review.id}`" class="ff-card ff-card--interactive review">
                      <span class="review__top">
                        <RatingStars :rating="review.feedback.rating" />
                        <span class="ff-meta ff-muted">{{ formatRelative(review.feedback.createdAt, now) }}</span>
                      </span>
                      <span class="review__item">{{ review.itemName }} for {{ customerName(review.customerId) }}</span>
                      <span v-if="review.feedback.comment.length > 0" class="review__comment">{{ review.feedback.comment }}</span>
                      <span class="review__cta">
                        Open request
                        <ChevronRight class="ff-icon ff-icon--sm" aria-hidden="true" />
                      </span>
                    </AppLink>
                  </li>
                </ul>
              </section>
            </template>
          </template>
        </ErrorBoundary>
      </main>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.summary__score {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.summary__value {
  font-size: var(--text-3xl);
  font-weight: var(--weight-extrabold);
  line-height: var(--leading-tight);
  color: var(--color-brand);
}

.dist {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
}

.dist__row {
  display: grid;
  grid-template-columns: var(--space-12) minmax(0, 1fr);
  align-items: center;
  gap: var(--space-3);
}

.dist__label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.dist__value {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0;
}

.dist__track {
  flex: 1 1 auto;
  height: var(--space-2);
  background: var(--color-track);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.dist__fill {
  display: block;
  height: 100%;
  background: var(--color-brand);
  border-radius: var(--radius-full);
}

.dist__count {
  flex: none;
  min-width: var(--space-8);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  text-align: right;
}

.reviews {
  display: grid;
  gap: var(--space-3);
}

.reviews li {
  display: flex;
}

.review {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.review__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.review__item {
  font-weight: var(--weight-semibold);
}

.review__comment {
  color: var(--color-text-secondary);
  max-width: 68ch;
}

.review__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  margin-top: auto;
  color: var(--color-brand);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

@media (min-width: 64rem) {
  .summary {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--space-6);
  }

  .reviews {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
