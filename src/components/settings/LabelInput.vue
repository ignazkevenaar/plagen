<script setup>
const model = defineModel();

const props = defineProps({
  label: String,
  sublabel: String,
  large: Boolean,
});
</script>

<template>
  <label class="block font-semibold">
    <span class="block text-[10pt] uppercase select-none">{{ label }}</span>
    <span class="mb-1 block text-[10pt] font-normal opacity-60 select-none">
      {{ sublabel }}
    </span>
    <input
      v-model="model"
      v-bind="$attrs"
      class="w-full appearance-none rounded-md bg-gray-100 p-1 dark:bg-gray-900"
      :class="large ? 'text-3xl font-normal' : ''"
    />
  </label>
</template>
