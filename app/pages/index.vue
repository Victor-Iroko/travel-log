<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <div>
    <UPageHero
      :ui="{
        container: 'lg:py-30',
      }"
    >
      <template #title>
        Travel Log
      </template>

      <template #description>
        Keep track of your travels and adventures with this simple travel log app.
        Add locations, photos, and notes to create a digital journal of your journeys.
      </template>

      <template #links>
        <UButton
          v-if="authStore.user"
          to="/dashboard"
        >
          Go to Dashboard
        </UButton>
        <AppSignInButton v-else />
      </template>
    </UPageHero>
  </div>
</template>
