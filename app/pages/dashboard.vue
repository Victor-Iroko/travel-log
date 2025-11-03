<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { data: userLocationsData } = await useFetch('/api/locations', {
  transform: (locations: { id: number, name: string }[]) => {
    locations.map(loc => ({
      label: loc.name,
      icon: 'i-material-symbols:location-on',
      to: `/dashboard/locations${loc.id}`,
    })) as NavigationMenuItem[]
  },
})

// Define sidebar sections reactively
const sideBarNavigationItems = computed<NavigationMenuItem[][]>(() => [
  [
    { label: 'Locations', icon: 'i-material-symbols:map-sharp', to: '/dashboard' },
    { label: 'Add Location', icon: 'i-material-symbols:add-circle', to: '/dashboard/add' },
  ],
  [{ label: 'Added Locations', type: 'label' }, ...(userLocationsData.value || [])],
  [
    { label: 'Sign out', icon: 'i-stash:signout', to: '/sign-out' },
  ],
])
</script>

<template>
  <UDashboardGroup class="relative">
    <UDashboardSidebar
      collapsible
    >
      <template #header>
        <UDashboardSidebarCollapse
          variant="subtle"
          class="ml-auto"
        />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          tooltip
          :collapsed="collapsed"
          :items="sideBarNavigationItems"
          orientation="vertical"
        />
      </template>
    </UDashboardSidebar>

    <NuxtPage />
  </UDashboardGroup>
</template>
