<script setup>
import { ref } from "vue";
import LicencePlate from "./components/LicencePlate.vue";
import { toPng } from "html-to-image";
import SettingsPanel from "./components/SettingsPanel.vue";
import download from "downloadjs";

const plate = ref(null);

const render = () => {
  loading.value = true;
  toPng(plate.value.$el.children[0])
    .then((dataUrl) => {
      download(
        dataUrl,
        `plate-${settings.value.serial}-${settings.value.kana}-${settings.value.classification}-${settings.value.office}.png`,
      );
    })
    .catch((error) => {
      console.error("oops, something went wrong!", error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const settings = ref({
  color: "regular",
  serial: "1",
  office: "TKS",
  classification: "33",
  kana: "つ",
  showSeal: true,
});

const loading = ref(false);
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
      :show-seal="settings.showSeal"
    />
    <div class="md:overflow-hidden">
      <SettingsPanel
        v-model="settings"
        :loading="loading"
        class="relative z-10 h-full md:w-80 md:place-self-end"
        @generate="render()"
      />
    </div>
  </div>
</template>
