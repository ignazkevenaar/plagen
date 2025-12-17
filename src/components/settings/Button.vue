<script setup>
defineProps({
  prependIcon: String,
  loading: Boolean,
  accent: Boolean,
});
</script>

<template>
  <button
    class="flex items-center justify-center gap-2 rounded-xl border p-2 px-4 font-semibold uppercase select-none enabled:cursor-pointer disabled:opacity-65"
    :disabled="loading"
    :class="
      accent
        ? 'border-gray-950 bg-gray-800 text-white hover:bg-gray-950 dark:border-gray-50 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-50'
        : 'border-gray-300 bg-white text-gray-700 enabled:hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:enabled:hover:bg-gray-700'
    "
  >
    <svg
      v-if="loading"
      class="size-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <mdicon v-else-if="prependIcon" :name="prependIcon" />
    <slot></slot>
  </button>
</template>
