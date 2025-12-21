<script setup>
const model = defineModel({ type: Boolean });
</script>

<template>
  <Transition>
    <div v-if="model">
      <div class="min-h-0">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  display: grid;
  grid-template-rows: 1fr;

  transition:
    grid-template-rows 0.25s ease,
    opacity 0.25s ease;
  overflow: hidden;
}

.v-enter-from,
.v-leave-to {
  grid-template-rows: 0fr !important;
  opacity: 0;
}
</style>
