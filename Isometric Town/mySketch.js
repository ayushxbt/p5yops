/*
=======================================================================
Isometric Town
=======================================================================
Description:
This script generates an isometric town pattern consisting of hexagonal 
shapes arranged in a spiral pattern. The town's visual elements include 
a central hexagon and multiple layers of hexagons expanding outward. 
Each hexagon features an intricate leaf-like pattern, and the color 
palette for the entire town is randomly selected from a set of 
predefined palettes. The script employs p5.js to create an 
interactive and visually appealing isometric town with a 
dynamic color scheme. Additionally, the script introduces 
granulation to the canvas, adding a grainy texture to 
enhance the overall aesthetic. The user can trigger the 
generation of a new iteration by clicking the mouse, 
resulting in a different color palette and a refreshed 
isometric town pattern.
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

// Variable to store the current color palette
let palette;

// Maximum number of cells in the hexagonal spiral
let maxCellNum = 6;

// Spacing between hexagons in the spiral
let spacing = 130;

// Setup function called by p5.js at the beginning
function setup() {
  // Create a canvas that fills the entire window
  createCanvas(windowWidth, windowHeight);

  // Initialize the palette with a random set of colors from the palettes array
  palette = random(palettes);

  // Set the stroke join style to ROUND for smoother lines
  strokeJoin(ROUND);

  // Call function to create a new iteration initially
  createNewIteration();
}

// Function to create the hexagonal spiral pattern
function makeHexSpiral(mod) {
  // Initialize current x, y coordinates, and offset based on the given mod parameter
  let currX = 0;
  let currY = 0;
  let offset = mod;

  // Draw the central hexagon at the starting position
  drawHexagon(currX, currY, 0);

  let n;
  // Loop to create hexagonal layers around the central hexagon
  for (n = 1; n < maxCellNum; n++) {
    offset = n;

    // move right
    for (let i = 0; i < n; i++) {
      currX += spacing;
      drawHexagon(currX, currY, offset + i);
    }

    // move down right. Note N-1
    for (let i = 0; i < n - 1; i++) {
      currY += spacing;
      drawHexagon(currX, currY, offset + i);
    }

    // move down left
    for (let i = 0; i < n; i++) {
      currX -= spacing;
      currY += spacing;
      drawHexagon(currX, currY, offset + i);
    }

    // move left
    for (let i = 0; i < n; i++) {
      currX -= spacing;
      drawHexagon(currX, currY, offset + i);
    }

    // move up left
    for (let i = 0; i < n; i++) {
      currY -= spacing;
      drawHexagon(currX, currY, offset + i);
    }

    // move up right
    for (let i = 0; i < n; i++) {
      currX += spacing;
      currY -= spacing;
      drawHexagon(currX, currY, offset + i);
    }
  }

  // Adjust the iteration count
  n = n - 1;

  // move right to complete the last row
  for (let i = 0; i < n; i++) {
    currX += spacing;
    drawHexagon(currX, currY, offset + i);
  }
}


// The main draw function responsible for rendering the hexagonal spiral and background.
function draw() {
  // Set the background color to a random color from the palette array.
  background(random(palette));
  // Set stroke color to white.
  stroke(255);
  // Set the stroke weight for the lines.
  strokeWeight(2.5);

  // Move the origin to the center of the canvas.
  translate(width / 2, height / 2);
  // Call the function to generate the hexagonal spiral.
  makeHexSpiral();

  // Add granulation to the image.
  granulate(25);
  // Stop redrawing, as we only want to generate the pattern once.
  noLoop();
}

// Function to draw a hexagon and call the function to draw the leaf pattern inside.
function drawHexagon(posX, posY, rad) {
  // Save the current transformation state.
  push();
  // Adjust the position of the hexagon based on its y-coordinate.
  posX = posX + posY / 2;
  posY = (sqrt(3) / 2) * posY;
  // Call the function to draw the leaf pattern inside the hexagon.
  drawLeaf(posX, posY, spacing / 1.75, rad);
  // Restore the transformation state to the previously saved state.
  pop();
}

// Function to draw a leaf pattern inside a hexagon.
function drawLeaf(posX, posY, rad, divs) {
  // Move the origin to the specified position.
  translate(posX, posY);
  // Rotate the canvas to create the hexagonal shape.
  rotate(PI / 6);

  // Set the radius and angle increment for drawing the leaf pattern.
  rad = rad;
  let div = TAU / 3;

  // Loop through each angle to draw the leaf pattern.
  for (let a = 0; a < TAU; a += div) {
    // Calculate the coordinates of the first point on the leaf.
    let x1 = rad * cos(a);
    let y1 = rad * sin(a);

    // Draw a line from the origin to the calculated point.
    line(0, 0, x1, y1);

    // Calculate the coordinates of the second point on the leaf.
    let randRad = 1; //random(1,2)
    let x2 = rad * randRad * cos(a + div / 2);
    let y2 = rad * randRad * sin(a + div / 2);

    // Calculate the coordinates of the third point on the leaf.
    let x3 = rad * cos(a + div);
    let y3 = rad * sin(a + div);

    // Generate a random number of lines inside the leaf.
    let num = int(random(2, 6));
    for (let nn = 1; nn < num + 1; nn++) {
      // Interpolate between the points to create variations in the leaf shape.
      let rat = map(nn, 0, num, 0, 1);
      let interX1 = 0 * rat + x1 * (1 - rat);
      let interY1 = 0 * rat + y1 * (1 - rat);

      let interX2 = x2 * (1 - rat) + x3 * rat;
      let interY2 = y2 * (1 - rat) + y3 * rat;

      let ratprev = map(nn - 1, 0, num, 0, 1);
      let interX1prev = 0 * ratprev + x1 * (1 - ratprev);
      let interY1prev = 0 * ratprev + y1 * (1 - ratprev);

      let interX2prev = x2 * (1 - ratprev) + x3 * ratprev;
      let interY2prev = y2 * (1 - ratprev) + y3 * ratprev;

      // Set the stroke weight and color.
      strokeWeight(2.5);
      stroke(0);
      // Fill the leaf shape with a random color from the palette.
      fill(random(palette));

      // Begin drawing a shape by connecting a series of vertices.
      beginShape();
      vertex(interX1, interY1);
      vertex(interX2, interY2);
      vertex(interX2prev, interY2prev);
      vertex(interX1prev, interY1prev);
      endShape(CLOSE);
    }
    // Reset stroke weight for subsequent iterations.
    strokeWeight(1);
  }
}

// Colour palette variations, Randomly changed at every iteration
let palettes = [
  ["#492b7c", "#301551", "#ed8a0a", "#f6d912", "#fff29c"],
  ["#454d66", "#309975", "#58b368", "#dad873", "#efeeb4"],
  ["#492b7c", "#301551", "#ed8a0a", "#f6d912", "#fff29c", "#454d66", "#309975", "#58b368", "#dad873", "#efeeb4"],
  ["#1f306e", "#553772", "#8f3b76", "#c7417b", "#f5487f"],
  ["#ff165d", "#ff9a00", "#f6f7d7", "#3ec1d3"],
  ["#1f306e", "#553772", "#8f3b76", "#c7417b", "#f5487f", "#454d66", "#309975", "#58b368", "#dad873", "#efeeb4"],
  ["#dc060e", "#ffd400", "#0064b0", "#001a5b", "#ffffff"],
  ["#ff165d", "#ff9a00", "#f6f7d7", "#3ec1d3", "#dc060e", "#ffd400", "#0064b0", "#001a5b", "#ffffff", "#492b7c", "#301551", "#ed8a0a", "#f6d912", "#fff29c", "#454d66", "#309975", "#58b368", "#dad873", "#efeeb4"],
  ["#1a1a1a", "#383838", "#4c4c4c", "#a6a6a6", "#d9d9d9"],
  ["#c94c4c", "#f26868", "#f29c9c", "#f2c9c9", "#f2e5e5"],
  ["#5e9e4b", "#93c68e", "#c2dfb7", "#e6f2d6", "#f2f9f2"],
  ["#2b4e63", "#5c97b2", "#8dbbd8", "#bad8eb", "#e3f3ff"],
  ["#ff7300", "#ffc300", "#ffed8b", "#fffecc", "#fffae3"],
  ["#ebebeb", "#d3d3d3", "#b3b3b3", "#8b8b8b", "#5a5a5a"],
  ["#b06a4c", "#d19a80", "#e1b8a6", "#f0d0c2", "#faddd8"],
  ["#007acc", "#1c8cff", "#4fa3ff", "#81bbff", "#b3d3ff"],
  ["#b84747", "#d97777", "#f4a1a1", "#ffc8c8", "#ffe8e8"],
  ["#341a1a", "#592d2d", "#8d5858", "#c89696", "#f2dada"]
	["#a349a4", "#d385d3", "#e6a7e6", "#f2c2f2", "#f9dbf9"],
  ["#1c1c1c", "#2e2e2e", "#595959", "#a6a6a6", "#e6e6e6"],
  ["#a6363d", "#d9484e", "#f27171", "#f9a3a4", "#ffd3d4"],
  ["#56494e", "#847c83", "#b3acb4", "#d9d3d6", "#edeae9"],
  ["#00a896", "#6ab87a", "#fed766", "#fe4a49", "#2ab7ca"],
  ["#171738", "#354f52", "#66a182", "#95d9c3", "#c4f4e0"],
  ["#f95738", "#d32a2e", "#9a031e", "#590004", "#2a0800"],
  ["#c70039", "#e94e77", "#ffcccb", "#d8ffcb", "#8cffcb"],
  ["#271f30", "#3c3940", "#4a4e4d", "#6f8b94", "#97aabd"],
  ["#424242", "#757575", "#a4a4a4", "#d9d9d9", "#ffffff"]	
];


// Function to add grainy texture to the canvas
// Takes a parameter gA, which controls the intensity of the grain
function granulate(gA) {
  // Load the pixel data of the canvas
  loadPixels();
  // Retrieve the pixel density of the display
  let d = pixelDensity();
  // Calculate the total number of pixels in half of the canvas
  let halfImage = 4 * (width * d) * (height * d);
  // Loop through each pixel, applying random grain to the RGB values and alpha channel
  for (let ii = 0; ii < halfImage; ii += 4) {
    // Generate a random grain amount within the specified range
    let grainAmount = random(-gA, gA);
    // Add the grain to the red channel
    pixels[ii] = pixels[ii] + gA;
    // Add the grain to the green channel
    pixels[ii + 1] = pixels[ii + 1] + grainAmount;
    // Add the grain to the blue channel
    pixels[ii + 2] = pixels[ii + 2] + grainAmount;
    // Add the grain to the alpha channel
    pixels[ii + 3] = pixels[ii + 3] + gA;
  }
  // Update the canvas with the modified pixel data
  updatePixels();
}

// Function to handle window resize events
function windowResized() {
  // Resize the canvas to match the updated window dimensions
  resizeCanvas(windowWidth, windowHeight);
}

// Function to handle mouse click events
function mousePressed() {
  // Trigger the creation of a new iteration
  createNewIteration();
}

// Function to create a new iteration by randomly selecting a new color palette and redrawing the canvas
function createNewIteration() {
  // Randomly select a new color palette from the provided palettes array
  palette = random(palettes);
  // Redraw the canvas with the updated color palette
  redraw();
}

