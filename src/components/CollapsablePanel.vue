<script setup>
import ExpandTransition from "./ExpandTransition.vue";

const model = defineModel({ default: false });

const collapse = () => {
  model.value = false;
};

defineExpose({
  collapse,
});
</script>

<template>
  <div
    class="min-h-10 rounded-xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800"
  >
    <div
      class="box-content flex min-h-8 items-center gap-2 p-2 text-gray-700 dark:text-gray-300"
      @click.prevent="model = !model"
    >
      <div
        class="ms-2 size-2 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-current transition-transform"
        :class="model ? 'rotate-90' : ''"
      ></div>
      <div class="flex items-center gap-2 empty:hidden">
        <slot name="beforeTitle"></slot>
      </div>
      <h2 class="text-sm font-semibold tracking-wider uppercase select-none">
        <slot name="title"> </slot>
      </h2>
      <div class="grow"></div>
      <div class="flex items-center gap-2 empty:hidden">
        <slot name="afterTitle"></slot>
      </div>
    </div>
    <expand-transition v-model="model">
      <div class="text-gray-600 empty:hidden dark:text-gray-300">
        <div class="space-y-4 p-3 pt-0">
          <slot></slot>
        </div>
      </div>
    </expand-transition>
  </div>
</template>
