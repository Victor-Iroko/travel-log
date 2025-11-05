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
  const addedPoint = ref<MapPoint | null>(null)

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

    /**
     * Auto-fit bounds when data changes.
     */
    effect(() => {
      if (!addedPoint.value) {
        fitToBounds()
      }
    })

    watch(addedPoint, (newValue, oldValue) => {
      if (newValue && !oldValue) {
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
