<script setup>
import { computed } from "vue";
import offices from "../data/offices.json";
import kanaData from "../data/kana.json";
import Screw from "./Screw.vue";
import Seal from "./Seal.vue";
import SerialFont from "./SerialFont.vue";
import ClassificationFont from "./ClassificationFont.vue";

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
  showSeal: {
    type: Boolean,
    default: false,
  },
  showScrews: {
    type: Boolean,
    default: false,
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

const isSpecialKana = computed(() =>
  kanaData.special.find((k) => k === props.kana),
);

const computedKana = computed(() => {
  const flatKana = [
    ...kanaData.private,
    ...kanaData.commercial,
    ...kanaData.special,
  ];

  return flatKana.find(
    (k) => k.transliteration === props.kana || k === props.kana,
  );
});
</script>

<template>
  <div class="plateContainer">
    <div class="licencePlate" :class="color">
      <div class="ridge"><div></div></div>
      <div class="screws">
        <div>
          <Seal v-if="showSeal" :office="office" />
          <Screw v-else-if="showScrews" style="--rotation: 30deg" />
          <div v-else class="hole"></div>
        </div>
        <div>
          <Screw v-if="showScrews" />
          <div v-else class="hole"></div>
        </div>
      </div>
      <div class="topRow emboss">
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
          <ClassificationFont
            v-if="classification.length >= 1"
            :modelValue="classification?.[0]"
          />
          <ClassificationFont
            v-if="classification.length >= 2"
            :modelValue="classification?.[1]"
          />
          <ClassificationFont
            v-if="classification.length >= 3"
            :modelValue="classification?.[2]"
          />
        </p>
      </div>
      <div class="bottomRow emboss">
        <p class="kana" :class="{ special: isSpecialKana }">
          <span>{{ computedKana.kana ?? computedKana }}</span>
        </p>
        <div class="serial">
          <div class="number" :class="{ dot: serial.length < 4 }">
            <SerialFont :modelValue="serial?.[serial.length - 4]" />
          </div>
          <div class="number" :class="{ dot: serial.length < 3 }">
            <SerialFont :modelValue="serial?.[serial.length - 3]" />
          </div>
          <div
            class="separator"
            :style="{ opacity: showSerialSeparator ? 1 : 0 }"
          >
            <span></span>
          </div>
          <div class="number" :class="{ dot: serial.length < 2 }">
            <SerialFont :modelValue="serial?.[serial.length - 2]" />
          </div>
          <div class="number" :class="{ dot: serial.length < 1 }">
            <SerialFont :modelValue="serial?.[serial.length - 1]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.plateContainer {
  --cmm: calc(1cqw / 3.3);
  filter: drop-shadow(5px 5px 25px rgba(0, 0, 0, 0.1))
    drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.25));
  container-type: inline-size;
  aspect-ratio: 2;
  width: 100%;
  max-width: 150cqh;
  min-height: 0;
}

