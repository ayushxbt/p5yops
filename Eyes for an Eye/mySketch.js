/*
=======================================================================
Eyes for an Eye
=======================================================================
Description:

This generative art piece features a dark gray background adorned with 
a grid of lighter gray lines forming a pattern. With each mouse click, 
a new iteration introduces whimsical eyes scattered randomly across the 
canvas. The eyes, each uniquely colored and sized, are surrounded by 
dynamic and chaotic patterns created by random noisy lines. Recursive 
circles and rectangles within some eyes add complexity and depth. 
The vibrant, ever-changing color palette and interactive nature make 
each iteration visually engaging and playful.
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

// Declare a variable to store a graphics buffer
let bg;

// Setup function runs once when the sketch starts
function setup() {
  
	// Create a canvas with the size of the window
  createCanvas(windowWidth, windowHeight);
  
	// Disable automatic looping (noLoop) to control when to redraw the canvas
  noLoop();

  // Set the separation (density) of the background grid lines
  let sep = 50;
  
	// Create a graphics buffer for the background grid
  bg = createGraphics(width, height);
  
	// Set properties for the background grid
  bg.noFill();
  bg.stroke(255, 55);
  bg.strokeWeight(0.5);
  
	// Generate the background grid using nested loops
  for (let i = 0; i < width; i += sep) {
    for (let j = 0; j < height; j += sep) {
      bg.rect(i, j, sep, sep);
    }
  }

  // Trigger the initial drawing
  drawIteration();
}

// Draw function runs continuously, but not used in this sketch
function draw() {
  
	// No need for the draw function to do anything on its own
}

// Function to draw a single iteration
function drawIteration() {
  
	// Set the background to a dark gray color
  background(30);
  
	// Draw the background grid using the pre-created graphics buffer
  image(bg, 0, 0);
  
	// Draw a set of random elements (eyes) on the canvas
  for (let i = 0; i < 60; i++) {
    let x = random(width);
    let y = random(height);
    let d = random(50, 100);
    let col = randomColor();
    stroke(col);
    strokeWeight(0.5);
    // Draw noisy lines forming a pattern around each eye
    for (let a = 0; a < TAU; a += TAU / 180) {
      noiseLine(x + d * 0.5 * cos(a), y + d * 0.5 * sin(a));
    }
    // Call the function to draw an eye at the specified coordinates and size
    eye(x, y, d);
  }
}

// Function to handle mouse press event
function mousePressed() {
  // Redraw the canvas when the mouse is pressed
  drawIteration();
}

// Function to draw an eye at specified coordinates and size
function eye(x, y, s) {
  strokeWeight(1);
  noStroke();
  fill(255);
  ellipse(x, y, s, s);
  circleRec(x, y, s * 0.65);
  fill(0, 20);
  ellipse(x, y, s * 0.65, s * 0.65);
  fill(0);
  ellipse(x, y, s * 0.25, s * 0.25);
  fill(255);
  ellipse(x - s * 0.15, y - s * 0.15, s * 0.25, s * 0.25);
}

// Function to draw noisy lines
function noiseLine(x, y) {
  let c = 100;
  let px = x;
  let py = y;
  for (let i = 0; i < c; i++) {
    let ns = 0.01;
    let angle = noise(x * ns, y * ns, i * 0.0001) * 10;
    line(x, y, px, py);
    px = x;
    py = y;
    x += cos(angle) * 4;
    y += sin(angle) * 4;
  }
}

// Function to draw recursive circles and rectangles
function circleRec(x, y, d) {
  
	// Fill the shape with a random color
  fill(randomColor());
  
	// Draw an ellipse (circle) at the specified coordinates and size
  ellipse(x, y, d, d);
  
	// Check if the size is greater than 20 to decide whether to create recursive shapes
  if (d > 20) {
    if (random(1) < 0.35) {
      let r = d / 2;
      let d1 = random(0.1, 0.9) * d;
      let d2 = d - d1;
      let a1 = random(TAU);
      let a2 = a1 + PI;
      let r1 = r - d1 / 2;
      let r2 = r - d2 / 2;
      
			// Recursive calls for two smaller circles
      circleRec(x + r1 * cos(a1), y + r1 * sin(a1), d1, d1);
      circleRec(x + r2 * cos(a2), y + r2 * sin(a2), d2, d2);
    } else {
      
			// Recursive call for a smaller circle
      circleRec(x, y, d - 5);
    }
  }
}

// Function to handle window resize event
function windowResized() {
  
	// Resize the canvas to match the new window size
  resizeCanvas(windowWidth, windowHeight);
  
	// Recreate the background grid graphics buffer
  bg = createGraphics(width, height);
  bg.noFill();
  bg.stroke(255, 55);
  bg.strokeWeight(0.5);
  // Generate the background grid using nested loops
  for (let i = 0; i < width; i += 3) {
    for (let j = 0; j < height; j += 3) {
      bg.rect(i, j, 3, 3);
    }
  }
}

// Function to generate a random color
function randomColor() {
  return color(random(255), random(255), random(255));
}
