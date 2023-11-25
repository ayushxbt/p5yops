/*
=======================================================================
Not Fidenza
=======================================================================
Description:
This mesmerizing generative art sketch is an exploration of dynamic and
unpredictable visual patterns. The drawing is brought to life through
the interplay of Perlin noise and collision detection algorithms, creating
an ever-evolving canvas of captivating trails.

The Perlin noise-based movement imbues the artwork with organic and
fluid motions, resulting in a harmonious dance of shapes and colors. Each
element in the composition is influenced by a carefully calculated blend
of randomness and continuity, offering viewers a unique and immersive
visual experience.

The deliberate decision to slow down the drawing's movement by 30% adds
an extra layer of contemplation, allowing observers to engage more deeply
with the intricate details of the evolving patterns. The intentional
pacing transforms the sketch into a contemplative journey, encouraging
viewers to appreciate the beauty of each moment as it unfolds.

Whether observed as a digital art piece or experienced in real-time,
this sketch invites individuals to explore the beauty that arises from
the convergence of algorithmic precision and artistic intuition. It
serves as a testament to the creative possibilities that emerge when
technology and art seamlessly come together.
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

let trails = [];
let currentPath = [];
let x, y, breadth;

// Setup function: initializes the canvas and sets up the initial state.
setup = () => {
  createCanvas(windowWidth, windowHeight);
  background('rgb(255,242,210)');
  rectMode(CENTER);
  Init();
};

// Draw function: updates the canvas continuously.
draw = () => {
  for (let i = 50; i--; ) Update();
};

// MousePressed function: resets the canvas when the mouse is pressed.
mousePressed = () => {
  background('rgb(255,242,210)');
  trails.length = 0;
  currentPath.length = 0;
  noiseSeed();
  Init();
};

// Init function: initializes the drawing state.
const Init = () => {
  if (currentPath.length > 0) {
    trails = trails.concat(currentPath);
  }
  x = random(width);
  y = random(height);
  breadth = random(5, 50);

  fill(color(random(256), random(256), random(256)));
  currentPath.length = 0;
};

// Update function: updates the position and state of the drawing.
const Update = () => {
  const n = noise(x / width, y / height);
  const angle = n * TWO_PI * 1.5;
  x += cos(angle) * 2 * 0.7; // Move 30% slower
  y += sin(angle) * 2 * 0.7; // Move 30% slower

  if (x < 0 || y < 0 || x > width || y > height) {
    Init();
    return;
  }

  const collide = trails.some(
    (t) => (t.x - x) ** 2 + (t.y - y) ** 2 < (t.breadth / 2 + breadth / 2) ** 2
  );
  if (collide) {
    Init();
    return;
  }

  currentPath.push({
    x: x,
    y: y,
    breadth: breadth,
  });

  push();
  translate(x, y);
  rotate(angle);
  noStroke();
  rect(0, 0, 1, 0.8 * breadth * (width / 800)); // Adjusted for window width
  stroke("rgb(0,0,0)");
  rect(0, 0.4 * breadth * (width / 800), 1, 1); // Adjusted for window width
  pop();
};



