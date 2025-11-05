<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const locationStore = useLocationStore()
const mapStore = useMapStore()

const staticNavigationItems: NavigationMenuItem[] = [
  { label: 'Locations', icon: 'i-material-symbols:map-sharp', to: '/dashboard', exact: true },
  { label: 'Add Location', icon: 'i-material-symbols:add-circle', to: '/dashboard/add', exact: true },
  { label: 'Sign out', icon: 'i-stash:signout', to: '/sign-out', exact: true },
]
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
          :items="staticNavigationItems.slice(0, 2)"
          orientation="vertical"
        />

        <USeparator v-if="(locationStore.status == 'success') && locationStore.sidebarItems.length" />

        <USkeleton
          v-if="locationStore.status == 'pending'"
          class="h-8 w-full"
        />

        <UNavigationMenu
          v-else-if="locationStore.sidebarItems.length"
          tooltip
          :collapsed="collapsed"
          :items="locationStore.sidebarItems"
          orientation="vertical"
        >
          <template #item="{ item }">
            <div v-if="item.type=='label'">
              {{ item.label }}
            </div>
            <div
              v-else
              class="group flex gap-1.5 items-center w-full h-full"
              @mouseenter="mapStore.selectedPoint = item.location ?? null"
              @mouseleave="mapStore.selectedPoint = null"
            >
              <UIcon
                :name="item.icon ?? 'i-material-symbols:location-on'"
                class="size-5 text-dimmed transition-colors shrink-0"
                :class="{
                  'text-primary': mapStore.selectedPoint?.id == item.location?.id,
                }"
              />
              <ULink
                v-if="!collapsed"
                class="text-sm text-muted group-hover:text-highlighted transition-colors truncate"
              > {{ item.label }} </ULink>
            </div>
          </template>
        </UNavigationMenu>

        <USeparator />
        <UNavigationMenu
          tooltip
          :collapsed="collapsed"
          :items="staticNavigationItems.slice(2)"
          orientation="vertical"
        />
      </template>
    </UDashboardSidebar>

    <NuxtPage class="h-1/2" />
  </UDashboardGroup>
</template>
