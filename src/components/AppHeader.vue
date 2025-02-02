<script setup>
import { computed } from "vue";

const version = import.meta.env.VITE_VERSION;

const isCherryBlossomSeason = computed(() => {
  const m = new Date().getMonth();
  return m >= 3 && m <= 4;
});
</script>

<template>
  <div
    class="relative z-0 flex min-h-10 items-center justify-between overflow-hidden rounded-xl border p-2 select-none"
    :class="
      isCherryBlossomSeason
        ? 'border-pink-300 bg-radial-[circle_at_25%_25%] from-pink-200 to-white dark:border-pink-900 dark:from-pink-900 dark:to-gray-800'
        : 'border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800'
    "
  >
    <span
      v-if="isCherryBlossomSeason"
      class="absolute -start-8 -top-6 -z-10 -rotate-20 text-7xl opacity-20"
    >
      🌸
    </span>
    <span
      v-if="isCherryBlossomSeason"
      class="absolute -end-6 -z-10 rotate-10 text-5xl opacity-20"
    >
      🌸
    </span>
    <div>
      <h1 class="text-xl leading-6">Japanese License Plate Generator</h1>
      <p class="flex gap-1 text-xs opacity-65">
        <span>Version {{ version }}</span>
        <span class="opacity-50">·</span>
        <span>&copy;{{ new Date().getFullYear() }} Ignaz Kevenaar</span>
      </p>
    </div>

    <a
      href="https://github.com/ignazkevenaar/jdm-plate-generator"
      target="_blank"
      title="View on GitHub"
      class="block cursor-pointer rounded-md bg-gray-100 p-1 hover:bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="pointer-events-none size-6 fill-current"
      >
        <path
          d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
        />
      </svg>
    </a>
  </div>
</template>
