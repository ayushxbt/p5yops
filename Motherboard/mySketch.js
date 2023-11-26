/*
=======================================================================
Motherboard
=======================================================================
Description:
Experience the essence of technology through the "Motherboard Art" code. 
This dynamic visualization transforms the screen into a virtual motherboard, 
showcasing the intricate dance of pixels that mirrors the flow of data 
within a computer system. The constantly evolving patterns offer a mesmerizing 
glimpse into the beauty of digital processes, turning code into a captivating 
exploration of form and function.
=======================================================================
Specifications:
- Language: JavaScript (p5.js)
- Version: 1.0.0
- Author: 0xMilord
- Website: https://linktr.ee/0xmilord/
- GitHub: https://github.com/0xmilord/
=======================================================================
License:
This artwork is licensed under the Attribution
-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0).
For details, see the full license text at: 
https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode

Scope of License:
You are free to:
- Share: Copy and redistribute the material in any medium or format.
- Adapt: Remix, transform, and build upon the material.
=======================================================================
*/

const PIXEL_SIZE = 4; // RGBA has four components so its size is 4
const INIT_PIXEL_COUNT = 3;
const ACTIVE_PIXEL_COUNT = 200;
const ACTIVE_PIXEL_REFILL_DELAY = 10000;
const ACTIVE_PIXEL_REFILL_EVERY_N_FRAME = 1;
const FRAME_RATE = 60;
const MAX_DRAWS_PER_FRAME = 300;
const CLEAR_ON_RESET = true;

let hueOffset = 35;
let hueStepSize = 280;
let hueStepCount = 2;

let maxTurns, minTurns;

let fcount = 0;
let pixelDirectionOffsets = [];
let activePixels = [];
let occupiedPixels = [];
let freePixels = [];

function setup() {
  const canvasSize = max(windowWidth, windowHeight); // Change min to max
  createCanvas(canvasSize, canvasSize);
  pixelDensity(1);
  frameRate(FRAME_RATE);
  colorMode(HSB, 360, 100, 100, 100);

  minTurns = floor(canvasSize / 10);
  maxTurns = floor(canvasSize / 5);

  pixelDirectionOffsets = [
    -canvasSize, // up
    -canvasSize + 1, // up right
    1, // right
    canvasSize + 1, // down right
    canvasSize, // down
    canvasSize - 1, // down left
    -1, // left
    -canvasSize - 1, // up left
  ];

  background(0);
  loadPixels();
  resetScene();
}

function resetScene() {
  fcount = 0;
  activePixels = [];
  occupiedPixels = new Array(width * height).fill(false);
  freePixels = new Array(width * height).fill().map((i) => i);

  for (let t = INIT_PIXEL_COUNT; t--; ) {
    drawStartPixel(t, true);
  }

  for (let x = 0; x < width; x++) {
    occupiedPixels[getIndex(x, 0)] = true;
    occupiedPixels[getIndex(x, height - 1)] = true;
  }
  for (let y = 0; y < height; y++) {
    occupiedPixels[getIndex(0, y)] = true;
    occupiedPixels[getIndex(width - 1, y)] = true;
  }
}

