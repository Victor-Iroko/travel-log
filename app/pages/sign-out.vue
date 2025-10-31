<script setup lang="ts">
const authStore = useAuthStore()

onMounted(() => {
  authStore.signOut()
})
</script>

<template>
  <UContainer class="h-full flex justify-center items-center">
    <UIcon
      name="i-line-md-loading-loop"
      class="size-20"
    />
  </UContainer>
</template>
