<script setup>
import Label from "./Label.vue";

const model = defineModel();

const props = defineProps({
  options: Array,
  label: String,
  sublabel: String,
  large: Boolean,
});
</script>

<template>
  <Label :label="label" :sublabel="sublabel">
    <span class="block text-[10pt] uppercase select-none">{{ label }}</span>
    <span class="mb-1 block text-[10pt] font-normal opacity-60 select-none">
      {{ sublabel }}
    </span>
    <div class="selectContainer">
      <select
        v-model="model"
        v-bind="$attrs"
        class="w-full appearance-none rounded-md bg-gray-100 p-1 dark:bg-gray-900"
        :class="large ? 'text-3xl font-normal' : ''"
      >
        <option
          v-for="option in options"
          :value="option.value ?? option"
          :key="option.value ?? option"
        >
          {{ option.text ?? option }}
        </option>
      </select>
    </div>
  </Label>
</template>

<style scoped>
.selectContainer {
  position: relative;
  width: 100%;

  &::after {
    display: block;
    position: absolute;
    top: 12px;
    inset-inline-end: 6px;
    border-top: 8px solid currentColor;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    width: 0;
    height: 0;
    content: "";
  }

  &:has(select:open)::after {
    transform: scale(1, -1);
  }
}
</style>
