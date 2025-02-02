<script setup>
import { nextTick, ref, computed } from "vue";
import LicencePlate from "./components/LicencePlate.vue";
import { toPng } from "html-to-image";
import SettingsPanel from "./components/SettingsPanel.vue";
import download from "downloadjs";

const plateSettings = ref({
  color: "private",
  serial: "1",
  office: "TKS",
  classification: "33",
  kana: "tsu",
  showSeal: true,
  showScrews: true,
});

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
</script>

<template>
  <div
    class="flex min-h-screen grid-cols-[auto_1fr] flex-col gap-6 bg-gray-50 p-8 text-black scheme-light-dark md:grid md:h-screen md:overflow-hidden dark:bg-gray-800 dark:text-white"
  >
    <div class="md:overflow-hidden">
      <SettingsPanel
        v-model:plate="plateSettings"
        v-model:export="exportSettings"
        :generating="generating"
        class="relative z-10 h-full md:w-80 md:place-self-end"
        @generate="render()"
      />
    </div>
    <!-- Preview plate -->
    <LicencePlate
      class="place-self-center"
      :color="plateSettings.color"
      :serial="plateSettings.serial"
      :office="plateSettings.office"
      :classification="plateSettings.classification"
      :kana="plateSettings.kana"
      :show-seal="plateSettings.showSeal"
      :show-screws="plateSettings.showScrews"
    />
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