.licencePlate {
  position: relative;
  border-radius: calc(10 * var(--cmm));
  background-color: var(--plate-background);
  height: 100%;
  overflow: hidden;
  color: var(--plate-foreground);
  user-select: none;

  &.private {
    --plate-background: #d7d8d5;
    --plate-foreground: #194a17;
    --shadow-light: #fff;
    --shadow-dark: #aaa;
  }

  &.kei {
    --plate-background: #f1c209;
    --plate-foreground: #000;
    --shadow-light: #fee685;
    --shadow-dark: #d08700;
  }

  &.commercial {
    --plate-background: #194a17;
    --plate-foreground: #d7d8d5;
    --shadow-light: #4e7245;
    --shadow-dark: #0d331a;
  }

  &.commercial-kei {
    --plate-background: #111;
    --plate-foreground: #f1c209;
    --shadow-light: #444;
    --shadow-dark: #000;
  }

  .ridge {
    position: absolute;
    transform: translate3d(0, 0, 0);
    inset: calc(2 * var(--cmm));
    box-shadow:
      calc(-0.5 * var(--cmm)) calc(-0.5 * var(--cmm)) calc(1 * var(--cmm))
        var(--shadow-light),
      inset calc(1 * var(--cmm)) calc(1 * var(--cmm)) calc(2 * var(--cmm))
        var(--shadow-light),
      calc(0.5 * var(--cmm)) calc(0.5 * var(--cmm)) calc(1 * var(--cmm))
        var(--shadow-dark),
      inset calc(-1 * var(--cmm)) calc(-1 * var(--cmm)) calc(2 * var(--cmm))
        var(--shadow-dark);
    border-radius: calc(8 * var(--cmm));

    > div {
      position: absolute;
      inset: calc(4 * var(--cmm));
      box-shadow:
        calc(1 * var(--cmm)) calc(1 * var(--cmm)) calc(2 * var(--cmm))
          var(--shadow-light),
        calc(-1 * var(--cmm)) calc(-1 * var(--cmm)) calc(2 * var(--cmm))
          var(--shadow-dark),
        inset calc(0.5 * var(--cmm)) calc(0.5 * var(--cmm)) calc(1 * var(--cmm))
          var(--shadow-dark),
        inset calc(-0.5 * var(--cmm)) calc(-0.5 * var(--cmm))
          calc(1 * var(--cmm)) var(--shadow-light);
      border-radius: calc(4 * var(--cmm));
    }
  }

  .emboss {
    filter: drop-shadow(
        calc(-0.5 * var(--cmm)) calc(-0.5 * var(--cmm)) calc(1 * var(--cmm))
          var(--shadow-light)
      )
      drop-shadow(
        calc(0.5 * var(--cmm)) calc(0.5 * var(--cmm)) calc(0.25 * var(--cmm))
          var(--plate-background)
      )
      drop-shadow(
        calc(1 * var(--cmm)) calc(1 * var(--cmm)) calc(1 * var(--cmm))
          color-mix(in srgb, var(--shadow-dark), transparent 50%)
      );
  }

  .reference {
    position: absolute;
    opacity: 0.25;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .screws {
    display: flex;
    position: relative;
    top: calc(25 * var(--cmm));
    justify-content: space-between;
    align-items: center;
    z-index: 1;
    margin: auto;
    width: calc(210 * var(--cmm));

    > * {
      display: grid;
      position: relative;
      place-items: center;

      > * {
        position: absolute;
        border-radius: 100%;
      }

      .hole {
        background-color: black;
        width: calc(8 * var(--cmm));
        height: calc(8 * var(--cmm));
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
    top: calc(15 * var(--cmm));
    left: calc(2.5 * var(--cmm));
    justify-content: space-evenly;
    width: calc(190 * var(--cmm));
    height: calc(40 * var(--cmm));
    white-space: nowrap;

    .office {
      position: relative;
      top: calc(-2 * var(--cmm));
      font-weight: 500;
      font-size: calc(48 * var(--cmm));
      font-family: "Kiwi Maru", serif;
      letter-spacing: calc(-3 * var(--cmm));

      &.three {
        transform: scaleY(1.35);
        font-size: calc(34 * var(--cmm));
        letter-spacing: normal;
      }

      &.four {
        transform: scaleY(1.75);
        font-weight: 500;
        font-size: calc(26 * var(--cmm));
        letter-spacing: normal;
      }
    }

    .classification {
      display: flex;
      position: relative;
      gap: calc(2 * var(--cmm));

      & > * {
        fill: currentColor;
        width: calc(25 * var(--cmm));
        height: calc(40 * var(--cmm));
      }

      &.wide {
        & > * {
          width: calc(25 * 1.35 * var(--cmm));
        }
      }
    }
  }

  .bottomRow {
    display: flex;
    position: absolute;
    bottom: calc(15 * var(--cmm));
    justify-content: space-between;
    inset-inline-end: calc(15 * var(--cmm));
    inset-inline-start: calc(20 * var(--cmm));

    .kana {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: calc(42 * var(--cmm));
      font-weight: 700;
      font-size: calc(45 * var(--cmm));
      font-family: "BIZ UDPMincho", serif;
      font-optical-sizing: auto;

      &.special {
        transform: scaleY(1);
        font-weight: 600;
        font-size: calc(60 * var(--cmm));
        font-family: "Lexend Giga", serif;
      }

      span {
        position: relative;
        inset-block-start: calc(-2 * var(--cmm));
      }
    }

    .serial {
      display: flex;
      gap: calc(5 * var(--cmm));
      height: calc(80 * var(--cmm));

      .number {
        display: grid;
        place-items: center;
        width: calc(50 * var(--cmm));

        svg {
          fill: currentColor;
        }

        &.dot {
          svg {
            display: none;
          }

          &::after {
            display: block;
            border-radius: 100%;
            background-color: currentColor;
            width: calc(14 * var(--cmm));
            height: calc(14 * var(--cmm));
            content: "";
          }
        }
      }

      .separator {
        display: grid;
        place-items: center;
        width: calc(25 * var(--cmm));

        span {
          border-radius: calc(2 * var(--cmm));
          background-color: currentColor;
          width: calc(20 * var(--cmm));
          height: calc(12 * var(--cmm));
        }
      }
    }
  }
}
</style>
