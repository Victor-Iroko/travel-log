import type { MapPoint } from '~/types/types'

export const useMapStore = defineStore('useMapStore', () => {
  const locationStore = useLocationStore()

  const mapPoints = computed<MapPoint[]>(() =>
    (locationStore.locations ?? []).map(({ id, name, lat, long, description }) => ({
      id,
      name,
      lat,
      long,
      description,
    })),
  )

  const selectedPoint = ref<MapPoint | null>(null)
  const addedPoint = ref<MapPoint & { centerMap?: boolean } | null>(null)

  // init function to set all your computed and watchers
  // but we do this because it is an async function and has to run as a client side code
  async function init() {
    const { useMap } = await import('@indoorequal/vue-maplibre-gl')
    const { LngLatBounds } = await import ('maplibre-gl')

    const map = useMap()

    const bounds = computed(() => {
      const points = mapPoints.value
      if (points.length === 0) return undefined

      // Initialize bounds with the first point
      const first = points[0] as MapPoint
      const initial = new LngLatBounds(
        [first.long, first.lat],
        [first.long, first.lat],
      )

      // Extend bounds with remaining points
      return points.reduce((b, p) => b.extend([p.long, p.lat]), initial)
    })

    /**
     * Helper to fit map to bounds safely.
     */
    const fitToBounds = (duration = 500) => {
      if (map.map && bounds.value) {
        map.map.fitBounds(bounds.value, { padding: 50, duration })
      }
    }

    watch(addedPoint, (newValue, oldValue) => {
      // this is for when you just enter a page with a map it would autofit but disable when you pick the marker
      if (!newValue) {
        fitToBounds()
      }

      // you're going from the locations page to the added page (we set the new value when we mount the add.vue)
      // or you set the locations from the search locations part it would fly to the
      if ((newValue && !oldValue) || newValue?.centerMap) {
        map.map?.flyTo({
          center: [newValue.long, newValue.lat],
          speed: 0.8,
          zoom: 6,
        })
      }
    }, {
      immediate: true,
    })
  }

  return { mapPoints, init, selectedPoint, addedPoint }
})
