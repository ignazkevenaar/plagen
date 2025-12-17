<script setup>
import Label from "./Label.vue";

const model = defineModel();

const props = defineProps({
  options: Array,
  grouped: Boolean,
  label: String,
  sublabel: String,
  large: Boolean,
});
</script>

<template>
  <Label :label="label" :sublabel="sublabel">
    <div class="flex gap-2">
      <div class="selectContainer">
        <select
          v-model="model"
          v-bind="$attrs"
          class="w-full appearance-none rounded-md bg-gray-100 p-1 dark:bg-gray-900"
          :class="large ? 'text-3xl font-normal' : ''"
        >
          <template v-if="grouped">
            <optgroup
              v-for="group in options"
              :key="group.name"
              :label="group.name"
            >
              <option
                v-for="option in group.options"
                :value="option.value ?? option"
                :key="option.value ?? option"
              >
                {{ option.text ?? option }}
              </option>
            </optgroup>
          </template>
          <template v-else>
            <option
              v-for="option in options"
              :value="option.value ?? option"
              :key="option.value ?? option"
            >
              {{ option.text ?? option }}
            </option>
          </template>
        </select>
      </div>
      <slot name="append"></slot>
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
