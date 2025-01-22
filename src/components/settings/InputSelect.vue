<script setup>
const model = defineModel();

const props = defineProps({
  items: Object,
});
</script>

<template>
  <select v-model="model" class="w-full">
    <option v-for="item in items" :value="item.value" :key="item.value">
      {{ item.text }}
    </option>
  </select>
</template>
