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
        <AppSignInButton />
      </template>
    </UPageHero>
  </div>
</template>