function draw() {
  const startTime = Date.now();
  let drawCount = 0;

  while (
    drawCount++ < MAX_DRAWS_PER_FRAME &&
    Date.now() - startTime < (1 / frameRate()) * 1000
  ) {
    fcount++;
    let nextActivePixels = [];

    for (let ai = 0; ai < activePixels.length; ai++) {
      const activePixel = activePixels[ai];
      if (activePixel.life < 1) continue;
      const dir = activePixel.dir;
      const i = activePixel.index;

      for (let d = 0; d < pixelDirectionOffsets.length; d++) {
        let newDir = dir + d * activePixel.winding;
        if (newDir < 0) {
          newDir += pixelDirectionOffsets.length;
        }
        const j = getNeighbourIndex(i, newDir);
        if (!occupiedPixels[j]) {
          nextActivePixels.push(
            new ActivePixel(
              j,
              newDir,
              activePixel.winding,
              dir !== newDir ? activePixel.life - 1 : activePixel.life
            )
          );
          occupiedPixels[j] = true;
          copyPixel(toPixelIndex(i), toPixelIndex(j), pixels);
          break;
        }
      }
    }
    activePixels = nextActivePixels;

    if (fcount % 300 === 0) {
      updateFreePixels();
    }

    if (
      fcount > ACTIVE_PIXEL_REFILL_DELAY &&
      activePixels.length < ACTIVE_PIXEL_COUNT &&
      fcount % ACTIVE_PIXEL_REFILL_EVERY_N_FRAME === 0
    ) {
      drawStartPixel();
    }
  }

  updatePixels();

  if (freePixels.length === 0) {
    console.log("Finished! Click to redraw.");
    noLoop();
  }
}

function mouseClicked() {
  hueOffset = floor(random(360));
  hueStepSize = floor(random(180));
  hueStepCount = floor(random(2, 5));

  if (CLEAR_ON_RESET) {
    background(0);
    loadPixels();
  }

  resetScene();
  loop();
}

function updateFreePixels() {
  let newFreePixels = [];
  occupiedPixels.forEach((occupied, i) => {
    if (!occupied) {
      newFreePixels.push(i);
    }
  });
  freePixels = newFreePixels;
}

function drawStartPixel(t = 0, initial = false) {
  let huu = (floor(random(hueStepCount)) * hueStepSize + hueOffset) % 360;
  let sat = random(50, 70);
  let bri = constrain(random(1) ** 2 * 110, 10, 100);

  let x, y, index;
  if (initial) {
    x = floor(
      random(1) * (random(1) > 0.5 ? -1 : 1) * (width / 2 - 1) + width / 2
    );
    y = floor(
      random(1) * (random(1) > 0.5 ? -1 : 1) * (height / 2 - 1) + height / 2
    );
    index = getIndex(x, y);
  } else {
    index = freePixels[floor(random(freePixels.length))];
    y = floor(index / width);
    x = index % width;
  }

  if (!occupiedPixels[index]) {
    const colr = color(huu, sat, bri);

    putPixel(
      pixels,
      toPixelIndex(index),
      colr.levels[0],
      colr.levels[1],
      colr.levels[2],
      colr.levels[3]
    );
    const dir = floor(random(pixelDirectionOffsets.length));
    activePixels.push(new ActivePixel(index, dir));
    occupiedPixels[index] = true;
  }
}

function copyPixel(from, to, _pixels) {
  _pixels[to] = _pixels[from];
  _pixels[to + 1] = _pixels[from + 1];
  _pixels[to + 2] = _pixels[from + 2];
  _pixels[to + 3] = _pixels[from + 3];
}

function putPixel(_pixels, toIndex, r = 255, g = 255, b = 255, a = 255) {
  _pixels[toIndex] = r;
  _pixels[toIndex + 1] = g;
  _pixels[toIndex + 2] = b;
  _pixels[toIndex + 3] = a;
}

function getIndex(x, y) {
  return x + width * y;
}

function getNeighbourIndex(i, dir) {
  const _dir =
    dir < pixelDirectionOffsets.length
      ? dir
      : dir % pixelDirectionOffsets.length;
  return i + pixelDirectionOffsets[_dir];
}

function toLookupIndex(i) {
  return (i / PIXEL_SIZE) | 0;
}

function toPixelIndex(i) {
  return i * PIXEL_SIZE;
}

class ActivePixel {
  constructor(index, dir, winding, life) {
    this.index = index;
    this.dir = dir;
    this.color = color;
    this.winding = winding === undefined ? (random(1) > 0.5 ? -1 : 1) : winding;
    this.life = life === undefined ? floor(random(minTurns, maxTurns)) : life;
  }
}
