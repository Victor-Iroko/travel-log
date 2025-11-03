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
      <p>
        Add a location to get started
      </p>
      <UButton
        trailing-icon="i-material-symbols:add-circle"
        size="lg"
        class="self-start px-5"
        to="/dashboard/add"
      >
        Add Location
      </UButton>
    </template>
  </UDashboardPanel>
</template>
