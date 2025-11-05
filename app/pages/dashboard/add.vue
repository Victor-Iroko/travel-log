<script setup lang="ts">
import { LazyAppLocationLeaveConfirmationModal } from '#components'
import type { FormSubmitEvent } from '@nuxt/ui'
import { FetchError } from 'ofetch'
import type * as z from 'zod'
import { InsertLocationSchema } from '~~/shared/validation/location-schema'

const router = useRouter()
const toast = useToast()
const { $csrfFetch } = useNuxtApp()
const mapStore = useMapStore()
const overlay = useOverlay()
const modal = overlay.create(LazyAppLocationLeaveConfirmationModal)

const formSchema = InsertLocationSchema
type FormSchemaType = z.output<typeof formSchema>

const initialValues: FormSchemaType = {
  name: '',
  description: '',
  lat: CENTER_WESTERN_NIGERIA[1],
  long: CENTER_WESTERN_NIGERIA[0],
}

const formState = ref<FormSchemaType>({ ...initialValues })

const onSubmit = async (event: FormSubmitEvent<FormSchemaType>) => {
  try {
    await $csrfFetch('/api/locations', { method: 'POST', body: event.data })
    toast.add({ title: 'Success', description: 'Location added', color: 'success', icon: 'lsicon:submit-outline' })
    Object.assign(formState.value, initialValues)
    mapStore.addedPoint = null
    navigateTo('/dashboard')
  }
  catch (error) {
    if (error instanceof FetchError) {
      toast.add({
        title: 'Error',
        description: error.data?.statusMessage || error.statusMessage,
        color: 'error',
        icon: 'material-symbols:error',
      })
    }
  }
}

// 🗺️ Initialize map + form
onMounted(() => {
  mapStore.addedPoint = { ...initialValues, id: 1 }
})

watch(
  () => mapStore.addedPoint,
  (point) => {
    if (point) {
      formState.value.lat = point.lat
      formState.value.long = point.long
    }
  },
  { deep: true },
)

// --- simple dirty check ---
const isFormDirty = computed(() => JSON.stringify(formState.value) !== JSON.stringify(initialValues))

onBeforeRouteLeave(async (to, from, next) => {
  if (isFormDirty.value) {
    const instance = modal.open()
    const stay = await instance.result
    if (stay) return next(false)
  }
  mapStore.addedPoint = null
  next()
})
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'p-0 sm:p-0',
    }"
  >
    <template #body>
      <div class="grid grid-cols-1 lg:grid-cols-[auto_1fr]">
        <!-- Left: Form Section -->
        <div class="max-w-md mx-auto">
          <UContainer class="py-4 space-y-4">
            <h1 class="text-lg">
              Add Location
            </h1>
            <p class="text-sm">
              A location is a place you have traveled or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
            </p>
            <UForm
              :state="formState"
              :schema="formSchema"
              class="space-y-4"
              @submit.prevent="onSubmit"
            >
              <UFormField
                label="Name"
                name="name"
                required
              >
                <UInput
                  v-model="formState.name"
                  placeholder="Enter name"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Description"
                name="description"
              >
                <UTextarea
                  v-model="formState.description"
                  placeholder="Enter description"
                  class="w-full"
                />
              </UFormField>

              <div>
                <p class="text-xs text-neutral-400 mb-3">
                  Current coordinates: {{ formState.lat }}, {{ formState.long }}
                </p>

                <span>To set the coordinates</span>
                <ul class="list-disc ml-4 text-sm">
                  <li>
                    Drag the marker <UIcon
                      name="material-symbols:add-location"
                      class="text-warning"
                    /> to your desired location.
                  </li>
                  <li>Double click on the map.</li>
                  <li>Search for a location below.</li>
                </ul>
              </div>

              <div class="flex flex-row gap-2 justify-end">
                <UButton
                  color="neutral"
                  variant="soft"
                  icon="i-material-symbols:arrow-back"
                  loading-auto
                  @click="router.back()"
                >
                  Cancel
                </UButton>

                <UButton
                  type="submit"
                  trailing-icon="i-material-symbols:add-box-sharp"
                  loading-auto
                >
                  Add
                </UButton>
              </div>
            </UForm>
          </UContainer>
        </div>

        <!-- Right: Map section -->
        <div class="h-[400px] lg:h-auto">
          <AppMap />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
