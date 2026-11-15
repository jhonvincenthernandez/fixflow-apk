<script setup lang="ts">
import { computed, ref } from 'vue'
import { IonContent, IonPage, IonRefresher, IonRefresherContent, onIonViewWillEnter } from '@ionic/vue'
import type { RefresherCustomEvent } from '@ionic/vue'
import { BellOff, CheckCheck } from '@lucide/vue'
import AppButton from '@/components/AppButton.vue'
import AppLink from '@/components/AppLink.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import ErrorState from '@/components/ErrorState.vue'
import PageHeader from '@/components/PageHeader.vue'
import SkeletonList from '@/components/SkeletonList.vue'
import { loadNotifications, markAllRead, markRead, useNotifications } from '@/composables/useNotifications'
import { refreshPage } from '@/composables/usePageRefresh'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { useAsyncAction } from '@/composables/useAsyncAction'
import { showToast } from '@/composables/useToast'
import { toAppError, userMessage } from '@/domain/errors'
import { countLine, formatRelative } from '@/domain/format'
import { logger } from '@/domain/logger'
import { ALERT_LIST_LIMIT } from '@/data/repo'

const { state, list, unreadCount } = useNotifications()
const now = ref(Date.now())

type Filter = 'all' | 'unread'

const FILTERS: readonly { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
]

const filter = ref<Filter>('all')

/** The alerts the current filter keeps. */
const visible = computed(() =>
  filter.value === 'unread' ? list.value.filter((item) => item.readAt === null) : list.value,
)

onIonViewWillEnter(() => {
  now.value = Date.now()
  void loadNotifications({ silent: true })
})

// The alerts themselves refresh from the app shell, so the badge stays live on
// every screen. This only keeps the relative times on screen honest.
useAutoRefresh(() => {
  now.value = Date.now()
}, 5000)

function onPullRefresh(event: RefresherCustomEvent): Promise<void> {
  return refreshPage(event, () => loadNotifications({ silent: true }))
}

const markAll = useAsyncAction(async () => {
  await markAllRead()
})

async function onOpen(id: string, alreadyRead: boolean): Promise<void> {
  if (alreadyRead) return
  try {
    await markRead(id)
  } catch (error) {
    // Opening the request still works; only the read marker failed.
    const appError = toAppError(error)
    logger.error('Marking an alert as read failed', appError, { id })
    showToast('error', userMessage(appError))
  }
}
</script>

<template>
  <ion-page>
    <PageHeader title="Alerts" />
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="onPullRefresh">
        <ion-refresher-content />
      </ion-refresher>
      <main class="ff-container ff-container--wide ff-stack" tabindex="-1">
        <ErrorBoundary title="Alerts could not load">
          <SkeletonList v-if="state.status === 'loading' || state.status === 'idle'" :count="4" grid />

          <ErrorState
            v-else-if="state.status === 'error'"
            :error="state.error"
            title="Alerts could not load"
            @retry="loadNotifications()"
          />

          <template v-else>
            <EmptyState
              v-if="list.length === 0"
              :icon="BellOff"
              title="No alerts yet"
              body="You will see updates here when a request changes."
            />

            <template v-else>
              <div class="toolbar">
                <div class="chips" role="group" aria-label="Filter alerts">
                  <button
                    v-for="option in FILTERS"
                    :key="option.value"
                    type="button"
                    class="ff-chip"
                    :aria-pressed="filter === option.value"
                    @click="filter = option.value"
                  >
                    {{ option.label }}
                  </button>
                </div>
                <AppButton
                  v-if="unreadCount > 0"
                  variant="ghost"
                  :loading="markAll.loading.value"
                  @click="markAll.run()"
                >
                  <CheckCheck class="ff-icon ff-icon--sm" aria-hidden="true" />
                  Mark all as read
                </AppButton>
              </div>
              <p v-if="markAll.error.value" class="ff-error-text" role="alert">
                {{ userMessage(markAll.error.value) }} Try again.
              </p>

              <p class="ff-meta" aria-live="polite">
                {{ countLine(visible.length, list.length, ALERT_LIST_LIMIT, 'alert') }}
              </p>
              <p v-if="visible.length === 0" class="ff-meta">Nothing unread. You are all caught up.</p>

              <ul v-else class="ff-stack ff-stack--tight alert-list">
                <li v-for="item in visible" :key="item.id">
                  <AppLink
                    :to="`/request/${item.requestId}`"
                    class="ff-card ff-card--interactive alert"
                    :class="{ 'is-unread': item.readAt === null }"
                    @click="onOpen(item.id, item.readAt !== null)"
                  >
                    <span v-if="item.readAt === null" class="alert__dot" aria-hidden="true" />
                    <span class="ff-grow">
                      <span class="alert__title">
                        <span v-if="item.readAt === null" class="ff-sr-only">Unread: </span>{{ item.title }}
                      </span>
                      <span class="ff-meta alert__body">{{ item.body }}</span>
                      <span class="ff-meta ff-muted alert__body">{{ formatRelative(item.createdAt, now) }}</span>
                    </span>
                  </AppLink>
                </li>
              </ul>
            </template>
          </template>
        </ErrorBoundary>
      </main>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2) var(--space-3);
}

.chips {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding-bottom: var(--space-1);
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.alert > .ff-grow {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.alert-list {
  gap: var(--space-3);
}

.alert.is-unread {
  background: var(--color-brand-light);
  border-color: var(--color-brand-border);
}

@media (hover: hover) {
  .alert.is-unread:hover {
    border-color: var(--color-brand);
  }
}

.alert__dot {
  flex: none;
  width: var(--space-2);
  height: var(--space-2);
  margin-top: var(--space-2);
  background: var(--color-brand);
  border-radius: var(--radius-full);
}

.alert__title {
  display: block;
  font-weight: var(--weight-semibold);
}

.alert.is-unread .alert__title {
  font-weight: var(--weight-extrabold);
}

.alert__body {
  display: block;
}

@media (min-width: 64rem) {
  .alert-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
  }

  .alert-list > li {
    display: flex;
  }

  .alert-list .alert {
    flex: 1 1 auto;
  }
}
</style>
