<script setup>
import Label from "./Label.vue";

const model = defineModel();

const props = defineProps({
  label: String,
  sublabel: String,
  large: Boolean,
});
</script>

<template>
  <Label :label="label" :sublabel="sublabel">
    <input
      v-model="model"
      v-bind="$attrs"
      class="w-full appearance-none rounded-md bg-gray-100 p-1 dark:bg-gray-900"
      :class="large ? 'text-3xl font-normal' : ''"
    />
  </Label>
</template>
