<script setup>
import { computed } from "vue";
import offices from "../data/offices.json";
import kanaData from "../data/kana.json";

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

const isSpecialKana = computed(
  () => kanaData.special.find((k) => k === props.kana) !== undefined,
);
</script>

<template>
  <div class="plateContainer">
    <div class="licencePlate" :class="color">
      <div class="ridge"><div></div></div>
      <div class="screws">
        <div>
          <div v-if="showSeal" class="seal">
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
          <div v-else><!-- Screw --></div>
        </div>
        <div>
          <div><!-- Screw --></div>
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
        <p class="kana" :class="{ special: isSpecialKana }">
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
  </div>
</template>

<style lang="css" scoped>
.plateContainer {
  --cmm: calc(1cqw / 3.3);
  container-type: inline-size;
  box-shadow: calc(5 * var(--cmm)) calc(10 * var(--cmm)) calc(25 * var(--cmm))
    black;
  border-radius: calc(10 * var(--cmm));
  aspect-ratio: 2;
  width: 100%;
}

.licencePlate {
  position: relative;
  border: 2px solid rgba(0 0 0 / 20%);
  border-radius: calc(10 * var(--cmm));
  background-color: var(--plate-background);
  height: 100%;
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
    inset: calc(2 * var(--cmm));
    box-shadow:
      inset calc(1 * var(--cmm)) calc(1 * var(--cmm)) calc(2 * var(--cmm))
        rgba(255, 255, 255, 0.5),
      inset calc(-1 * var(--cmm)) calc(-1 * var(--cmm)) calc(2 * var(--cmm))
        rgba(0, 0, 0, 0.25),
      calc(1 * var(--cmm)) calc(1 * var(--cmm)) calc(1 * var(--cmm))
        rgba(0, 0, 0, 0.2),
      calc(-1 * var(--cmm)) calc(-1 * var(--cmm)) calc(1 * var(--cmm))
        rgba(255, 255, 255, 0.5);
    border-radius: calc(7 * var(--cmm));
    background-color: var(--plate-background);

    > div {
      position: absolute;
      inset: calc(4 * var(--cmm));
      box-shadow:
        calc(1 * var(--cmm)) calc(1 * var(--cmm)) calc(2 * var(--cmm))
          rgba(255, 255, 255, 0.5),
        calc(-1 * var(--cmm)) calc(-1 * var(--cmm)) calc(2 * var(--cmm))
          rgba(0, 0, 0, 0.1),
        inset calc(1 * var(--cmm)) calc(1 * var(--cmm)) calc(1 * var(--cmm))
          rgba(0, 0, 0, 0.1),
        inset calc(-1 * var(--cmm)) calc(-1 * var(--cmm)) calc(1 * var(--cmm))
          rgba(255, 255, 255, 0.5);
      border-radius: calc(3 * var(--cmm));
      background-color: var(--plate-background);
    }
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
        background-color: black;
        width: calc(8 * var(--cmm));
        height: calc(8 * var(--cmm));
      }

      .seal {
        display: grid;
        place-items: center;
        box-shadow:
          inset calc(-1 * var(--cmm)) calc(-1 * var(--cmm)) calc(3 * var(--cmm))
            rgba(0, 0, 0, 0.4),
          calc(2 * var(--cmm)) calc(2 * var(--cmm)) calc(4 * var(--cmm))
            rgba(0, 0, 0, 0.2),
          inset 0 0 calc(1 * var(--cmm)) calc(1 * var(--cmm)) rgba(0, 0, 0, 0.4),
          inset calc(-1 * var(--cmm)) calc(-1 * var(--cmm)) calc(2 * var(--cmm))
            calc(1 * var(--cmm)) rgba(0, 0, 0, 0.25),
          inset calc(1 * var(--cmm)) calc(1 * var(--cmm)) calc(1 * var(--cmm))
            calc(2 * var(--cmm)) white;
        background-image: conic-gradient(
          from 320deg at 50% 50%,
          #ffffffff 3%,
          #a4a4a4ff 35%,
          #fafafaff 52%,
          #5f5f5fff 87%,
          #ffffffff 100%
        );
        background-color: grey;
        width: calc(28 * var(--cmm));
        height: calc(28 * var(--cmm));
        font-weight: 400;
        font-family: "M PLUS Rounded 1c", serif;

        > div {
          display: grid;
          position: relative;
          place-items: center;
          box-shadow:
            calc(0.25 * var(--cmm)) calc(0.25 * var(--cmm))
              calc(0.5 * var(--cmm)) calc(0.25 * var(--cmm)) rgba(0, 0, 0, 0.75),
            calc(1 * var(--cmm)) calc(1 * var(--cmm)) calc(1 * var(--cmm))
              rgba(255, 255, 255, 0.6),
            calc(-0.5 * var(--cmm)) calc(-0.5 * var(--cmm)) calc(1 * var(--cmm))
              rgba(0, 0, 0, 0.75),
            inset calc(0.25 * var(--cmm)) calc(0.25 * var(--cmm))
              calc(0.25 * var(--cmm)) white,
            inset calc(-0.25 * var(--cmm)) calc(-0.25 * var(--cmm))
              calc(1 * var(--cmm)) rgba(0, 0, 0, 1);
          border-radius: 100%;
          background-image: conic-gradient(
            from 320deg at 50% 50%,
            #ffffffff 3%,
            #a4a4a4ff 35%,
            #fafafaff 52%,
            grey 87%,
            #ffffffff 100%
          );
          background-color: silver;
          width: calc(21 * var(--cmm));
          height: calc(21 * var(--cmm));

          &::before {
            display: block;
            position: absolute;
            inset: calc(2 * var(--cmm));
            box-shadow:
              calc(-0.25 * var(--cmm)) calc(-0.25 * var(--cmm))
                calc(0.25 * var(--cmm)) rgba(0, 0, 0, 0.25),
              inset calc(0.25 * var(--cmm)) calc(0.25 * var(--cmm))
                calc(0.25 * var(--cmm)) white,
              inset calc(-0.25 * var(--cmm)) calc(-0.25 * var(--cmm))
                calc(0.25 * var(--cmm)) rgba(0, 0, 0, 0.25);
            border-radius: 100%;
            content: "";
          }

          span {
            position: relative;
            top: calc(-0.25 * var(--cmm));
            color: silver;
            font-size: calc(12 * var(--cmm));
            line-height: 0;
            text-shadow:
              calc(0.25 * var(--cmm)) calc(0.25 * var(--cmm))
                calc(0.25 * var(--cmm)) white,
              calc(-0.2 * var(--cmm)) calc(-0.2 * var(--cmm))
                calc(0.5 * var(--cmm)) black;

            &.small {
              span {
                display: block;
                transform: scaleY(0.8);
                font-size: calc(8 * var(--cmm));
                line-height: calc(7 * var(--cmm));
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
    top: calc(13.5 * var(--cmm));
    left: calc(2.5 * var(--cmm));
    justify-content: space-evenly;
    width: calc(190 * var(--cmm));
    height: calc(40 * var(--cmm));
    white-space: nowrap;

    .office {
      transform-origin: center left;
      filter: url("#drop-shadow");
      font-weight: 500;
      font-size: calc(48 * var(--cmm));
      font-family: "M PLUS Rounded 1c", serif;
      letter-spacing: calc(-4 * var(--cmm));

      &.three {
        transform: scaleY(1.5);
        font-size: calc(30 * var(--cmm));
        letter-spacing: normal;
      }

      &.four {
        transform: scaleY(2);
        font-weight: 600;
        font-size: calc(23 * var(--cmm));
        letter-spacing: normal;
      }
    }

    .classification {
      position: relative;
      top: calc(4 * var(--cmm));
      font-size: calc(49 * var(--cmm));
      font-family: "TrmFontJB";
      letter-spacing: calc(-1 * var(--cmm));

      &.wide {
        transform: scaleY(0.75);
        font-size: calc(65 * var(--cmm));
      }
    }
  }

  .bottomRow {
    display: flex;
    position: absolute;
    bottom: calc(12 * var(--cmm));
    justify-content: space-between;
    inset-inline-end: calc(15 * var(--cmm));
    inset-inline-start: calc(20 * var(--cmm));
    height: calc(85 * var(--cmm));
    font-weight: 600;
    font-size: calc(95 * var(--cmm));
    line-height: calc(85 * var(--cmm));

    .kana {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: calc(42 * var(--cmm));
      font-weight: 900;
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
      gap: calc(7.5 * var(--cmm));
      height: calc(80 * var(--cmm));
      font-family: "TrmFontJB";
      letter-spacing: calc(3 * var(--cmm));

      .number {
        display: grid;
        place-items: center;
        width: calc(47 * var(--cmm));

        &:not(.dot) span {
          position: relative;
          top: calc(4 * var(--cmm));
          left: calc(-4 * var(--cmm));
        }

        &.dot {
          span {
            display: block;
            border-radius: 100%;
            background-color: currentColor;
            width: calc(14 * var(--cmm));
            height: calc(14 * var(--cmm));
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
