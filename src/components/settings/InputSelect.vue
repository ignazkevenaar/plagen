<script setup>
const model = defineModel();

const props = defineProps({
  items: Object,
});
</script>

<template>
  <select v-model="model" class="w-full rounded-md bg-gray-900 p-1 scheme-dark">
    <option
      v-for="item in items"
      :value="item.value ?? item"
      :key="item.value ?? item"
    >
      {{ item.text ?? item }}
    </option>
  </select>
</template>
