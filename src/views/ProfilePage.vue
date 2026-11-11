<script setup lang="ts">
import { computed, ref } from 'vue'
import { IonContent, IonPage, IonRefresher, IonRefresherContent, onIonViewWillEnter } from '@ionic/vue'
import type { RefresherCustomEvent } from '@ionic/vue'
import { CalendarClock, LogOut } from '@lucide/vue'
import AppearancePanel from '@/components/AppearancePanel.vue'
import AppButton from '@/components/AppButton.vue'
import AppLink from '@/components/AppLink.vue'
import DisclosureSection from '@/components/DisclosureSection.vue'
import PageHeader from '@/components/PageHeader.vue'
import SheetModal from '@/components/SheetModal.vue'
import { loadAvailability, useAvailability } from '@/composables/useAvailability'
import { refreshPage } from '@/composables/usePageRefresh'
import { useNavigate } from '@/composables/useNavigate'
import { signOut, useSession } from '@/composables/useSession'
import { BUSINESS } from '@/domain/business'
import { userMessage } from '@/domain/errors'
import { initials } from '@/domain/format'
import { hoursLines, lunchText, upcomingDaysOff } from '@/domain/availability'
import { formatLongDay } from '@/domain/format'

const { user } = useSession()
const { replace } = useNavigate()
const { state: hoursState, availability } = useAvailability()
const signOutOpen = ref(false)

onIonViewWillEnter(() => {
  void loadAvailability({ silent: true })
})

/** Days off still ahead, for customers who are choosing a date. The owner edits them on their own screen. */
const daysOffAhead = computed(() =>
  availability.value === null
    ? []
    : upcomingDaysOff(availability.value, Date.now(), availability.value.windowDays)
        .slice(0, 5)
        .map((entry) => (entry.label === '' ? formatLongDay(entry.timestamp) : `${formatLongDay(entry.timestamp)} (${entry.label})`)),
)

function onSignOut(): void {
  signOutOpen.value = false
  signOut()
  replace('/auth')
}

function onPullRefresh(event: RefresherCustomEvent): Promise<void> {
  return refreshPage(event)
}
</script>

