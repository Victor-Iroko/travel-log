<script setup lang="ts">
const route = useRoute()

const errorMessage = route.query.error || 'An unknown error occured'
</script>

<template>
  <UError
    :error="{
      statusMessage: 'Oh no!',
    }"
  >
    <template #message>
      {{ errorMessage }}
    </template>

    <template #links>
      <UButton
        trailing-icon="i-material-symbols-home"
        to="/"
        size="xl"
      >
        Home
      </UButton>
    </template>
  </UError>
</template>
