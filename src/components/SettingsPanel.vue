<script setup lang="ts">
import { ref } from "vue";

import CollapsablePanel from "./CollapsablePanel.vue";
import LabelInput from "./settings/LabelInput.vue";
import LabelSelect from "./settings/LabelSelect.vue";
import AppHeader from "./AppHeader.vue";
import TopLevelButton from "./settings/TopLevelButton.vue";
import PlateSettings from "./PlateSettings.vue";

const exportModel = defineModel("export");

defineProps({
  generating: Boolean,
  plates: Array,
  previewedPlateIndex: Number,
});

const emit = defineEmits([
  "generate",
  "reset",
  "import",
  "export",
  "update:plate",
  "add:plate",
  "delete:plate",
  "reset:plate",
  "preview:plate",
]);

const exportUnits = ["cm", "mm", "in", "px"];
const exportPanelOpen = ref(true);
</script>

<template>
  <div class="flex flex-col gap-4 drop-shadow-lg">
    <AppHeader />

    <div class="rounded-md border p-2 empty:hidden">
      <slot name="debug"></slot>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <TopLevelButton prepend-icon="import" @click="emit('import')">
        Import
      </TopLevelButton>
      <TopLevelButton prepend-icon="export" @click="emit('export')">
        Export
      </TopLevelButton>
    </div>

    <div class="space-y-2">
      <PlateSettings
        v-for="(plate, plateIndex) in plates"
        :key="plateIndex"
        :model-value="plate"
        :index="plateIndex"
        :show-reset-button="plates?.length <= 1"
        :is-previewing="previewedPlateIndex === plateIndex"
        @update:model-value="emit('update:plate', plateIndex, $event)"
        @reset="emit('reset:plate', plateIndex)"
        @delete="emit('delete:plate', plateIndex)"
        @preview="emit('preview:plate', plateIndex)"
      />
    </div>

    <TopLevelButton
      prepend-icon="plus-circle-outline"
      @click="emit('add:plate')"
    >
      Add Plate
    </TopLevelButton>

    <div class="-my-2 grow"></div>

    <CollapsablePanel v-model="exportPanelOpen">
      <template #title>Export Settings</template>

      <div class="grid grid-cols-[auto_1fr_1fr] grid-rows-2 gap-4">
        <div class="row-span-2 -me-4 -translate-x-1 content-center pt-2">
          <mdicon
            name="link"
            class="relative block size-6 rotate-90 fill-current opacity-35"
            title="Width and height are linked"
          ></mdicon>
        </div>
        <LabelInput
          v-model.number="exportModel.width"
          type="number"
          min="1"
          step="0.5"
          label="Width"
        />
        <LabelInput
          :model-value="exportModel.width / 2"
          type="number"
          min="1"
          step="0.5"
          label="Height"
          class="col-start-2 row-start-2"
          @update:model-value="exportModel.width = $event * 2"
        />
        <LabelSelect
          v-model="exportModel.unit"
          :options="exportUnits"
          label="Unit"
        />
        <LabelInput
          v-model.number="exportModel.dpi"
          type="number"
          min="72"
          max="2400"
          label="DPI"
        />
      </div>
      <TopLevelButton
        prepend-icon="download-circle-outline"
        :loading="generating"
        class="!rounded-md"
        @click="emit('generate')"
      >
        Download PNG
      </TopLevelButton>
    </CollapsablePanel>
  </div>
</template>
