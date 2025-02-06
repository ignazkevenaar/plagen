<script setup>
defineProps({
  prependIcon: String,
});
</script>

<template>
  <button
    class="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white font-semibold text-gray-700 uppercase select-none enabled:cursor-pointer enabled:hover:bg-gray-100 disabled:opacity-65 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:enabled:hover:bg-gray-700"
  >
    <mdicon v-if="prependIcon" :name="prependIcon" />
    <slot></slot>
  </button>
</template>
