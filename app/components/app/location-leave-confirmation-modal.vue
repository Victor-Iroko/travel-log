<script setup lang="ts">
const emit = defineEmits<{ close: [boolean] }>()
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', true) }"
    :dismissible="false"
    title="Are you sure you want to leave"
    description="You have unsaved changes. Are you sure you want to leave and lose your data?"
    @close:prevent="emit('close', true)"
  >
    <template #footer>
      <div class="flex gap-2">
        <UButton
          color="neutral"
          label="Leave"
          @click="emit('close', false)"
        />
        <UButton
          label="Stay"
          @click="emit('close', true)"
        />
      </div>
    </template>
  </UModal>
</template>
