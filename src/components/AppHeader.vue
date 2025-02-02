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
      <mdicon name="github" class="pointer-events-none size-6 fill-current" />
    </a>
  </div>
</template>
