<template>
  <div class="flex flex-col min-h-screen">
    <AppNavBar />
    <UMain
      as="main"
    >
      <slot />
    </UMain>
  </div>
</template>
