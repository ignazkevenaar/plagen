<script setup>
const model = defineModel();

const props = defineProps({
  label: String,
});
</script>

<template>
  <label class="flex items-center gap-2">
    <div
      class="box-content h-4 w-7 cursor-pointer rounded-full border border-gray-300 bg-gray-100 transition-colors has-[:checked]:border-black has-[:checked]:bg-black has-[:enabled]:cursor-pointer dark:border-gray-600 dark:bg-gray-700 has-[:checked]:dark:border-transparent has-[:checked]:dark:bg-gray-200"
    >
      <input
        v-model="model"
        v-bind="$attrs"
        type="checkbox"
        class="peer hidden"
      />
      <div
        class="m-0.5 size-3 rounded-full border border-gray-300 bg-white transition-transform peer-checked:translate-x-3 peer-checked:border-0 dark:border-gray-900 dark:bg-gray-900"
      ></div>
    </div>
    <span class="leading-5 select-none">{{ label }}</span>
  </label>
</template>
