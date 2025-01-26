<script setup>
const model = defineModel();
</script>

<template>
  <input
    type="text"
    class="w-full rounded-md bg-gray-900 p-1 scheme-dark"
    v-model="model"
  />
</template>