<template>
  <ion-page>
    <PageHeader title="Profile" />
    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="onPullRefresh">
        <ion-refresher-content />
      </ion-refresher>
      <main class="ff-container ff-container--wide profile-page" tabindex="-1">
        <header v-if="user" class="ff-card profile-head" aria-labelledby="profile-name">
          <span class="profile-head__avatar" aria-hidden="true">{{ initials(user.name) }}</span>
          <div class="profile-head__body">
            <div class="profile-head__identity">
              <h2 id="profile-name" class="ff-h1">{{ user.name }}</h2>
              <span class="ff-badge ff-badge--brand">{{ user.role === 'owner' ? 'Business owner' : 'Customer' }}</span>
            </div>
            <dl class="profile-head__contact">
              <div>
                <dt class="ff-meta">Email</dt>
                <dd><a :href="`mailto:${user.email}`">{{ user.email }}</a></dd>
              </div>
              <div>
                <dt class="ff-meta">Mobile</dt>
                <dd><a :href="`tel:${user.phone}`">{{ user.phone }}</a></dd>
              </div>
            </dl>
          </div>
        </header>

        <div class="profile-grid">
          <section v-if="user" class="ff-card ff-stack shop-card" aria-labelledby="profile-shop">
            <div class="ff-stack ff-stack--tight">
              <h2 id="profile-shop" class="ff-h3">{{ user.role === 'owner' ? 'Shop' : 'Shop hours' }}</h2>
              <p class="ff-meta">{{ BUSINESS.name }}</p>
            </div>

            <template v-if="availability">
              <h3 v-if="user.role === 'owner'" class="ff-label">Opening hours</h3>
              <dl class="hours">
                <div v-for="line in hoursLines(availability)" :key="line.days" class="hours__row">
                  <dt>{{ line.days }}</dt>
                  <dd :class="{ 'ff-muted': line.closed }">{{ line.hours }}</dd>
                </div>
              </dl>
              <p v-if="lunchText(availability)" class="ff-meta">{{ lunchText(availability) }}.</p>
              <p v-if="user.role === 'customer' && daysOffAhead.length > 0" class="ff-meta">
                Closed on {{ daysOffAhead.join(', ') }}.
              </p>
            </template>
            <template v-else-if="hoursState.status === 'error'">
              <p class="ff-error-text" role="alert">{{ userMessage(hoursState.error) }}</p>
              <AppButton variant="secondary" @click="loadAvailability()">Try again</AppButton>
            </template>
            <p v-else class="ff-meta" role="status">Loading the hours</p>

            <AppLink v-if="user.role === 'owner'" to="/availability" class="ff-btn ff-btn--secondary shop-card__manage">
              <CalendarClock class="ff-icon ff-icon--sm" aria-hidden="true" />
              Manage schedule
            </AppLink>
          </section>

          <div class="profile-grid__side">
            <AppearancePanel heading-id="profile-appearance" />

            <section class="ff-card ff-stack" aria-labelledby="profile-session">
              <h2 id="profile-session" class="ff-h3">Session</h2>
              <AppButton variant="secondary" block aria-haspopup="dialog" @click="signOutOpen = true">
                <LogOut class="ff-icon ff-icon--sm" aria-hidden="true" />
                Sign out
              </AppButton>
            </section>
          </div>
        </div>

        <DisclosureSection title="About FixFlow">
          <p class="about-copy">
            FixFlow keeps accounts, requests, photos and shop hours in a PostgreSQL database through
            Firebase Data Connect, so customers and the shop stay in sync across devices.
          </p>
        </DisclosureSection>
      </main>
    </ion-content>

    <SheetModal :open="signOutOpen" title="Sign out?" @close="signOutOpen = false">
      <p>Signing out only ends this session. Your account and saved requests stay in place.</p>
      <template #footer>
        <AppButton variant="danger" block @click="onSignOut">
          <LogOut class="ff-icon ff-icon--sm" aria-hidden="true" />
          Sign out
        </AppButton>
        <AppButton variant="secondary" block @click="signOutOpen = false">Cancel</AppButton>
      </template>
    </SheetModal>
  </ion-page>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.profile-head {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}

.profile-head__avatar {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--avatar-size);
  height: var(--avatar-size);
  background: var(--color-brand);
  border-radius: var(--radius-full);
  color: var(--color-text-on-brand);
  font-size: var(--text-md);
  font-weight: var(--weight-extrabold);
}

.profile-head__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.profile-head__identity {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-3);
}

.profile-head__identity h2 {
  overflow-wrap: anywhere;
}

.profile-head__contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-3);
  margin: 0;
}

.profile-head__contact dd {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: var(--touch-min);
  margin: 0;
  font-weight: var(--weight-semibold);
  overflow-wrap: anywhere;
}

.profile-head__contact dd a {
  display: flex;
  align-items: center;
  align-self: stretch;
  min-width: 0;
  color: var(--color-brand-dark);
}

.profile-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.profile-grid__side {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

.about-copy {
  max-width: 68ch;
}

.shop-card__manage {
  align-self: stretch;
}

.hours {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
}

.hours__row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
}

.hours dt {
  font-weight: var(--weight-semibold);
}

.hours dd {
  margin: 0;
  text-align: right;
}

@media (min-width: 48rem) {
  .profile-head__contact {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-4);
  }
}

@media (min-width: 64rem) {
  .profile-page {
    gap: var(--space-6);
  }

  .profile-head {
    align-items: center;
    padding: var(--space-6);
    background: var(--color-brand-light);
    border-color: var(--color-brand-border);
  }

  .profile-head__avatar {
    width: calc(var(--avatar-size) + var(--space-4));
    height: calc(var(--avatar-size) + var(--space-4));
    font-size: var(--text-lg);
  }

  .profile-head__body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 24rem);
    align-items: center;
    gap: var(--space-6);
  }

  .profile-head__contact {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-3);
  }

  .profile-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(20rem, 0.9fr);
    align-items: start;
    gap: var(--space-6);
  }

  .shop-card__manage {
    align-self: flex-start;
  }
}
</style>
