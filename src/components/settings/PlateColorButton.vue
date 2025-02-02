<script setup>
const model = defineModel();

defineProps({
  label: String,
  background: String,
  foreground: String,
});
</script>

<template>
  <label class="space-y-1 text-sm font-normal">
    <input v-model="model" type="radio" class="peer hidden" v-bind="$attrs" />
    <div
      class="relative m-1 mx-auto aspect-[2/1] w-19 rounded-md border-2 border-gray-400 bg-gray-100 text-green-900 outline-2 outline-offset-2 outline-transparent peer-checked:outline-black peer-enabled:cursor-pointer dark:border-gray-900 peer-checked:dark:outline-gray-400"
      :style="{ 'background-color': background, color: foreground }"
    >
      <div
        class="absolute start-5 top-1 h-1.5 w-4 rounded-[2px] bg-current"
      ></div>
      <div
        class="absolute start-10 top-1 h-1.5 w-3 rounded-[2px] bg-current"
      ></div>

      <div
        class="absolute start-1 top-5 h-2 w-2 rounded-[2px] bg-current"
      ></div>

      <div
        class="absolute start-4 top-4 h-4 w-2 rounded-[2px] bg-current"
      ></div>
      <div
        class="absolute start-7 top-4 h-4 w-2 rounded-[2px] bg-current"
      ></div>

      <div
        class="absolute start-11 top-4 h-4 w-2 rounded-[2px] bg-current"
      ></div>
      <div
        class="absolute start-14 top-4 h-4 w-2 rounded-[2px] bg-current"
      ></div>
    </div>
    <span
      class="mt-2 block text-center text-xs opacity-60 select-none peer-checked:opacity-100"
      >{{ label }}</span
    >
  </label>
</template>
