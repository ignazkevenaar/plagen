<script setup lang="ts">
import { computed } from "vue";

import kana from "../data/kana.json";
import offices from "../data/offices.json";

import ColorButton from "./settings/ColorButton.vue";
import InputSelect from "./settings/InputSelect.vue";
import InputSwitch from "./settings/InputSwitch.vue";
import InputText from "./settings/InputText.vue";
import SettingsSection from "./SettingsSection.vue";

const version = import.meta.env.VITE_VERSION;

const plateModel = defineModel("plate");
const exportModel = defineModel("export");

const emit = defineEmits(["generate"]);
const props = defineProps({
  generating: Boolean,
});

const checkValiditySerial = (event) => {
  if (event.target.value.match(/^\d{0,4}$/))
    plateModel.value.serial = event.target.value;
};

const checkValidityClassification = (event) => {
  if (event.target.value.match(/^\d{0,4}$/))
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

const checkKanaOnColorChange = (newColor) => {
  const validKana = kana[newColor === "commercial" ? "commercial" : "private"];
  if (newColor !== "commercial") validKana.push(...kana.special);

  const isKanaValid = validKana.find(
    (k) =>
      k.transliteration === plateModel.value.kana ||
      k === plateModel.value.kana,
  );

  if (!isKanaValid) {
    plateModel.value.kana = validKana[0].transliteration;
  }
};
</script>

<template>
  <div
    class="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-700"
  >
    <div class="p-4">
      <h1 class="text-center text-xl">JDM Plate generator</h1>
      <div class="p-4 text-center">
        <p class="text-xs opacity-65">
          &copy;{{ new Date().getFullYear() }} Ignaz Kevenaar
        </p>
        <p>Version {{ version }}</p>
        <a
          href="https://github.com/ignazkevenaar/jdm-plate-generator"
          target="_blank"
        >
          View on GitHub
        </a>
      </div>
    </div>
    <div
      class="scrollbar-thin overflow-auto border-y *:p-4 dark:border-gray-800"
    >
      <SettingsSection title="Color">
        <div class="flex justify-evenly">
          <ColorButton
            v-model="plateModel.color"
            value="private"
            name="color"
            background="#d7d8d5"
            foreground="#194a17"
            @update:model-value="checkKanaOnColorChange"
          />
          <ColorButton
            v-model="plateModel.color"
            value="kei"
            name="color"
            background="#f1c209"
            foreground="#000"
            @update:model-value="checkKanaOnColorChange"
          />
          <ColorButton
            v-model="plateModel.color"
            value="commercial"
            name="color"
            background="#194a17"
            foreground="#d7d8d5"
            @update:model-value="checkKanaOnColorChange"
          />
          <ColorButton
            v-model="plateModel.color"
            value="commercial-kei"
            name="color"
            background="#000"
            foreground="#f1c209"
            @update:model-value="checkKanaOnColorChange"
          />
        </div>
      </SettingsSection>
      <SettingsSection title="Serial number">
        <InputText
          :model-value="plateModel.serial"
          maxlength="4"
          pattern="[0-9]{4}"
          @input="checkValiditySerial($event)"
        />
      </SettingsSection>
      <SettingsSection title="Office">
        <InputSelect v-model="plateModel.office" :items="formattedOffices" />
      </SettingsSection>
      <SettingsSection title="Vehicle classification">
        <InputText
          :model-value="plateModel.classification"
          maxlength="3"
          pattern="[0-9]{3}"
          @input="checkValidityClassification($event)"
        />
      </SettingsSection>
      <SettingsSection title="Kana">
        <InputSelect v-model="plateModel.kana" :items="formattedKana" />
      </SettingsSection>
      <SettingsSection title="Show Seal">
        <InputSwitch v-model="plateModel.showSeal" />
      </SettingsSection>
      <SettingsSection title="Show Screws">
        <InputSwitch v-model="plateModel.showScrews" />
      </SettingsSection>
      <hr />
      <SettingsSection title="Export width">
        <div class="flex gap-2">
          <InputText v-model="exportModel.width" type="number" min="1" />
          <InputSelect v-model="exportModel.unit" :items="exportUnits" />
        </div>
      </SettingsSection>
      <SettingsSection v-if="exportModel.unit !== 'px'" title="DPI">
        <InputText
          v-model="exportModel.dpi"
          type="number"
          min="72"
          max="2400"
        />
      </SettingsSection>
    </div>
    <div class="p-4">
      <button
        class="mx-auto flex cursor-pointer items-baseline gap-2 rounded-full bg-purple-600 px-6 py-2 text-lg font-bold text-white capitalize"
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
    </div>
  </div>
</template>
