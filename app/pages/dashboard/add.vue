<script setup lang="ts">
import { LazyAppLocationLeaveConfirmationModal } from '#components'
import type { FormSubmitEvent } from '@nuxt/ui'
import { FetchError } from 'ofetch'
import type * as z from 'zod'
import { InsertLocationSchema } from '~~/shared/validation/location-schema'

const router = useRouter()

const formSchema = InsertLocationSchema

type FormSchemaType = z.output<typeof formSchema>

const initialFormState: FormSchemaType = {
  name: '',
  description: '',
  lat: 0,
  long: 0,
}

const formState = ref<FormSchemaType>({ ...initialFormState })

const clearForm = () => {
  formState.value = { ...initialFormState }
}
const toast = useToast()
const { $csrfFetch } = useNuxtApp()
const onSubmit = async (event: FormSubmitEvent<FormSchemaType>) => {
  try {
    await $csrfFetch('/api/locations', {
      method: 'POST',
      body: event.data,
    })
    toast.add({
      title: 'Success',
      description: 'The form has been submitted.',
      color: 'success',
      icon: 'i-lsicon:submit-filled',
    })
    clearForm()
    navigateTo('/dashboard')
  }
  catch (error) {
    if (error instanceof FetchError) {
      toast.add({
        title: 'Error',
        description: error.statusMessage,
        color: 'error',
        icon: 'i-bx:error',
      })
    }
  }
}

const isFormDirty = computed(() => {
  return (
    formState.value.name !== initialFormState.name
    || formState.value.description !== initialFormState.description
    || formState.value.lat !== initialFormState.lat
    || formState.value.long !== initialFormState.long
  )
})

const overlay = useOverlay()
const modal = overlay.create(LazyAppLocationLeaveConfirmationModal)
onBeforeRouteLeave(async (to, from, next) => {
  if (isFormDirty.value) {
    const instance = modal.open()
    const shouldStay = await instance.result
    if (shouldStay) {
      next(false)
    }
    else {
      next()
    }
  }
  // If the form is clean, allow navigation immediately
  next()
})
</script>

<template>
  <UDashboardPanel>
    <template #body>
      <UContainer class="max-w-md space-y-2">
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

          <UFormField
            label="Latitude"
            name="lat"
            required
          >
            <UInput
              v-model="formState.lat"
              placeholder="e.g. 6.5244"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Longitude"
            name="long"
            required
          >
            <UInput
              v-model="formState.long"
              placeholder="e.g. 6.5244"
              class="w-full"
            />
          </UFormField>

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
    </template>
  </UDashboardPanel>
</template>
