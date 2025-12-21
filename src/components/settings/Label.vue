<script setup>
defineProps({
  label: String,
  sublabel: String,
  inline: Boolean,
});
</script>

<template>
  <label
    class="font-semibold"
    :class="inline ? 'flex items-center gap-2' : 'block'"
  >
    <slot name="prepend"></slot>
    <span v-if="label" class="block text-[10pt] uppercase select-none">{{
      label
    }}</span>
    <span
      v-if="sublabel"
      class="mb-1 block text-[10pt] font-normal opacity-60 select-none"
    >
      {{ sublabel }}
    </span>
    <slot />
  </label>
</template>
