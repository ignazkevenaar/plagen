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

const plateSettings = ref(structuredClone(defaultPlate));

const exportSettings = ref({
  width: 33,
  unit: "cm",
  dpi: 600,
});

const generating = ref(false);
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

const importConfig = () => {
  fileInput.value.click();
};

const exportConfig = () => {
  const config = {
    version,
    licencePlate: plateSettings.value,
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
  plateSettings.value = input.licencePlate;
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
      parseFile(file);
    }
  });
};
</script>

<template>
  <div
    class="scrollbar-thin flex min-h-screen grid-cols-[auto_1fr] flex-col bg-gray-100 text-black md:grid dark:bg-gray-900 dark:text-white"
    @dragover.native="onDragOver"
    @drop.native="onDrop"
  >
    <SettingsPanel
      v-model:plate="plateSettings"
      v-model:export="exportSettings"
      :generating="generating"
      class="relative z-10 m-8 me-0 md:w-96"
      @generate="render()"
      @reset="resetPlate"
      @import="importConfig"
      @export="exportConfig"
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
    <input type="file" ref="fileInput" class="hidden" />
    <div
      v-if="draggingOver"
      class="absolute inset-0 z-20 grid place-items-center bg-gray-800/90 text-2xl md:text-3xl lg:text-6xl"
    >
      <span>
        Drop
        <code
          class="inline-block rounded-md bg-stone-700/50 p-3 font-mono text-pink-500"
          >.json</code
        >
        file to import
      </span>
    </div>
  </div>
</template>
