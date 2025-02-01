<template>
  <div class="screw">
    <div class="hex">
      <div class="head">
        <div class="innerHead">
          <div class="philips">
            <div class="innerPhilips">
              <div class="bottomPhilips"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.screw {
  --rotation: 0deg;

  display: grid;
  place-items: center;
  box-shadow:
    0 0 calc(0.5 * var(--cmm)) calc(0.25 * var(--cmm)) var(--shadow-dark),
    calc(1.5 * var(--cmm)) calc(1.5 * var(--cmm)) calc(1 * var(--cmm))
      var(--shadow-dark),
    inset calc(0.5 * var(--cmm)) calc(0.5 * var(--cmm)) calc(0.5 * var(--cmm))
      rgba(255, 255, 255, 0.5),
    inset calc(-0.5 * var(--cmm)) calc(-0.5 * var(--cmm))
      calc(0.25 * var(--cmm)) rgba(0, 0, 0, 0.25);
  background: conic-gradient(
    from calc(-45deg),
    white,
    #777,
    #777,
    #555,
    #aaa,
    #777,
    white
  );
  width: calc(13 * var(--cmm));
  height: calc(13 * var(--cmm));

  .hex {
    display: grid;
    place-items: center;
    transform: rotate(var(--rotation));
    clip-path: polygon(50% -50%, 100% 50%, 50% 150%, 0 50%);
    border-radius: 0;
    background: conic-gradient(
      from calc(-1 * (var(--rotation) - mod(var(--rotation), 60deg))),
      #777,
      #ccc,
      #777,
      #ccc,
      black,
      #777,
      black,
      #ccc,
      #777,
      #ccc,
      #777,
      white,
      #777
    );
    aspect-ratio: 1 / cos(30deg);
    height: calc(10 * var(--cmm));

    .head,
    .innerHead {
      display: grid;
      place-items: center;
      border-radius: 100%;
      background: conic-gradient(
        from calc(-45deg),
        white,
        #777,
        #777,
        white,
        #aaa,
        #777,
        white
      );
      width: calc(9.5 * var(--cmm));
      height: calc(9.5 * var(--cmm));
    }

    .innerHead {
      transform: rotate(calc(-1 * var(--rotation)));
      box-shadow:
        inset calc(0.5 * var(--cmm)) calc(0.25 * var(--cmm))
          calc(0.25 * var(--cmm)) rgba(0, 0, 0, 0.5),
        inset calc(-0.5 * var(--cmm)) calc(-0.25 * var(--cmm))
          calc(0.25 * var(--cmm)) rgba(255, 255, 255, 0.5);
      background: linear-gradient(to bottom right, #777, #bbb);
      width: calc(8 * var(--cmm));
      height: calc(8 * var(--cmm));
    }

    .philips {
      display: grid;
      place-items: center;
      transform: rotate(var(--rotation));
      filter: drop-shadow(
          calc(0.25 * var(--cmm)) calc(0.25 * var(--cmm)) 0
            rgba(255, 255, 255, 0.5)
        )
        drop-shadow(
          calc(-0.25 * var(--cmm)) calc(-0.25 * var(--cmm)) 0
            rgba(0, 0, 0, 0.25)
        );
    }

    .innerPhilips {
      display: grid;
      place-items: center;
      clip-path: polygon(
        37.5% 0%,
        37.5% 20.145%,
        32.55% 32.094%,
        32.094% 32.55%,
        20.145% 37.5%,
        0% 37.5%,
        0% 62.5%,
        20.145% 62.5%,
        32.094% 67.45%,
        32.55% 67.906%,
        37.5% 79.855%,
        37.5% 100%,
        62.5% 100%,
        62.5% 79.855%,
        67.45% 67.906%,
        67.906% 67.45%,
        79.855% 62.5%,
        100% 62.5%,
        100% 37.5%,
        79.855% 37.5%,
        67.906% 32.55%,
        67.45% 32.094%,
        62.5% 20.145%,
        62.5% 0%
      );

      background: conic-gradient(
        #555,
        #111,
        #999,
        #999,
        #111,
        #555,
        #777,
        #999,
        #999,
        #333,
        #aaa,
        #333,
        #999,
        #999,
        #777,
        #555,
        #111,
        #999,
        #999,
        #111,
        #555
      );
      width: calc(6.2 * var(--cmm));
      height: calc(6.2 * var(--cmm));
    }

    .bottomPhilips {
      clip-path: polygon(
        40% 0%,
        60% 0%,
        70% 30%,
        100% 40%,
        100% 60%,
        70% 70%,
        60% 100%,
        40% 100%,
        30% 70%,
        0% 60%,
        0% 40%,
        30% 30%
      );
      filter: drop-shadow(
          calc(0.25 * var(--cmm)) calc(0.25 * var(--cmm)) 0
            rgba(255, 255, 255, 0.5)
        )
        drop-shadow(
          calc(-0.25 * var(--cmm)) calc(-0.25 * var(--cmm)) 0
            rgba(0, 0, 0, 0.25)
        );
      background: conic-gradient(
        #333,
        gray,
        #aaa,
        #777,
        black,
        gray,
        #ddd,
        gray,
        #777,
        black,
        gray,
        #333
      );
      width: calc(3.5 * var(--cmm));
      height: calc(3.5 * var(--cmm));
    }
  }
}
</style>
