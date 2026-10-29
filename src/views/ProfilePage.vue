<script setup lang="ts">
import { computed, ref } from 'vue'
import { IonContent, IonPage, onIonViewWillEnter } from '@ionic/vue'
import { CalendarClock, LogOut } from '@lucide/vue'
import AppearancePanel from '@/components/AppearancePanel.vue'
import AppButton from '@/components/AppButton.vue'
import AppLink from '@/components/AppLink.vue'
import DisclosureSection from '@/components/DisclosureSection.vue'
import PageHeader from '@/components/PageHeader.vue'
import SheetModal from '@/components/SheetModal.vue'
import { loadAvailability, useAvailability } from '@/composables/useAvailability'
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
</script>

<template>
  <ion-page>
    <PageHeader title="Profile" />
    <ion-content>
      <main class="ff-container ff-container--wide profile-page" tabindex="-1">
        <div class="profile-page__col">
          <section v-if="user" class="ff-card profile" aria-labelledby="profile-name">
            <span class="profile__avatar" aria-hidden="true">{{ initials(user.name) }}</span>
            <div class="ff-grow">
              <h2 id="profile-name" class="ff-h2">{{ user.name }}</h2>
              <span class="ff-badge ff-badge--brand">{{ user.role === 'owner' ? 'Business owner' : 'Customer' }}</span>
            </div>
          </section>

          <section v-if="user" class="ff-card" aria-labelledby="profile-contact">
            <h2 id="profile-contact" class="ff-h3">Contact</h2>
            <dl class="facts">
              <div>
                <dt class="ff-meta">Email</dt>
                <dd>{{ user.email }}</dd>
              </div>
              <div>
                <dt class="ff-meta">Mobile</dt>
                <dd>{{ user.phone }}</dd>
              </div>
            </dl>
          </section>

          <section v-if="user?.role === 'owner'" class="ff-card" aria-labelledby="profile-shop">
            <h2 id="profile-shop" class="ff-h3">Shop</h2>
            <dl class="facts">
              <div>
                <dt class="ff-meta">Name</dt>
                <dd>{{ BUSINESS.name }}</dd>
              </div>
            </dl>
          </section>

          <section v-if="user" class="ff-card ff-stack" aria-labelledby="profile-hours">
            <h2 id="profile-hours" class="ff-h3">{{ user.role === 'owner' ? 'Opening hours' : 'Shop hours' }}</h2>
            <template v-if="availability">
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
            <AppLink v-if="user.role === 'owner'" to="/availability" class="ff-btn ff-btn--secondary ff-btn--block">
              <CalendarClock class="ff-icon ff-icon--sm" aria-hidden="true" />
              Manage schedule
            </AppLink>
          </section>
        </div>

        <div class="profile-page__col">
          <AppearancePanel heading-id="profile-appearance" />

          <DisclosureSection title="About FixFlow">
            <p>
              FixFlow keeps accounts, requests, photos and shop hours in a PostgreSQL database through
              Firebase Data Connect, so customers and the shop stay in sync across devices.
            </p>
          </DisclosureSection>

          <div class="ff-stack ff-stack--tight">
            <AppButton variant="secondary" block aria-haspopup="dialog" @click="signOutOpen = true">
              <LogOut class="ff-icon ff-icon--sm" aria-hidden="true" />
              Sign out
            </AppButton>
          </div>
        </div>
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

.profile-page__col {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}

@media (min-width: 64rem) {
  .profile-page {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: var(--space-6);
    align-items: start;
  }
}

.profile {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.profile__avatar {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--avatar-size);
  height: var(--avatar-size);
  background: var(--color-brand);
  border-radius: var(--radius-full);
  color: var(--color-text-on-brand);
  font-weight: var(--weight-extrabold);
}

.facts {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: var(--space-3) 0 0;
}

.facts dd {
  margin: 0;
  font-weight: var(--weight-semibold);
  overflow-wrap: anywhere;
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
</style>
