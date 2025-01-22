<script setup>
import { computed } from "vue";
import offices from "../data/offices.json";

const props = defineProps({
  color: {
    type: String,
    default: "",
  },
  serial: {
    type: String,
    default: "",
  },
  office: {
    type: String,
    default: "",
  },
  classification: {
    type: String,
    default: "",
  },
  kana: {
    type: String,
    default: "",
  },
});

const showSerialSeparator = computed(() => {
  return props.serial.length >= 4;
});

const flatOffices = computed(() =>
  offices.flatMap((prefecture) =>
    prefecture.municipalities.flatMap(
      (municipalities) => municipalities.markings,
    ),
  ),
);

const formattedOffice = computed(() => {
  const found = flatOffices.value.find(
    (office) => office.international === props.office,
  );
  if (found) return found.kanji;
  return "ERR";
});

const currentPrefecture = computed(() => {
  if (props.office === "") return undefined;

  return offices.find((prefecture) =>
    prefecture.municipalities.some((municipality) =>
      municipality.markings.find(
        (marking) => marking.international === props.office,
      ),
    ),
  );
});

const sealCharacters = computed(() => {
  if (currentPrefecture.value === undefined) return "";

  const repeatingCharacters = ["愛", "福", "宮", "長", "大", "山"];

  let output = currentPrefecture.value?.kanji.charAt(0);

  if (repeatingCharacters.includes(output)) {
    output += currentPrefecture.value?.kanji.charAt(1);
  }

  return output;
});
</script>

