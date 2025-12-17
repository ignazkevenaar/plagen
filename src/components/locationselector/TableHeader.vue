<script setup>
defineProps({
  value: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="my-2 flex items-center gap-2">
    <span class="text-2xl tracking-widest">
      {{ value.name }}
    </span>
    <div class="font-semibold whitespace-nowrap opacity-75">
      —
      {{ value.transliteration }}
    </div>
  </div>
</template>
