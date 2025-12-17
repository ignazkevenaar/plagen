<script setup>
import Button from "./Button.vue";
</script>

<template>
  <Button class="min-h-12 w-full" v-bind="$attrs">
    <slot></slot>
  </Button>
</template>
