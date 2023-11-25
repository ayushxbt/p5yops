/*
=======================================================================
Stippled Wormhole
=======================================================================
Description:
Dive into the mesmerizing world of Spiraling Stippled Elegance, a 
stunning artwork featuring a meticulously crafted stippling technique 
forming a captivating spiral. The delicate dance of dots and random 
colors creates a visually dynamic and sophisticated header, perfect 
for projects that blend complexity with elegance. Let this artwork 
leave a lasting impression of artistry on your creative endeavors.
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

// Variable to store the randomly generated colors
let colors;

// Function to generate an array of 5 random colors
function generateRandomColors() {
  return Array.from({ length: 5 }, () => color(random(255), random(255), random(255)));
}

// Function to set up the initial canvas and sketch settings
function setup() {
  
  // Create a canvas with dimensions matching the window size
  createCanvas(windowWidth, windowHeight);
  
  // Initialize the sketch with default settings
  resetSketch();

  // Set up a shadow effect for the drawing context
  drawingContext.shadowColor = color(0, 0, 0, 30);
  drawingContext.shadowBlur = 20;
  drawingContext.shadowOffsetX = 5;
  drawingContext.shadowOffsetY = -5;
}

// Function to reset the sketch to its initial state
function resetSketch() {
  
  // Generate a new set of random colors
  colors = generateRandomColors();
  
  // Set the background color and basic settings
  background(200);
  pixelDensity(1);
  fill(30);
  rect(0, 0, width, height);
  noStroke();
  
  // Reset the frame count to 0
  frameCount = 0;
}

// Function called when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetSketch();
}

// Function called when the mouse is pressed, triggering a sketch reset
function mousePressed() {
  resetSketch();
}

// Function to continuously draw and update the canvas
function draw() {
  
  // Translate the origin to the center of the canvas
  translate(width / 2, height / 2);
  
  // Define a span for color transitions
  let cSpan = 100;
  
  // Calculate indices for two colors based on the frame count
  let c1 = (int(frameCount / cSpan)) % 5;
  let c2 = (int(frameCount / cSpan) + 1) % 5;
  
  // Calculate a ratio for color interpolation
  let ratioValue = (frameCount / cSpan - int(frameCount / cSpan));
  
  // Set the weight of the stroke for subsequent shapes
  strokeWeight(2);

  // Loop to create and position 50 shapes in a stippled pattern
  for (var i = 0; i < 50; i++) {
    push();
    
    // Fill the shape with a color interpolated between two random colors
    fill(lerpColor(colors[c1], colors[c2], ratioValue));
    
    // Rotate the coordinate system based on the frame count and loop variable
    rotate(frameCount / (50 + 10 * log(frameCount)) + i / 20);
    
    // Calculate a distance factor for the shape's translation
    let dd = frameCount / (5 + i) + frameCount / 5 + sin(i) * 50;
    
    // Translate the shape to a random position based on the distance factor
    translate(random(dd / 2, dd), 0);

    // Generate random coordinates using Perlin noise
    let x = noise(frameCount / 50 + i / 50, 5000) * 80 + random(50);
    let y = noise(frameCount / 50 + i / 50, 10000) * 80 + random(50);

    // Generate a random radius for the shape
    let rr = random(1, 8 - log(frameCount) / 10);
    
    // Draw an ellipse at the calculated coordinates with the generated radius
    ellipse(x, y, rr, rr);
    
    // Restore the previous transformation state
    pop();
  }
}