<template>
  <div class="licencePlate" :class="color">
    <div class="ridge"><div></div></div>
    <!-- <img src="/img/reference1.png" alt="plate reference" class="reference" /> -->
    <!-- <img src="/img/reference2.png" alt="plate reference" class="reference" /> -->
    <!-- <img src="/img/reference3.png" alt="plate reference" class="reference" /> -->
    <div class="screws">
      <div>
        <div class="seal">
          <div>
            <span :class="{ small: sealCharacters.length > 1 }">
              <span v-text="sealCharacters[0]" />
              <span
                v-if="sealCharacters.length > 1"
                v-text="sealCharacters[1]"
              />
            </span>
          </div>
        </div>
      </div>
      <div>
        <div></div>
      </div>
    </div>
    <div class="topRow">
      <p
        class="office"
        :class="{
          three: formattedOffice.length === 3,
          four: formattedOffice.length === 4,
        }"
      >
        {{ formattedOffice }}
      </p>
      <p
        v-if="classification"
        class="classification"
        :class="{ wide: classification.length < 3 }"
      >
        {{ classification }}
      </p>
    </div>
    <div class="bottomRow">
      <p class="kana">
        <span>{{ kana }}</span>
      </p>
      <div class="serial">
        <div class="number" :class="{ dot: serial.length < 4 }">
          <span>{{ serial?.[serial.length - 4] }}</span>
        </div>
        <div class="number" :class="{ dot: serial.length < 3 }">
          <span>{{ serial?.[serial.length - 3] }}</span>
        </div>
        <div
          class="separator"
          :style="{ opacity: showSerialSeparator ? 1 : 0 }"
        >
          <span></span>
        </div>
        <div class="number" :class="{ dot: serial.length < 2 }">
          <span>{{ serial?.[serial.length - 2] }}</span>
        </div>
        <div class="number" :class="{ dot: serial.length < 1 }">
          <span>{{ serial?.[serial.length - 1] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.licencePlate {
  position: relative;
  box-shadow: 5mm 10mm 25mm black;
  border: 2px solid rgba(0 0 0 / 20%);
  border-radius: 10mm;
  background-color: var(--plate-background);
  aspect-ratio: 2;
  width: 330mm;
  height: 165mm;
  color: var(--plate-foreground);

  &.regular {
    --plate-background: #d7d8d5;
    --plate-foreground: #194a17;
  }

  &.kei {
    --plate-background: #f1c209;
    --plate-foreground: #000;
  }

  &.commercial {
    --plate-background: #194a17;
    --plate-foreground: #d7d8d5;
  }

  &.commercial-kei {
    --plate-background: #000;
    --plate-foreground: #f1c209;
  }

  .ridge {
    position: absolute;
    inset: 2mm;
    box-shadow:
      inset 1mm 1mm 2mm rgba(255, 255, 255, 0.5),
      inset -1mm -1mm 2mm rgba(0, 0, 0, 0.25),
      1mm 1mm 1mm rgba(0, 0, 0, 0.2),
      -1mm -1mm 1mm rgba(255, 255, 255, 0.5);
    border-radius: 7mm;
    background-color: var(--plate-background);

    > div {
      position: absolute;
      inset: 4mm;
      box-shadow:
        1mm 1mm 2mm rgba(255, 255, 255, 0.5),
        -1mm -1mm 2mm rgba(0, 0, 0, 0.1),
        inset 1mm 1mm 1mm rgba(0, 0, 0, 0.1),
        inset -1mm -1mm 1mm rgba(255, 255, 255, 0.5);
      border-radius: 3mm;
      background-color: var(--plate-background);
    }
  }

  .reference {
    position: absolute;
    opacity: 0.25;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .screws {
    /* background-color: blue; */
    display: flex;
    position: relative;
    top: 25mm;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
    margin: auto;
    width: 210mm;

    > * {
      display: grid;
      position: relative;
      place-items: center;

      > * {
        position: absolute;
        border-radius: 100%;
        background-color: black;
        width: 8mm;
        height: 8mm;
      }

      .seal {
        display: grid;
        place-items: center;
        box-shadow:
          inset -1mm -1mm 3mm rgba(0, 0, 0, 0.4),
          2mm 2mm 4mm rgba(0, 0, 0, 0.2),
          inset 0 0 1mm 1mm rgba(0, 0, 0, 0.4),
          inset -1mm -1mm 2mm 1mm rgba(0, 0, 0, 0.25),
          inset 1mm 1mm 1mm 2mm white;
        /* background: linear-gradient(to bottom right, white 0%, grey); */
        background-image: conic-gradient(
          from 320deg at 50% 50%,
          #ffffffff 3%,
          #a4a4a4ff 35%,
          #fafafaff 52%,
          #5f5f5fff 87%,
          #ffffffff 100%
        );
        background-color: grey;
        width: 28mm;
        height: 28mm;
        font-weight: 400;
        /* font-family: "Zen Maru Gothic", serif; */
        font-family: "M PLUS Rounded 1c", serif;

        > div {
          display: grid;
          position: relative;
          place-items: center;
          box-shadow:
            0.25mm 0.25mm 0.5mm 0.25mm rgba(0, 0, 0, 0.75),
            1mm 1mm 1mm rgba(255, 255, 255, 0.6),
            -0.5mm -0.5mm 1mm rgba(0, 0, 0, 0.75),
            inset 0.25mm 0.25mm 0.25mm white,
            inset -0.25mm -0.25mm 1mm rgba(0, 0, 0, 1);
          border-radius: 100%;
          /* background: linear-gradient(to bottom right, grey 0%, #ddd 30%, silver 50%, silver 70%, white); */
          background-image: conic-gradient(
            from 320deg at 50% 50%,
            #ffffffff 3%,
            #a4a4a4ff 35%,
            #fafafaff 52%,
            grey 87%,
            #ffffffff 100%
          );
          background-color: silver;
          width: 21mm;
          height: 21mm;

          &::before {
            display: block;
            position: absolute;
            inset: 2mm;
            box-shadow:
              -0.25mm -0.25mm 0.25mm rgba(0, 0, 0, 0.25),
              inset 0.25mm 0.25mm 0.25mm white,
              inset -0.25mm -0.25mm 0.25mm rgba(0, 0, 0, 0.25);
            border-radius: 100%;
            content: "";
          }

          span {
            position: relative;
            top: -0.25mm;
            color: silver;
            font-size: 12mm;
            line-height: 0;
            text-shadow:
              0.25mm 0.25mm 0.25mm white,
              -0.2mm -0.2mm 0.5mm black;

            &.small {
              span {
                display: block;
                transform: scaleY(0.8);
                font-size: 8mm;
                line-height: 7mm;
              }
            }
          }
        }
      }
    }
  }

  .topRow,
  .bottomRow {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    margin: auto;
  }

  .topRow {
    top: 13.5mm;
    left: 2.5mm;
    justify-content: space-evenly;
    /* background-color: rgba(255, 0, 0, 0.25); */
    width: 190mm;
    height: 40mm;
    white-space: nowrap;

    .office {
      transform-origin: center left;
      filter: url("#drop-shadow");
      /* background-color: rgba(0, 0, 255, 0.1); */
      font-weight: 500;
      font-size: 48mm;
      /* font-family: "Kiwi Maru", serif; */
      /* font-family: "Kosugi Maru", serif; */
      /* font-family: "Zen Maru Gothic", serif; */
      font-family: "M PLUS Rounded 1c", serif;
      letter-spacing: -4mm;

      &.three {
        transform: scaleY(1.5);
        font-size: 30mm;
        letter-spacing: normal;
      }

      &.four {
        transform: scaleY(2);
        font-weight: 600;
        font-size: 23mm;
        letter-spacing: normal;
      }
    }

    .classification {
      position: relative;
      top: 4mm;
      /* background-color: rgba(0, 0, 255, 0.1); */
      font-size: 49mm;
      font-family: "TrmFontJB";
      letter-spacing: -1mm;

      &.wide {
        transform: scaleY(0.75);
        font-size: 65mm;
      }
    }
  }

  .bottomRow {
    display: flex;
    position: absolute;
    bottom: 12mm;
    justify-content: space-between;
    inset-inline-end: 15mm;
    inset-inline-start: 15mm;
    height: 85mm;
    font-weight: 600;
    font-size: 95mm;
    line-height: 85mm;

    .kana {
      display: grid;
      place-items: center;
      /* background-color: rgba(0, 0, 255, 0.1); */
      width: 42mm;
      font-weight: 900;
      font-size: 45mm;
      font-family: "Noto Serif JP", serif;
      font-optical-sizing: auto;

      span {
        position: relative;
        /* inset-inline-start: -4mm; */
        inset-block-start: -2mm;
      }
    }

    .serial {
      display: flex;
      gap: 7.5mm;
      /* background-color: rgba(0, 255, 0, 0.1); */
      height: 80mm;
      font-family: "TrmFontJB";
      letter-spacing: 3mm;

      .number {
        display: grid;
        place-items: center;
        /* background-color: rgba(255, 128, 0, 0.15); */
        width: 47mm;

        &:not(.dot) span {
          position: relative;
          top: 4mm;
          left: -4mm;
        }

        &.dot {
          span {
            display: block;
            border-radius: 100%;
            background-color: currentColor;
            width: 14mm;
            height: 14mm;
          }
        }
      }

      .separator {
        display: grid;
        place-items: center;
        /* background-color: rgba(255, 0, 128, 0.15); */
        width: 25mm;

        span {
          border-radius: 2mm;
          background-color: currentColor;
          width: 20mm;
          height: 12mm;
        }
      }
    }
  }
}
</style>
