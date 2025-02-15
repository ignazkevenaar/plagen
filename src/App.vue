<script setup>
import { nextTick, ref, computed, onMounted } from "vue";
import { toPng } from "html-to-image";
import download from "downloadjs";
import LicencePlate from "./components/LicencePlate.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import { Validator } from "jsonschema";
import interchangeFileSchema from "./schemas/interchange-file.schema.json";

const version = import.meta.env.VITE_VERSION;

const defaultPlate = {
  color: "private",
  serial: "1",
  office: "TKS",
  classification: "33",
  kana: "tsu",
  showSeal: true,
  showScrews: true,
};

const plates = ref([]);
const previewedPlateIndex = ref(0);
const previewedPlate = computed(() => plates.value[previewedPlateIndex.value]);

const exportSettings = ref({
  width: 33,
  unit: "cm",
  dpi: 600,
  jikoShiki: true,
});

const generating = ref(false);
const generatingAlphaMask = ref(false);
const generatingLightnessMask = ref(false);
const generatedMask = ref(null);

const plateElement = ref(null);
const fileInput = ref(null);
const draggingOver = ref(false);
let dragHintTimeout;

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

const render = async () => {
  generating.value = true;

  if (exportSettings.value.jikoShiki) {
    generatingAlphaMask.value = true;
  }

  const getFileName = () => {
    let sizePart = `${exportSettings.value.width}${exportSettings.value.unit}`;
    if (exportSettings.value.unit !== "px")
      sizePart += `@${exportSettings.value.dpi}dpi`;

    const parts = [
      "plate",
      previewedPlate.value.serial,
      previewedPlate.value.kana,
      previewedPlate.value.classification,
      previewedPlate.value.office,
      previewedPlate.value.color,
      sizePart,
    ];

    if (generatingLightnessMask.value) {
      parts.push("mask");
    }

    return parts.join("-");
  };

  const renderOnNextTick = async () => {
    return nextTick(() => {
      return toPng(plateElement.value.$el.children[0]);
    });
  };

  let dataURL = await renderOnNextTick();

  if (generatingAlphaMask.value) {
    generatedMask.value = dataURL;
    generatingAlphaMask.value = false;
  }

  if (exportSettings.value.jikoShiki) {
    generatingLightnessMask.value = true;
    dataURL = await renderOnNextTick();
    download(dataURL, `${getFileName()}.png`);
    generatingLightnessMask.value = false;
  }

  dataURL = await renderOnNextTick();
  download(dataURL, `${getFileName()}.png`);
  generating.value = false;
  generatedMask.value = null;
};

const importConfig = () => {
  fileInput.value.click();
};

const exportConfig = () => {
  const config = {
    version,
    licencePlates: plates.value,
    settings: {
      export: exportSettings.value,
    },
  };
  const configString = JSON.stringify(config);

  download(configString, "plategen.json", "application/json");
};

const parseFile = async (fileName) => {
  const parseJsonFile = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });
  };

  const input = await parseJsonFile(fileName);
  fileInput.value.value = null;

  const v = new Validator();
  const validation = v.validate(input, interchangeFileSchema);
  if (validation.errors.length > 0) {
    console.error("Error importing JSON", validation.errors);
    return;
  }

  exportSettings.value = input.settings.export;
  plates.value = input.licencePlates;
};

// For input[type=file] only
const handleInputFile = async () => {
  if (fileInput.value.files.length !== 1) {
    fileInput.value.value = null;
    return;
  }

  parseFile(fileInput.value.files[0]);
};

onMounted(() => {
  fileInput.value.addEventListener("change", handleInputFile);
});

const onDragOver = (event) => {
  // Latching timeout because ondragstart and ondragend
  // are not fired when dragging files from OS into browser!
  draggingOver.value = true;
  clearTimeout(dragHintTimeout);
  dragHintTimeout = setTimeout(() => {
    draggingOver.value = false;
  }, 200);

  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
};

const onDrop = (event) => {
  // Prevent file from being opened
  event.preventDefault();

  draggingOver.value = false;
  clearTimeout(dragHintTimeout);

  [...event.dataTransfer.items].forEach((item) => {
    if (item.kind === "file") {
      const file = item.getAsFile();
      if (file.type === "application/json") parseFile(file);
    }
  });
};

const updatePlate = (plateIndex, plate) => {
  plates.value[plateIndex] = plate;
};

const resetPlate = (plateIndex) => {
  updatePlate(plateIndex, structuredClone(defaultPlate));
};

const deletePlate = (plateIndex) => {
  plates.value.splice(plateIndex, 1);

  if (plateIndex <= previewedPlateIndex.value) {
    previewedPlateIndex.value = Math.max(previewedPlateIndex.value - 1, 0);
  }
};

const addPlate = () => {
  plates.value.push(structuredClone(defaultPlate));
  previewedPlateIndex.value = plates.value.length - 1;
};

onMounted(() => addPlate());
</script>

<template>
  <div
    class="flex min-h-screen grid-cols-[auto_1fr] flex-col bg-gray-100 text-black md:grid dark:bg-gray-900 dark:text-white"
    @dragover.native="onDragOver"
    @drop.native="onDrop"
  >
    <SettingsPanel
      v-model:plates="plates"
      v-model:export="exportSettings"
      :generating="generating"
      :previewed-plate-index="previewedPlateIndex"
      class="relative z-10 m-4 md:m-8 md:me-0 md:w-96"
      @generate="render()"
      @import="importConfig"
      @export="exportConfig"
      @switch-open="previewedPlateIndex = $event"
      @update:plate="updatePlate"
      @reset:plate="resetPlate"
      @delete:plate="deletePlate"
      @add:plate="addPlate"
      @preview:plate="previewedPlateIndex = $event"
    />

    <!-- Preview plate -->
    <div
      class="mask-bottom md:mask-none sticky top-0 z-20 -order-1 grid items-center bg-gray-900 p-8 md:order-1 md:h-screen md:bg-transparent"
    >
      <LicencePlate
        v-if="previewedPlate"
        class="max-h-screen place-self-center"
        :color="previewedPlate.color"
        :serial="previewedPlate.serial"
        :office="previewedPlate.office"
        :classification="previewedPlate.classification"
        :kana="previewedPlate.kana"
        :show-seal="previewedPlate.showSeal"
        :show-screws="previewedPlate.showScrews"
      />
    </div>
    <div
      v-if="generating"
      class="absolute -top-full -left-full h-0 w-0 overflow-hidden"
    >
      <LicencePlate
        ref="plateElement"
        :color="previewedPlate.color"
        :serial="previewedPlate.serial"
        :office="previewedPlate.office"
        :classification="previewedPlate.classification"
        :kana="previewedPlate.kana"
        :show-seal="previewedPlate.showSeal"
        :show-screws="previewedPlate.showScrews"
        :alpha-mask="generatingAlphaMask"
        :lightness-mask="generatingLightnessMask"
        :apply-mask="generatedMask"
        :style="{ width: `${Math.round(plateWidthPx)}px !important` }"
      />
    </div>
    <input type="file" ref="fileInput" class="hidden" />
    <div
      v-if="draggingOver"
      class="fixed inset-0 z-30 grid place-items-center bg-gray-100/90 text-2xl md:text-3xl lg:text-6xl dark:bg-gray-800/90"
    >
      <span>
        Drop
        <code
          class="inline-block rounded-md bg-gray-300/75 p-3 font-mono text-pink-500 dark:bg-gray-700/50"
          >.json</code
        >
        file to import
      </span>
    </div>
  </div>
</template>
