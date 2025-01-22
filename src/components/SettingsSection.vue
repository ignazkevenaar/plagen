<script setup>
defineProps({
  title: String,
});
</script>

<template>
  <div class="space-y-4 border-b border-b-gray-800 last:border-b-0">
    <h2 v-if="title">{{ title }}</h2>
    <slot></slot>
  </div>
</template>
