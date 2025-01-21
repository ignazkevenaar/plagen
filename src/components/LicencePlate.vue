<script setup></script>

<template>
  <div class="licencePlate">
    <!-- <img src="/img/reference1.png" alt="plate reference" class="reference" /> -->
    <!-- <img src="/img/reference2.png" alt="plate reference" class="reference" /> -->
    <img src="/img/reference3.png" alt="plate reference" class="reference" />
    <div class="screws">
      <div>
        <div class="seal"></div>
      </div>
      <div>
        <div></div>
      </div>
    </div>
    <div class="topRow">
      <p>品川</p>
      <p class="wide">33</p>
    </div>
    <div class="bottomRow" style="display: none">
      <p class="kana">ぬ</p>
      <p class="serial">
        <span>46</span>
        <span class="separator">-</span>
        <span>29</span>
      </p>
    </div>
    <div class="bottomRow">
      <p class="kana">ぬ</p>
      <p class="serial">
        <span>..</span>
        <span class="separator" style="opacity: 0">-</span>
        <span>.1</span>
      </p>
    </div>
  </div>
</template>

<style lang="css" scoped>
.licencePlate {
  width: 330mm;
  height: 165mm;
  aspect-ratio: 2;
  background-color: beige;
  border-radius: 10mm;
  border: 2px solid rgba(0 0 0 / 20%);
  position: relative;
  color: #23522f;

  .reference {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.25;
  }

  .screws {
    background-color: blue;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 210mm;
    top: 25mm;
    margin: auto;
    z-index: 1;

    > * {
      position: relative;
      display: grid;
      place-items: center;

      > * {
        position: absolute;
        width: 8mm;
        height: 8mm;
        background-color: grey;
        border-radius: 100%;

        &.seal {
          width: 10mm;
          height: 10mm;
        }
      }
    }
  }

  .topRow,
  .bottomRow {
    margin: auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .topRow {
    width: 180mm;
    height: 44mm;
    top: 13mm;
    left: 2.5mm;
    font-size: 44mm;
    font-weight: 600;
    gap: 2mm;
    line-height: 0;
    margin-top: -4mm;

    .wide {
      font-size: 1.3em;
      font-weight: 600;
    }
  }

  .bottomRow {
    position: absolute;
    bottom: 9mm;
    inset-inline: 20mm;

    font-size: 95mm;
    font-weight: 600;
    line-height: 0;
    height: 85mm;
    display: flex;
    justify-content: space-between;

    --shadow-offset: 10px;

    filter: calc(
      drop-shadow(var(--shadow-offset) 0 red)
        drop-shadow((-1 * var(--shadow-offset)) 0 red)
        drop-shadow(0 var(--shadow-offset) red)
        drop-shadow(0 (-1 * var(--shadow-offset)) red)
        drop-shadow(var(--shadow-offset) var(--shadow-offset) red)
        drop-shadow((-1 * var(--shadow-offset)) (-1 * var(--shadow-offset)) red)
        drop-shadow((-1 * var(--shadow-offset)) var(--shadow-offset) red)
        drop-shadow(var(--shadow-offset) (-1 * var(--shadow-offset)) red)
    );

    .kana {
      font-size: 50mm;
      font-weight: 600;
      background-color: rgba(0, 0, 255, 0.1);
      width: 8cm;
      height: 100%;
      line-height: 100%;
    }

    .serial {
      font-family: "TrmFontJB";
      width: 22cm;
      background-color: rgba(255, 0, 0, 0.1);
      height: 100%;
      line-height: 100%;
      letter-spacing: 3mm;

      .separator {
        font-size: 1.2em;
        line-height: 0;
        position: relative;
        left: 2mm;
        top: 4mm;
      }
    }
  }
}
</style>
