<script setup>
import { ref, watch, computed } from "vue";
import locations from "../../data/locations.json";
import TableCell from "./TableCell.vue";
import Transliteration from "./Transliteration.vue";
import Button from "../settings/Button.vue";
import TableHeader from "./TableHeader.vue";
import TableLabel from "./TableLabel.vue";
import LabelSwitch from "../settings/LabelSwitch.vue";

const model = defineModel({ type: String });
const dialogModel = defineModel("dialog", { type: Boolean });
const dialogElement = ref(null);

const selectedRegionValue = ref(null);
const searchQuery = ref("");
const showOld = ref(false);

const parsedLocations = computed(() =>
  structuredClone(locations).flatMap((region) => {
    // Quickly filter by selected region.
    if (
      searchQuery.value.length === 0 &&
      selectedRegionValue.value?.length &&
      region.transliteration !== selectedRegionValue.value
    )
      return [];

    region.prefectures = region.prefectures.flatMap((prefecture) => {
      let newPlaces = [];
      // Merge old designations into regular places with marker key.
      prefecture.places.forEach((place) => {
        newPlaces.push(place);

        const oldPlaces = place.old;
        if (oldPlaces && showOld.value) {
          oldPlaces.forEach((oldPlace) => {
            oldPlace.isOld = true;
            oldPlace.transliteration = place.transliteration;
          });
          newPlaces.push(...oldPlaces);
        }
      });

      if (searchQuery.value.length) {
        const sQ = searchQuery.value.toLowerCase();
        newPlaces = newPlaces.filter(
          (place) =>
            place.name?.toLowerCase().indexOf(sQ) > -1 ||
            place.transliteration?.toLowerCase().indexOf(sQ) > -1 ||
            place.international?.toLowerCase().indexOf(sQ) > -1,
        );
      }

      // Filter out old designations without international marking.
      newPlaces = newPlaces.filter((place) => place.international);
      prefecture.places = newPlaces;

      if (prefecture.places.length === 0) return [];
      return prefecture;
    });

    if (region.prefectures.length === 0) return [];
    return region;
  }),
);

const setRegionFilter = (newValue) => {
  if (selectedRegionValue.value === newValue) selectedRegionValue.value = null;
  else selectedRegionValue.value = newValue;
};

const internalModel = ref(null);
watch(
  () => model.value,
  (newValue) => {
    internalModel.value = newValue;
  },
  { immediate: true },
);

watch(
  () => dialogModel.value,
  (open) => {
    if (open) {
      const selectedRegion = locations.find((region) =>
        region.prefectures.some((prefecture) =>
          prefecture.places.some(
            (place) => place.international === model.value,
          ),
        ),
      );
      if (selectedRegion)
        selectedRegionValue.value = selectedRegion.transliteration;

      dialogElement.value.showModal();
      dialogElement.value.querySelector(".selected")?.scrollIntoView();
    } else dialogElement.value?.close();
  },
  { immediate: true },
);
</script>

<template>
  <dialog
    ref="dialogElement"
    class="z-50 m-auto hidden w-5xl flex-col rounded-2xl bg-gray-50 shadow-2xl outline-0 backdrop:bg-gray-100 open:flex dark:bg-gray-800 backdrop:dark:bg-gray-900/80"
    @close="dialogModel = false"
  >
    <div class="flex items-center justify-between p-5">
      <span class="text-xl">Select location</span>
      <button class="-m-2 cursor-pointer p-2" @click="dialogModel = false">
        <mdicon name="close"></mdicon>
      </button>
    </div>
    <div class="p-5 pt-0">
      <input
        v-model="searchQuery"
        type="text"
        autofocus
        placeholder="Search"
        class="w-full appearance-none rounded-md bg-gray-100 p-1 text-xl font-normal dark:bg-gray-900"
      />
      <ul
        v-show="searchQuery === ''"
        class="mt-5 grid grid-cols-2 items-center gap-0.5 sm:grid-cols-3 md:grid-cols-4"
      >
        <TableCell
          v-for="region in locations"
          :key="region.transliteration"
          @click="setRegionFilter(region.transliteration)"
          :class="
            region.transliteration === selectedRegionValue
              ? ['text-red-500']
              : []
          "
        >
          <Transliteration :value="region" />
        </TableCell>
      </ul>
    </div>
    <div
      class="flex shrink flex-col gap-10 overflow-auto border-y border-y-gray-200 p-5 py-3 dark:border-y-gray-600"
    >
      <ul
        v-for="region in parsedLocations"
        :key="region.transliteration"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
      >
        <TableHeader
          v-if="parsedLocations.length > 1"
          :value="region"
          class="col-span-full"
        />
        <li
          v-for="prefecture in region.prefectures"
          :key="prefecture.transliteration"
          class="col-span-full grid grid-cols-subgrid"
        >
          <TableCell disabled>
            <Transliteration :value="prefecture" class="sticky top-0" />
          </TableCell>
          <div class="col-span-full col-start-2 grid grid-cols-subgrid">
            <TableCell
              v-for="place in prefecture.places"
              :key="`${place.transliteration}-${place.international}`"
              :selected="place.international === internalModel"
              class="relative"
              @click="internalModel = place.international"
            >
              <Transliteration :value="place" class="grow">
                <template #append>
                  <TableLabel v-if="place.local" class="bg-blue-500">
                    Local
                  </TableLabel>
                  <TableLabel
                    v-if="place.isOld"
                    class="bg-[#A1887F] dark:bg-[#6D4C41]"
                  >
                    Old
                  </TableLabel>
                </template>
              </Transliteration>
            </TableCell>
          </div>
        </li>
      </ul>
    </div>
    <div class="flex justify-end gap-2 p-5 py-3">
      <LabelSwitch v-model="showOld" label="Show old locations" />
      <div class="grow"></div>
      <Button
        @click="
          dialogModel = false;
          model = internalModel;
        "
        accent
      >
        Confirm
      </Button>
      <Button @click="dialogModel = false"> Cancel </Button>
    </div>
  </dialog>
</template>
