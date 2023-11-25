/*
=======================================================================
Stellar Ballet
=======================================================================
Description:
"Stellar Ballet" is an enchanting visual experience crafted with p5.js. 
Dynamic shapes and vibrant hues perform a cosmic dance, responding 
elegantly to user interactions. The canvas adapts seamlessly to 
different screens, and optimizations ensure a smooth, lag-free 
spectacle. Immerse yourself in the harmonious symphony of 
"Stellar Ballet," where art and technology converge to 
create a celestial masterpiece.
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

// Declare variables for overall texture, colors, and background color
let overAllTexture;
let colors = "fff-264653-2a9d8f-e9c46a-f4a261-e76f51-ff5964-ff9999-ffcf9e-6a0572-ab83a1-468189-77acc7-709fb0-ff595e-664e88-ba3c3e".split("-").map(a => "#" + a);
let bgColor;


// Setup function: Initialize the canvas and create the overall texture
function setup() {
  // Create a responsive canvas that fits and scales within the display size
  createCanvas(windowWidth, windowHeight);
  pixelDensity(2);

  // Create a graphics buffer for the overall texture
  overAllTexture = createGraphics(width, height);
  overAllTexture.loadPixels();

  // Generate texture using Perlin noise
  for (let i = 0; i < width + 50; i++) {
    for (let o = 0; o < height + 50; o++) {
      overAllTexture.set(i, o, color(150, noise(i / 10, i * o / 300) * random([0, 0, 50, 150])));
    }
  }

  overAllTexture.updatePixels();

  // Set the background color
  background(100);
}

// Draw function: Main drawing logic
function draw() {
  // Draw a semi-transparent background rectangle
  push();
  fill(20);
  rect(0, 0, width, height);
  pop();

  // Translate and rotate the coordinate system
  push();
  translate(width / 2, height / 2);
  rotate(sin(frameCount / 100) / 2);

  // Draw concentric circles with varying transparency
  let count = 25;
  stroke(255);
  noFill();
  strokeWeight(1.5);

  push();
  for (let i = 0; i < 10; i += 1) {
    noStroke();
    stroke(255, 100);
    ellipse(0, 0, width * 0.1 * i, width * 0.1 * i);
  }
  pop();

  // Draw layered and animated shapes
  for (let i = 0; i < count; i++) {
    let layers = noise(i) * 20 + 10;
    push();
    scale(0.6);

    fill(255);
    let ang = (i / count) * 2 * PI;
    let r = width / 8 + cos(mouseX / 500 + ang + frameCount / 5000) * 50 + sin(ang * frameCount / 3000) * 100;
    let baseColor = color(colors[i % colors.length]);

    strokeWeight(1);
    push();
    stroke(20);
    rotate(ang);
    translate(r, 0);
    strokeWeight(3);

    let shapeFunc = i % 2 == 0 ? rect : ellipse;
    rectMode(CENTER);

    // Draw layered shapes with dynamic colors and transformations
    for (let o = layers - 2; o >= 0; o--) {
      baseColor.setRed(baseColor._getRed() + (noise(i, o, 500) - 0.5) * 80);
      baseColor.setGreen(baseColor._getGreen() + (noise(i, o) - 0.5) * 80);
      translate(sin(ang / 20 + i / 20 + o / 20) * 20, 0);
      fill(baseColor);
      translate(noise(i, o) * 10, noise(i, o, 50) * 10);
      rotate(sin((mouseY + sin(frameCount / 50) * 100) / 40 + (i * o) / (100 * noise(i, o)) / 2 + frameCount / 50) / 10);

      let ss = noise(i) * 10 + 5;
      fill(baseColor);
      rect(0, 0, o * ss, o * ss, 100);

      // Draw an ellipse for the innermost layer
      if (o == 1) {
        stroke(baseColor);
        ellipse(0, 0, 500, 500);
      }
    }
    pop();
    pop();
  }

  // Blend the overall texture with the drawing using MULTIPLY mode
  push();
  blendMode(MULTIPLY);
  image(overAllTexture, 0, 0);
  pop();
}
