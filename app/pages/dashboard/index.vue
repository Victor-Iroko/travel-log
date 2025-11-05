<script setup lang="ts">
const locationStore = useLocationStore()
const mapStore = useMapStore()
const { locations, status } = storeToRefs(locationStore)
const nuxtApp = useNuxtApp()
onMounted(() => {
  // Run only on client *after hydration* (i.e., client navigation)
  if (!nuxtApp.isHydrating) {
    locationStore.refresh()
  }
})
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'gap-2 sm:gap-4',
    }"
  >
    <template #header>
      <UDashboardNavbar
        title="Locations"
        :ui="{
          title: 'text-2xl',
        }"
      />
    </template>

    <template #body>
      <!-- Pending state -->
      <div
        v-if="status === 'pending'"
      >
        <UIcon
          name="i-line-md:loading-twotone-loop"
          class="size-20"
        />
      </div>

      <!-- Empty state -->
      <div v-else-if="!locations?.length">
        <p>
          Add a location to get started
        </p>
        <UButton
          trailing-icon="i-material-symbols:add-circle"
          size="lg"
          class="self-start px-5 mt-2"
          to="/dashboard/add"
        >
          Add Location
        </UButton>
      </div>

      <!-- Data state -->
      <div v-else>
        <div class="flex gap-2 overflow-x-auto flex-1">
          <UPageCard
            v-for="(location, index) in locations"
            :key="location.id"
            :title="location.name"
            :description="location.description ?? undefined"
            :to="`/dashboard/location/${location.name}`"
            class="min-w-2xs mt-0.5 mb-2 border"
            icon="i-material-symbols:add-location"
            :class="{
              'ml-4': index == 0,
              'mr-4': index === locations.length - 1,
              'border-primary': mapStore.selectedPoint?.id === location.id,
              'border-transparent': mapStore.selectedPoint !== location,
            }"
            @mouseenter="mapStore.selectedPoint = location"
            @mouseleave="mapStore.selectedPoint = null"
          />
        </div>

        <div class="h-64 sm:h-80 md:h-96 lg:h-[50vh] xl:h-[60vh] mx-4 mt-2">
          <AppMap />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
