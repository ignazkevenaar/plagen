<script setup>
defineProps({
  icon: String,
});
</script>

<template>
  <button
    class="rounded-md bg-gray-100 p-1 hover:bg-gray-200 enabled:cursor-pointer dark:bg-gray-700 hover:dark:bg-gray-600"
  >
    <mdicon
      v-if="icon"
      :name="icon"
      class="block size-6 -scale-x-100 fill-gray-500 dark:fill-gray-400"
    />
  </button>
</template>
