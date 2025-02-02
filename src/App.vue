<script setup>
import { nextTick, ref, computed } from "vue";
import LicencePlate from "./components/LicencePlate.vue";
import { toPng } from "html-to-image";
import SettingsPanel from "./components/SettingsPanel.vue";
import download from "downloadjs";

const defaultPlate = {
  color: "private",
  serial: "1",
  office: "TKS",
  classification: "33",
  kana: "tsu",
  showSeal: true,
  showScrews: true,
};

const plateSettings = ref(structuredClone(defaultPlate));

const exportSettings = ref({
  width: 33,
  unit: "cm",
  dpi: 600,
});

const generating = ref(false);
const plateElement = ref(null);

const plateWidthPx = computed(() => {
  if (exportSettings.value.unit === "px") return exportSettings.value.width;
  else if (exportSettings.value.unit === "in")
    return exportSettings.value.width * exportSettings.value.dpi;
  else if (exportSettings.value.unit === "cm")
    return (exportSettings.value.width * exportSettings.value.dpi) / 2.54;
  else if (exportSettings.value.unit === "mm")
    return (exportSettings.value.width * exportSettings.value.dpi) / 25.4;

  return 0;
});

const render = () => {
  generating.value = true;
  nextTick(() => {
    toPng(plateElement.value.$el.children[0])
      .then((dataUrl) => {
        let sizePart = `${exportSettings.value.width}${exportSettings.value.unit}`;
        if (exportSettings.value.unit !== "px")
          sizePart += `@${exportSettings.value.dpi}dpi`;

        const filename = [
          "plate",
          plateSettings.value.serial,
          plateSettings.value.kana,
          plateSettings.value.classification,
          plateSettings.value.office,
          plateSettings.value.color,
          sizePart,
        ].join("-");

        download(dataUrl, `${filename}.png`);
      })
      .catch((error) => {
        console.error("oops, something went wrong!", error);
      })
      .finally(() => {
        generating.value = false;
      });
  });
};

const resetPlate = () => {
  plateSettings.value = structuredClone(defaultPlate);
};
</script>

<template>
  <div
    class="scrollbar-thin flex min-h-screen grid-cols-[auto_1fr] flex-col bg-gray-100 text-black md:grid dark:bg-gray-900 dark:text-white"
  >
    <SettingsPanel
      v-model:plate="plateSettings"
      v-model:export="exportSettings"
      :generating="generating"
      class="relative z-10 m-8 me-0 md:w-96"
      @generate="render()"
      @reset="resetPlate"
    />
    <!-- Preview plate -->
    <div class="sticky top-0 grid h-screen items-center p-8">
      <LicencePlate
        class="max-h-screen place-self-center"
        :color="plateSettings.color"
        :serial="plateSettings.serial"
        :office="plateSettings.office"
        :classification="plateSettings.classification"
        :kana="plateSettings.kana"
        :show-seal="plateSettings.showSeal"
        :show-screws="plateSettings.showScrews"
      />
    </div>
    <div
      v-if="generating"
      class="absolute -top-full -left-full h-0 w-0 overflow-hidden"
    >
      <LicencePlate
        ref="plateElement"
        :color="plateSettings.color"
        :serial="plateSettings.serial"
        :office="plateSettings.office"
        :classification="plateSettings.classification"
        :kana="plateSettings.kana"
        :show-seal="plateSettings.showSeal"
        :show-screws="plateSettings.showScrews"
        :style="{ width: `${Math.round(plateWidthPx)}px !important` }"
      />
    </div>
  </div>
</template>
