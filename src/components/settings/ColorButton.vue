<script setup>
const model = defineModel();

defineProps({
  background: String,
  foreground: String
});
</script>

<template>
  <label class="size-10 rounded-full grid place-items-center has-[:checked]:ring-4 ring-purple-600" :style="{'background-color': background, 'color': foreground}">
    <input v-model="model" type="radio" class="hidden" v-bind="$attrs"></input>
    <div class="size-4 rounded-full bg-current"> </div>
  </label>
</template>
