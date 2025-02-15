<script setup>
import { computed } from "vue";

import kana from "../data/kana.json";
import offices from "../data/offices.json";

import CollapsablePanel from "./CollapsablePanel.vue";
import IconButton from "./settings/IconButton.vue";
import LabelInput from "./settings/LabelInput.vue";
import LabelSelect from "./settings/LabelSelect.vue";
import LabelSwitch from "./settings/LabelSwitch.vue";
import PlateColorButton from "./settings/PlateColorButton.vue";

const props = defineProps({
  modelValue: Object,
  index: Number,
  isPreviewing: Boolean,
  showResetButton: Boolean,
});

const emit = defineEmits(["update:modelValue", "reset", "delete", "preview"]);

const openModel = defineModel("open", { default: true });

const update = (key, value) => {
  emit("update:modelValue", { ...props.modelValue, [key]: value });
};

const checkValiditySerial = (event) => {
  if (event.target.value.match(/^\d{0,4}$/))
    update("serial", event.target.value);
};

const checkValidityClassification = (event) => {
  if (event.target.value.match(/^\d{0,3}$/))
    update("classification", event.target.value);
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

const getValidKanaForColor = (color) => {
  if (color === "commercial") {
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
};

const formattedKana = computed(() =>
  getValidKanaForColor(props.modelValue?.color),
);

const applyColorChange = (newColor) => {
  const updatedValue = { ...props.modelValue, color: newColor };

  // Check if kana is still valid for this color
  const validKanaForNewColor = getValidKanaForColor(newColor);
  if (!validKanaForNewColor.find((k) => k.value === updatedValue.kana)) {
    updatedValue.kana = validKanaForNewColor[0].value;
  }

  emit("update:modelValue", updatedValue);
};

const miniKana = computed(() => {
  const flatKana = [...kana.private, ...kana.commercial, ...kana.special];

  const kanaObject = flatKana.find(
    (k) =>
      k.transliteration === props.modelValue.kana ||
      k === props.modelValue.kana,
  );

  return kanaObject.kana ?? kanaObject;
});

const miniSerial = computed(() => {
  const serialString = props.modelValue.serial.toString();
  let s = serialString.padStart(4, "·");
  s = [
    s.slice(0, 2),
    serialString.length === 4 ? "-" : " ",
    s.slice(2, 4),
  ].join("");
  return s;
});

const flatOffices = computed(() =>
  offices.flatMap((prefecture) =>
    prefecture.municipalities.flatMap(
      (municipalities) => municipalities.markings,
    ),
  ),
);

const miniOffice = computed(
  () =>
    flatOffices.value.find(
      (office) => office.international === props.modelValue.office,
    )?.kanji,
);
</script>

<template>
  <CollapsablePanel v-model="openModel">
    <template #beforeTitle>
      <button
        class="cursor-pointer rounded-md bg-gray-100 p-1 hover:bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-600"
        title="Preview"
        @click.stop="emit('preview')"
      >
        <mdicon
          :name="isPreviewing ? 'eye' : 'eyeClosed'"
          class="block size-6 -scale-x-100 fill-gray-500 dark:fill-gray-400"
        />
      </button>
    </template>
    <template #title>
      <template v-if="openModel">
        Plate #{{ index }}
        <span v-if="isPreviewing" class="opacity-60 dark:opacity-30">
          — Previewing</span
        >
      </template>
      <div v-else class="flex items-center gap-2">
        <span>#{{ index }}</span>
        <div>
          {{ miniKana }}
        </div>
        <div
          class="-my-1 grid aspect-[2] items-center rounded-md border border-gray-300 px-2 font-mono text-xl font-light dark:border-gray-600"
        >
          {{ miniSerial }}
        </div>
        <div>{{ miniOffice }}</div>
        <div>{{ modelValue.classification }}</div>
      </div>
    </template>
    <template #afterTitle>
      <IconButton
        v-if="showResetButton"
        icon="reload"
        title="Reset"
        @click.stop="emit('reset')"
      />
      <IconButton
        v-else
        icon="deleteOutline"
        title="Delete"
        @click.stop="emit('delete')"
      />
    </template>

    <label class="block font-semibold">
      <span class="block text-[10pt] uppercase select-none">Plate type</span>
      <div class="mt-1 grid grid-cols-4 gap-4">
        <PlateColorButton
          :model-value="modelValue.color"
          label="Private"
          value="private"
          background="#d7d8d5"
          foreground="#194a17"
          @update:model-value="applyColorChange"
        />
        <PlateColorButton
          :model-value="modelValue.color"
          label="Kei"
          value="kei"
          background="#f1c209"
          foreground="#000"
          @update:model-value="applyColorChange"
        />
        <PlateColorButton
          :model-value="modelValue.color"
          label="Commercial"
          value="commercial"
          background="#194a17"
          foreground="#d7d8d5"
          @update:model-value="applyColorChange"
        />
        <PlateColorButton
          :model-value="modelValue.color"
          label="Comm. Kei"
          value="commercial-kei"
          background="#000"
          foreground="#f1c209"
          @update:model-value="applyColorChange"
        />
      </div>
    </label>

    <LabelInput
      :model-value="modelValue.serial"
      large
      maxlength="4"
      pattern="[0-9]{4}"
      @input="checkValiditySerial($event)"
      label="Serial number"
      sublabel="0-9 allowed, leave out leading zeros or hyphen."
    />
    <LabelSelect
      :model-value="modelValue.office"
      :options="formattedOffices"
      label="Issuing Office"
      @update:model-value="update('office', $event)"
    />
    <div class="grid grid-cols-2 gap-4">
      <LabelInput
        :model-value="modelValue.classification"
        maxlength="3"
        pattern="[0-9]{4}"
        @input="checkValidityClassification($event)"
        label="Classification"
      />
      <LabelSelect
        :model-value="modelValue.kana"
        :options="formattedKana"
        label="Kana"
        @update:model-value="update('kana', $event)"
      />
    </div>
    <LabelSwitch
      :model-value="modelValue.showSeal"
      @update:model-value="update('showSeal', $event)"
      label="Show Seal"
    />
    <LabelSwitch
      :model-value="modelValue.showScrews"
      @update:model-value="update('showScrews', $event)"
      label="Show Screws"
    />
  </CollapsablePanel>
</template>
