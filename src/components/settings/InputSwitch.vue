<script setup>
const model = defineModel();
</script>

<template>
  <label class="block w-16 h-8 rounded-full bg-gray-800 has-[:checked]:bg-purple-500 relative transition-colors">
    <input v-model="model" type="checkbox" class="hidden peer" v-bind="$attrs"></input>
    <div class="size-6 bg-white rounded-full translate-y-1 translate-x-1 transition-transform peer-checked:translate-x-9"></div>
  </label>
</template>
