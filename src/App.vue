<script setup>
import { ref } from "vue";
import LicencePlate from "./components/LicencePlate.vue";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import SettingsPanel from "./components/SettingsPanel.vue";

const plate = ref(null);

const render = () => {
  var node = plate.value.$el;

  toPng(node)
    .then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      document.body.appendChild(img);
    })
    .catch(function (error) {
      console.error("oops, something went wrong!", error);
    });
};

const settings = ref({
  color: "regular",
  serial: "1",
  office: "TKS",
  classification: "33",
  kana: "つ",
});
</script>

<template>
  <div
    class="flex min-h-screen grid-cols-[1fr_auto] flex-col gap-6 bg-gray-50 p-8 text-black scheme-light-dark md:grid md:h-screen md:overflow-hidden dark:bg-gray-800 dark:text-white"
  >
    <LicencePlate
      ref="plate"
      class="place-self-center"
      :color="settings.color"
      :serial="settings.serial"
      :office="settings.office"
      :classification="settings.classification"
      :kana="settings.kana"
    />
    <div class="md:overflow-hidden">
      <SettingsPanel
        class="relative z-10 h-full md:w-80 md:place-self-end"
        v-model="settings"
      />
    </div>
  </div>
</template>
