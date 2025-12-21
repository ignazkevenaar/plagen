<script setup>
import Label from "./Label.vue";

const model = defineModel();

const props = defineProps({
  label: String,
});
</script>

<template>
  <Label class="flex items-center gap-2" :label="label">
    <template #prepend>
      <div
        class="box-content h-4 w-7 cursor-pointer rounded-full border border-gray-300 bg-gray-100 transition-colors has-checked:border-black has-checked:bg-black has-enabled:cursor-pointer dark:border-gray-600 dark:bg-gray-700 has-checked:dark:border-transparent has-checked:dark:bg-gray-200"
      >
        <input
          v-model="model"
          v-bind="$attrs"
          type="checkbox"
          class="peer hidden"
        />
        <div
          class="m-0.5 size-3 rounded-full border border-gray-400 bg-gray-300 transition-[translate,background-color] peer-checked:translate-x-3 peer-checked:border-0 peer-checked:bg-gray-50 dark:border-gray-200 dark:bg-gray-300 dark:peer-checked:bg-gray-900"
        ></div>
      </div>
    </template>
  </Label>
</template>
