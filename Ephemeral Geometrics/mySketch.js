/*
=======================================================================
Ephemeral Geometrics
=======================================================================
Description:
This p5.js script creates a visually dynamic and responsive artwork 
with a fully adjustable canvas size based on the window dimensions. 
The composition features an array of shapes, lines, and arcs, each 
uniquely positioned and colored. The color palette is randomly 
generated on each page refresh, providing endless variations in 
the visual composition. The code utilizes the p5.js library to 
handle the drawing and responsive behavior, offering an engaging 
and ever-changing visual experience.
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

// Array to store random colors
let colors;

// Setup function - runs once when the sketch starts
function setup() {
  // Create a canvas that fills the entire window
  createCanvas(windowWidth, windowHeight);

  // Set the background color of the canvas
  background(20);

  // Generate initial colors for the artwork
  generateColors();

  // Draw the initial iteration
  drawIteration();
}

// Draw function - continuously called in a loop
function draw() {
  // Your draw code goes here
}

// Function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Adjust the position and size of the shapes based on the new window dimensions
  background(20);
  drawIteration();
}

// Function to draw an iteration of shapes
function drawIteration() {
  // Draw 30 shapes with random positions and sizes
  for (let i = 0; i < 30; i++) {
    // Randomly determine the position and size of each shape
    let x = random(width);
    let y = random(height);
    let d = random(random(random(400))) + 50;

    // Adjust position and size based on window dimensions
    x = map(x, 0, width, 0, windowWidth);
    y = map(y, 0, height, 0, windowHeight);
    d = map(d, 0, 400, 0, min(windowWidth, windowHeight));

    // Set the stroke weight (line thickness) randomly
    strokeWeight(random(random(random(0.5))));

    // Set the stroke color randomly from the generated colors
    stroke(random(colors));

    // Draw two lines intersecting at a random position
    line(x + random(windowWidth), y, x - random(windowWidth), y);
    line(x, y + random(windowHeight), x, y - random(windowHeight));

    // Call the 'form' function to draw a complex shape at the specified position and size
    form(x, y, d);
  }
}

// Function to draw a complex shape at a given position and size
function form(x, y, d) {
  // Randomly select between two shape types
  let rnd = int(random(2));

  // Save the current drawing state and move the origin to (x, y)
  push();
  translate(x, y);

  // Rotate the shape by a random angle (PI/4) in one of two directions
  rotate(PI * 0.25 * int(random(2)));

  // Disable stroke (no outline)
  noStroke();

  // Draw shapes based on the selected type
  if (rnd == 0) {
    // For type 0, draw a variable number of circles
    let num = int(random(1, 7));
    for (let i = 0; i < num; i++) {
      // Vary the circle diameter and fill color
      let dd = map(i, 0, num, d * 0.4, 0);
      fill(random(colors));
      circle(0, 0, dd);
    }
  } else if (rnd == 1) {
    // For type 1, draw a variable number of arcs forming a circular pattern
    let num = int(random(2, 12));
    for (let i = 0; i < num; i++) {
      // Rotate for each arc and vary the fill color
      rotate(TAU / num);
      fill(random(colors));
      arc(0, 0, d * 0.4, d * 0.4, -0.02, TAU / num);
    }
  }

  // Enable stroke with random weight and color, considering window dimensions
  noFill();
  strokeWeight(random(0.8, 2) * min(windowWidth, windowHeight) / 100);
  stroke(random(colors));

  // Draw an additional pattern using the arcForm function
  for (let i = 0; i < 4; i++) {
    rotate(PI * 0.5);
    arcForm(0, 0, d);
  }

  // Restore the previous drawing state
  pop();
}

// Add a mousePressed event listener
mousePressed = function () {
  // Clear the previous artwork by setting the background color
  background(20);

  // Generate new colors when the mouse is clicked
  generateColors();

  // Draw a new iteration
  drawIteration();
};


// Draw function - continuously called in a loop
function draw() {
  // Your draw code goes here
}

// Function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Function to draw a complex shape at a given position and size
function form(x, y, d) {
  // Randomly select between two shape types
  let rnd = int(random(2));

  // Save the current drawing state and move the origin to (x, y)
  push();
  translate(x, y);

  // Rotate the shape by a random angle (PI/4) in one of two directions
  rotate(PI * 0.25 * int(random(2)));

  // Disable stroke (no outline)
  noStroke();

  // Draw shapes based on the selected type
  if (rnd == 0) {
    // For type 0, draw a variable number of circles
    let num = int(random(1, 7));
    for (let i = 0; i < num; i++) {
      // Vary the circle diameter and fill color
      let dd = map(i, 0, num, d * 0.4, 0);
      fill(random(colors));
      circle(0, 0, dd);
    }
  } else if (rnd == 1) {
    // For type 1, draw a variable number of arcs forming a circular pattern
    let num = int(random(2, 12));
    for (let i = 0; i < num; i++) {
      // Rotate for each arc and vary the fill color
      rotate(TAU / num);
      fill(random(colors));
      arc(0, 0, d * 0.4, d * 0.4, -0.02, TAU / num);
    }
  }

  // Enable stroke with random weight and color
  noFill();
  strokeWeight(random(0.8, 2));
  stroke(random(colors));

  // Draw an additional pattern using the arcForm function
  for (let i = 0; i < 4; i++) {
    rotate(PI * 0.5);
    arcForm(0, 0, d);
  }

  // Restore the previous drawing state
  pop();
}


// Function to draw an additional arc-based shape
// Function to draw an additional arc-based shape
function arcForm(x, y, d) {
  // Randomly choose one of four patterns
  let rnd = int(random(4));

  // Pattern 0: Simple arc
  if (rnd == 0) {
    arc(x, y, d, d, 0, PI * 0.5);

  // Pattern 1: Arc with two lines extending from opposite ends
  } else if (rnd == 1) {
    let l1 = d * 0.35;
    let l2 = d * 0.7;
    let a1 = PI * 0.22;
    let a2 = PI * 0.28;
    arc(x, y, d, d, 0, PI * 0.5);
    line(l1 * cos(a1), l1 * sin(a1), l2 * cos(a1), l2 * sin(a1));
    line(l1 * cos(a2), l1 * sin(a2), l2 * cos(a2), l2 * sin(a2));

  // Pattern 2: Two arcs and a circle forming a composite shape
  } else if (rnd == 2) {
    arc(x, y, d, d, 0, PI * 0.2);
    arc(x, y, d, d, PI * 0.3, PI * 0.5);
    circle(x + d * 0.5 * cos(PI * 0.25), y + d * 0.5 * cos(PI * 0.25), d * 0.05);

  // Pattern 3: Series of lines forming a fan-like shape
  } else if (rnd == 3) {
    for (let i = 0; i < 10; i++) {
      let a = map(i, 0, 10 - 1, 0, PI * 0.5);
      let l1 = d * 0.48;
      let l2 = d * 0.52;
      // Adjust lengths for a specific iteration
      if (i == 4) {
        l1 = d * 0.44;
        l2 = d * 0.56;
      }
      line(l1 * cos(a), l1 * sin(a), l2 * cos(a), l2 * sin(a));
    }
  }
}

// Function to generate a new set of random colors
function generateColors() {
  // Initialize an array to store random colors
  colors = [];
  
  // Generate four random RGB colors and store them in the array
  for (let i = 0; i < 4; i++) {
    colors.push(color(random(255), random(255), random(255)));
  }
}

