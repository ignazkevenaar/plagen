<script setup>
import { computed } from "vue";
import { useLocations } from "../composables/locations";

const props = defineProps({
  location: String,
});

const { currentSealCharacters } = useLocations(() => props.location);
</script>

<template>
  <div class="seal">
    <div class="innerSeal">
      <svg class="sealText" :class="{ small: currentSealCharacters.length > 1 }">
        <text
          v-for="(c, i) in currentSealCharacters"
          :key="c"
          x="50%"
          :y="`${(i + 0.5) / currentSealCharacters.length * 100}%`"
          text-anchor="middle"
        >{{ c }}</text>
      </svg>
    </div>
  </div>
</template>

<style lang="css" scoped>
.seal {
  display: grid;
  place-items: center;
  box-shadow:
    inset calc(-1 * var(--cmm)) calc(-1 * var(--cmm)) calc(3 * var(--cmm))
      color-mix(in srgb, var(--shadow-dark), black 50%),
    calc(2 * var(--cmm)) calc(2 * var(--cmm)) calc(2 * var(--cmm))
      color-mix(in srgb, var(--shadow-dark), transparent 50%),
    inset 0 0 calc(1 * var(--cmm)) calc(1 * var(--cmm)) rgba(0, 0, 0, 0.4),
    inset calc(-1 * var(--cmm)) calc(-1 * var(--cmm)) calc(2 * var(--cmm))
      calc(1 * var(--cmm)) rgba(0, 0, 0, 0.25),
    inset calc(1 * var(--cmm)) calc(1 * var(--cmm)) calc(1 * var(--cmm))
      calc(2 * var(--cmm)) white;
  background-image: conic-gradient(
    from -40deg,
    #ffffff 3%,
    #a4a4a4 35%,
    #fafafa 52%,
    #5f5f5f 87%,
    #ffffff 100%
  );
  background-color: grey;
  width: calc(28 * var(--cmm));
  height: calc(28 * var(--cmm));
  font-weight: 400;
  font-family: "Kiwi Maru", serif;

  .innerSeal {
    display: grid;
    position: relative;
    place-items: center;
    box-shadow:
      calc(0.25 * var(--cmm)) calc(0.25 * var(--cmm)) calc(0.5 * var(--cmm))
        calc(0.25 * var(--cmm)) rgba(0, 0, 0, 0.75),
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
      from -40deg,
      #ffffff 3%,
      #a4a4a4 35%,
      #fafafa 52%,
      #777 87%,
      #ffffff 100%
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

    .sealText {
      width: calc(21 * var(--cmm));
      height: calc(21 * var(--cmm));
      overflow: visible;
      fill: silver;
      filter: drop-shadow(
          calc(0.2 * var(--cmm)) calc(0.2 * var(--cmm)) calc(0.1 * var(--cmm))
            rgba(255, 255, 255, 0.75)
        )
        drop-shadow(
          calc(-0.1 * var(--cmm)) calc(-0.1 * var(--cmm)) calc(0.1 * var(--cmm))
            rgba(0, 0, 0, 0.5)
        );
      font-size: calc(12 * var(--cmm));
      font-family: "Kiwi Maru", serif;
      font-weight: 400;
      position: relative;
      top: calc(4 * var(--cmm));

      &.small {
        font-size: calc(10 * var(--cmm));

        text {
          transform-box: fill-box;
          transform-origin: center;
          transform: scaleY(0.6);
        }
      }
    }
  }
}
</style>
