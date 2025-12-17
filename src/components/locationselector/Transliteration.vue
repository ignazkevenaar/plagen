<script setup>
defineProps({
  value: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-col items-center gap-0.5">
    <span class="text-xl tracking-widest">
      {{ value.name }}
    </span>
    <br />
    <div class="flex w-full gap-2">
      <div class="flex flex-1 justify-start">
        <slot name="prepend" />
      </div>
      <div
        class="grow-0 text-xs font-semibold whitespace-nowrap opacity-60 *:not-first:before:mx-1 *:not-first:before:inline-block *:not-first:before:opacity-50 *:not-first:before:content-['•']"
      >
        <span v-if="value.transliteration">
          {{ value.transliteration }}
        </span>
        <span v-if="value.international" class="font-mono">
          {{ value.international }}
        </span>
      </div>
      <div class="flex flex-1 justify-end">
        <slot name="append" />
      </div>
    </div>
  </div>
</template>
