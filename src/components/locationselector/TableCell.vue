<script setup>
import { computed } from "vue";

const props = defineProps({
  disabled: Boolean,
  selected: Boolean,
});

const classes = computed(() => {
  if (props.disabled) {
    return "border-gray-200 dark:border-gray-700";
  } else if (props.selected) {
    return "text-black bg-accent-light border-accent-light-hover hover:bg-accent-light-hover dark:border-accent-dark-hover dark:bg-accent-dark dark:hover:bg-accent-dark-hover";
  }

  return "cursor-pointer border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600";
});
</script>

<template>
  <div
    class="m-0.5 overflow-hidden rounded-sm border p-1 select-none"
    :class="classes"
  >
    <slot />
  </div>
</template>
