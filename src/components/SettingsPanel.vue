<script setup lang="ts">
import { computed, onMounted } from "vue";

import kana from "../data/kana.json";
import offices from "../data/offices.json";

import ColorButton from "./settings/ColorButton.vue";
import InputSelect from "./settings/InputSelect.vue";
import InputSwitch from "./settings/InputSwitch.vue";
import InputText from "./settings/InputText.vue";
import SettingsSection from "./SettingsSection.vue";

const version = import.meta.env.VITE_VERSION;

const model = defineModel();

const checkValiditySerial = (event) => {
  if (event.target.value.match(/^\d{0,4}$/))
    model.value.serial = event.target.value;
};

const checkValidityClassification = (event) => {
  if (event.target.value.match(/^\d{0,4}$/))
    model.value.classification = event.target.value;
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
  const output = kana.private.map((kana) => ({
    value: kana.kana,
    text: `${kana.kana} - ${kana.transliteration}`,
  }));

  const specialoutput = kana.special.map((character) => ({
    value: character,
    text: character,
  }));

  return [...output, ...specialoutput];
});
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
            v-model="model.color"
            value="regular"
            name="color"
            background="#d7d8d5"
            foreground="#194a17"
          />
          <ColorButton
            v-model="model.color"
            value="kei"
            name="color"
            background="#f1c209"
            foreground="#000"
          />
          <ColorButton
            v-model="model.color"
            value="commercial"
            name="color"
            background="#194a17"
            foreground="#d7d8d5"
          />
          <ColorButton
            v-model="model.color"
            value="commercial-kei"
            name="color"
            background="#000"
            foreground="#f1c209"
          />
        </div>
      </SettingsSection>
      <SettingsSection title="Serial number">
        <InputText
          :model-value="model.serial"
          maxlength="4"
          pattern="[0-9]{4}"
          @input="checkValiditySerial($event)"
        />
      </SettingsSection>
      <SettingsSection title="Office">
        <InputSelect v-model="model.office" :items="formattedOffices" />
      </SettingsSection>
      <SettingsSection title="Vehicle classification">
        <InputText
          :model-value="model.classification"
          maxlength="3"
          pattern="[0-9]{3}"
          @input="checkValidityClassification($event)"
        />
      </SettingsSection>
      <SettingsSection title="Kana">
        <InputSelect v-model="model.kana" :items="formattedKana" />
      </SettingsSection>
      <SettingsSection title="Seal">
        <InputSwitch v-model="model.showSeal" />
      </SettingsSection>
    </div>
    <div class="p-4 text-center">
      <button
        v-if="false"
        class="rounded-full bg-purple-600 px-8 py-2 text-lg font-bold text-white capitalize"
      >
        generate
      </button>
    </div>
  </div>
</template>
