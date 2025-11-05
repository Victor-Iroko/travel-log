<script setup lang="ts">
import z from 'zod'
import type { SetLocationEmit } from '~/types/types'
import { SearchSchema } from '~~/shared/validation/zod-schemas'

const emit = defineEmits<{
  setLocation: [payload: SetLocationEmit]
}>()

const toast = useToast()
const search = ref('')
const noResults = ref(false)
const { data: places, status, execute, error } = useFetch('/api/search', {
  query: { q: search },
  immediate: false,
  watch: false,
  onRequest: () => {
    noResults.value = false
  },
  onResponse: ({ response }) => {
    if (!response._data?.length) {
      noResults.value = true
    }
  },
})

const searchPlaces = async () => {
  const q = SearchSchema.safeParse({
    q: search.value,
  })
  if (!q.success) {
    toast.add({
      title: 'Error',
      description: z.prettifyError(q.error),
      color: 'error',
      icon: 'material-symbols:error',
    })
    return
  }
  execute()
}

watch(error, (newError) => {
  if (newError) {
    toast.add({
      title: 'Search Failed',
      // Use the error message from the response data if available
      description: newError.data?.message || newError.message || 'An unknown error occurred.',
      color: 'error',
      icon: 'material-symbols:error',
    })
  }
})
</script>

<template>
  <div class="flex justify-center items-center flex-col mt-2 w-full gap-2">
    <UFieldGroup class="self-center">
      <UInput
        v-model="search"
        color="neutral"
        variant="outline"
        placeholder="Search for a location"
        icon="i-lucide-search"
        :loading="status == 'pending'"
        @keydown.enter="searchPlaces"
      />

      <UButton
        label="Search"
        color="neutral"
        variant="subtle"
        :loading="status == 'pending'"
        @click="searchPlaces"
      />
    </UFieldGroup>

    <UIcon
      v-if="status == 'pending'"
      name="i-line-md:loading-twotone-loop"
      class="size-20"
    />

    <div
      v-else-if="places?.length"
      class="flex flex-col gap-2.5 max-h-60 overflow-y-auto p-2"
    >
      <UPageCard
        v-for="place in places"
        :key="place.osm_id"
        :title="place.display_name"
        :ui="{
          footer: 'w-full',
        }"
      >
        <template #footer>
          <div class="flex justify-end">
            <UButton
              label="Set Location"
              trailing-icon="i-material-symbols:add-location-alt-outline"
              color="secondary"
              class="text-xs"
              @click="emit('setLocation', { name: place.display_name, long: Number(place.lon), lat: Number(place.lat) })"
            />
          </div>
        </template>
      </UPageCard>
    </div>

    <!-- if there are no results or you clear the search tab -->
    <span
      v-if="noResults"
      class="text-neutral-500"
    >No results</span>
  </div>
</template>
