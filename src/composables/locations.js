import { computed } from "vue";
import locations from "../data/locations.json";

export function useLocations(getCurrentOffice) {
  const flatLocations = computed(() =>
    locations.flatMap((region) =>
      region.prefectures.flatMap((prefecture) =>
        prefecture.places.flatMap((place) => {
          const addPathToPlace = (place) => ({
            region: {
              name: region.name,
              transliteration: region.transliteration,
            },
            prefecture: {
              name: prefecture.name,
              transliteration: prefecture.transliteration,
            },
            ...place,
          });

          const places = [addPathToPlace(place)];

          if (place.old) {
            const isOldPlaceSelected = place.old.find(
              (oldPlace) => oldPlace.international === getCurrentOffice(),
            );

            if (isOldPlaceSelected) {
              places.push({
                ...addPathToPlace(isOldPlaceSelected),
                transliteration: place.transliteration,
                old: true,
              });
            }
          }

          return places;
        }),
      ),
    ),
  );

  const currentLocationName = computed(() => {
    const found = flatLocations.value.find(
      (location) => location.international === getCurrentOffice(),
    );
    if (found) return found.name;
    return "ERR";
  });

  const currentPrefecture = computed(
    () =>
      flatLocations.value.find(
        (location) => location.international === getCurrentOffice(),
      ).prefecture,
  );

  const repeatingSealCharacters = computed(() => {
    const characterSet = new Set();

    return locations.flatMap((region) =>
      region.prefectures.flatMap((prefecture) => {
        const firstChar = prefecture.name[0];
        if (characterSet.has(firstChar)) return [firstChar];

        characterSet.add(firstChar);
        return [];
      }),
    );
  });

  const currentSealCharacters = computed(() => {
    if (currentPrefecture.value === undefined) return "?";

    return currentPrefecture.value.name.substring(
      0,
      repeatingSealCharacters.value.includes(currentPrefecture.value.name[0])
        ? 2
        : 1,
    );
  });

  // Function is a tool used when inlcuding fonts to only include used characters.
  const usedKanjiCharacters = computed(() => {
    const characterSet = new Set();

    locations.forEach((region) =>
      region.prefectures.forEach((prefecture) => {
        Array.from(prefecture.name).forEach((c) => characterSet.add(c));
        prefecture.places.forEach((place) => {
          Array.from(place.name).forEach((c) => characterSet.add(c));
          if (place.old) {
            place.old.forEach((place) => {
              Array.from(place.name).forEach((c) => characterSet.add(c));
            });
          }
        });
      }),
    );

    return Array.from(characterSet);
  });

  return {
    flatLocations,
    currentLocationName,
    currentSealCharacters,
    usedKanjiCharacters,
  };
}
