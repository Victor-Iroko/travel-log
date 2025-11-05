<script setup lang="ts">
import type { MglEvent } from '@indoorequal/vue-maplibre-gl'
import type { LngLat } from 'maplibre-gl'

const colorMode = useColorMode()
const style = computed(() => colorMode.value === 'dark' ? '/styles/dark.json' : 'https://tiles.openfreemap.org/styles/liberty')
const center = ref(CENTER_WESTERN_NIGERIA) // default center in western nigeria
const zoom = 8

const mapStore = useMapStore()

onMounted(() => {
  mapStore.init()
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = [
          position.coords.longitude,
          position.coords.latitude,
        ]
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.warn('Geolocation failed:', error)
      },
    )
  }
  else {
    // eslint-disable-next-line no-console
    console.warn('Geolocation not supported')
  }
})

const updateAddedPoint = (location: LngLat) => {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.lat = location.lat
    mapStore.addedPoint.long = location.lng
  }
}

const onDoubleClick = (event: MglEvent<'dblclick'>) => {
  updateAddedPoint(event.event.lngLat)
}
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
    @map:dblclick="onDoubleClick"
  >
    <!-- draggable marker -->
    <MglMarker
      v-if="mapStore.addedPoint"
      :coordinates="[mapStore.addedPoint.long, mapStore.addedPoint.lat]"
      draggable
      class-name="z-50"
      @update:coordinates="updateAddedPoint"
    >
      <template #marker>
        <UTooltip
          :open="true"
          :delay-duration="0"
          text="Drag to your desired location"
        >
          <UIcon
            name="material-symbols:add-location"
            size="24"
            class="hover:cursor-pointer text-warning"
          />
        </UTooltip>
      </template>
    </MglMarker>

    <!-- markers of the locations one has set -->
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <UTooltip
          :text="point.name"
          :delay-duration="0"
          :open="mapStore.selectedPoint?.id === point.id"
          @mouseenter="mapStore.selectedPoint= point"
          @mouseleave="mapStore.selectedPoint = null"
        >
          <UIcon
            name="material-symbols:add-location"
            size="24"
            class="hover:cursor-pointer"
            :class="mapStore.selectedPoint?.id === point.id ? 'text-primary' : 'text-secondary'"
          />
        </UTooltip>
      </template>

      <MglPopup ref="popup">
        <h3 class="text-xl">
          {{ point.name }}
        </h3>
        <p v-if="point.description">
          {{ point.description }}
        </p>
      </MglPopup>
    </MglMarker>

    <MglNavigationControl />
  </MglMap>
</template>
