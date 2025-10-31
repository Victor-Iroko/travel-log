<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <div v-if="!authStore.loading && authStore.user">
    <UPopover
      :content="{
        align: 'start',
        side: 'bottom',

      }"
    >
      <UButton>
        {{ authStore.user.name }}

        <template #leading>
          <UAvatar
            :src="authStore.user?.image ?? undefined"
            icon="i-iconamoon-profile-fill"
            size="sm"
            :alt="authStore.user.name"
          />
        </template>
      </UButton>

      <template #content>
        <UButton
          to="/sign-out"
          icon="i-stash-signout"
        >
          Sign out
        </UButton>
      </template>
    </UPopover>
  </div>
  <div v-else>
    <UButton
      trailing-icon="i-line-md-github"
      :loading="authStore.loading"
      @click="authStore.signIn"
    >
      Sign in with Github
    </UButton>
  </div>
</template>
