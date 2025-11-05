import type { NavigationMenuItem } from '@nuxt/ui'

export const useLocationStore = defineStore('useLocationStore', () => {
  const { data: locations, status, refresh, error } = useLazyFetch('/api/locations', { deep: true })
  const debouncedRefresh = useDebounceFn(refresh, 300)

  type LocationType = NonNullable<typeof locations.value>[number]
  const sidebarItems = computed<(NavigationMenuItem & { location?: LocationType })[]>(() => {
    const dynamicLocations: NavigationMenuItem[] = (locations.value ?? []).map((loc): NavigationMenuItem & { location: LocationType } => ({
      label: loc.name,
      icon: 'i-material-symbols:location-on',
      to: `/dashboard/location/${loc.slug}`,
      id: loc.id,
      exact: true,
      location: loc,
    }))

    const staticLabel: NavigationMenuItem = {
      label: 'Added Locations',
      type: 'label',
    }

    return [staticLabel, ...dynamicLocations]
  })

  return {
    status,
    locations,
    error,
    sidebarItems,
    refresh: debouncedRefresh,
  }
})
