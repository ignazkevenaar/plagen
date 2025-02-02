<script setup lang="ts">
import { computed, ref } from "vue";

import kana from "../data/kana.json";
import offices from "../data/offices.json";

import CollapsablePanel from "./CollapsablePanel.vue";
import LabelInput from "./settings/LabelInput.vue";
import LabelSelect from "./settings/LabelSelect.vue";
import LabelSwitch from "./settings/LabelSwitch.vue";
import PlateColorButton from "./settings/PlateColorButton.vue";
import AppHeader from "./AppHeader.vue";

const plateModel = defineModel("plate");
const exportModel = defineModel("export");

const emit = defineEmits(["generate"]);
defineProps({
  generating: Boolean,
});

const checkValiditySerial = (event) => {
  if (event.target.value.match(/^\d{0,4}$/))
    plateModel.value.serial = event.target.value;
};

const checkValidityClassification = (event) => {
  if (event.target.value.match(/^\d{0,3}$/))
    plateModel.value.classification = event.target.value;
};

const formattedOffices = computed(() =>
  offices.flatMap((prefecture) =>
    prefecture.municipalities.flatMap((municipality) =>
      municipality.markings.flatMap((marking) => ({
        value: marking.international,
        text: `${prefecture.transliteration} - ${municipality.name} - ${marking.transliteration} / ${marking.kanji}`,
      })),
    ),
  ),
);

const formattedKana = computed(() => {
  if (plateModel.value?.color === "commercial") {
    return kana.commercial.map((kana) => ({
      value: kana.transliteration,
      text: `${kana.kana} - ${kana.transliteration}`,
    }));
  }

  const output = kana.private.map((kana) => ({
    value: kana.transliteration,
    text: `${kana.kana} - ${kana.transliteration}`,
  }));

  const specialoutput = kana.special.map((character) => ({
    value: character,
    text: character,
  }));

  return [...output, ...specialoutput];
});

const exportUnits = ["cm", "mm", "in", "px"];

const checkKanaOnColorChange = () => {
  if (!formattedKana.value.find((k) => k.value === plateModel.value.kana)) {
    plateModel.value.kana = formattedKana.value[0].value;
  }
};

const platePanelOpen = ref(true);
const exportPanelOpen = ref(true);
</script>

<template>
  <div class="flex flex-col gap-4 drop-shadow-lg">
    <AppHeader />

    <CollapsablePanel v-model="platePanelOpen">
      <template #title>Licence Plate Settings</template>
      <template #afterTitle>
        <button
          class="cursor-pointer rounded-md bg-gray-100 p-1 hover:bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-600"
        >
          <mdicon
            name="delete-outline"
            class="size-6 fill-gray-500 dark:fill-gray-400"
          />
        </button>
      </template>

      <label class="block font-semibold">
        <span class="block text-[10pt] uppercase select-none">Plate type</span>
        <div class="mt-1 grid grid-cols-4 gap-4">
          <PlateColorButton
            v-model="plateModel.color"
            label="Private"
            value="private"
            background="#d7d8d5"
            foreground="#194a17"
            @update:model-value="checkKanaOnColorChange"
          />
          <PlateColorButton
            v-model="plateModel.color"
            label="Kei"
            value="kei"
            background="#f1c209"
            foreground="#000"
            @update:model-value="checkKanaOnColorChange"
          />
          <PlateColorButton
            v-model="plateModel.color"
            label="Commercial"
            value="commercial"
            background="#194a17"
            foreground="#d7d8d5"
            @update:model-value="checkKanaOnColorChange"
          />
          <PlateColorButton
            v-model="plateModel.color"
            label="Comm. Kei"
            value="commercial-kei"
            background="#000"
            foreground="#f1c209"
            @update:model-value="checkKanaOnColorChange"
          />
        </div>
      </label>

      <LabelInput
        :model-value="plateModel.serial"
        large
        maxlength="4"
        pattern="[0-9]{4}"
        @input="checkValiditySerial($event)"
        label="Serial number"
        sublabel="0-9 allowed, leave out leading zeros or hyphen."
      />
      <LabelSelect
        v-model="plateModel.office"
        :options="formattedOffices"
        label="Issuing Office"
      />
      <div class="grid grid-cols-2 gap-4">
        <LabelInput
          :model-value="plateModel.classification"
          maxlength="3"
          pattern="[0-9]{4}"
          @input="checkValidityClassification($event)"
          label="Classification"
        />
        <LabelSelect
          v-model="plateModel.kana"
          :options="formattedKana"
          label="Kana"
        />
      </div>
      <LabelSwitch v-model="plateModel.showSeal" label="Show Seal" />
      <LabelSwitch v-model="plateModel.showScrews" label="Show Screws" />
    </CollapsablePanel>
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
      <button
        class="block w-full rounded-md bg-black p-2 text-sm font-semibold text-white uppercase enabled:cursor-pointer"
        :disabled="generating"
        @click="emit('generate')"
      >
        Download PNG
        <svg
          v-if="generating"
          class="size-5 translate-y-1 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </button>
    </CollapsablePanel>
  </div>
</template>
