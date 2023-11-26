// Array of colors used for generating random colors
let colors = [
  "#ff0000", "#feb30f", "#0aa4f7", "#ffffff", "#4caf50", "#e91e63", "#2196f3",
  "#ff9800", "#9c27b0", "#795548", "#00bcd4", "#8bc34a", "#cddc39", "#673ab7",
  "#ffc107", "#03a9f4", "#9e9e9e", "#f44336", "#607d8b", "#3f51b5",
	"#ff7f00", "#00ff7f", "#ff007f", "#7f00ff", "#7fff00", "#ff007f", "#7f7f00", "#007fff", "#ff7f7f", "#7f7fff",
  "#ffaa00", "#00ffaa", "#ff00aa", "#aa00ff", "#aaff00", "#ff00aa", "#aaff00", "#00aaff", "#ffaaaa", "#aaaaff",
  "#ff5500", "#00ff55", "#ff0055", "#5500ff", "#55ff00", "#ff0055", "#55ff00", "#0055ff", "#ff5555", "#5555ff",
  "#ffd700", "#00ffd7", "#ff00d7", "#d700ff", "#d7ff00", "#ff00d7", "#d7ff00", "#00d7ff", "#ffd7d7", "#d7d7ff",
  "#ff00ff", "#ffff00", "#00ffff", "#ff4500", "#00ff45", "#4500ff", "#ff4500", "#45ff00", "#0045ff", "#ff0045"
];

// Array to store instances of the Walker class
let walkers = [];

// Number of walkers to create
let nWalkers = 100;

// Variable for palette (not currently used in the code)
let palette;

// Variable for image (not currently used in the code)
let img;

// Setup function: Initializes the canvas and creates instances of the Walker class
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
	background(9);
  ellipseMode(CENTER);
  rectMode(CENTER);

  // Create walkers with a larger step size
  for (let i = 0; i < nWalkers; i++) {
    walkers.push(new Walker(width / 2, height / 2, 150));
  }

  // Create walkers with a smaller step size
  for (let i = 0; i < nWalkers; i++) {
    walkers.push(new Walker(width / 2, height / 2, 75));
  }

  // Set up the canvas with a centered rectangle
  noFill();
  stroke(0);
  rect(width / 2, height / 2, width, height);

  // Call the drawWalkers function to draw the initial walkers
  drawWalkers();
}

// Draw function: Empty for this example
function draw() {
  // Nothing to do in draw for this example
}

// mouseClicked() function: Called whenever the mouse is clicked, clears the canvas and draws walkers again
function mouseClicked() {
  // Clear the canvas
  clear();
  // Draw the walkers again
  drawWalkers();
}

// Function to draw the walkers
function drawWalkers() {
  for (let i = 0; i < walkers.length; i++) {
    walkers[i].draw();
  }
}

// Walker class for creating and drawing random walkers
class Walker {
  constructor(x, y, step) {
    this.x = x;
    this.y = y;
    this.step = step;
    this.size = this.step / random(1, 3);
    this.color = generateColor(1);
    this.color2 = generateColor(1);
    this.temp = random(2, 3);
  }

  // Move function: Updates the position of the walker based on random angles
  move() {
    let ranAng1 = random([0, PI / 2, PI, 3 * PI / 2]);
    let ranAng2 = random([0, PI / 2, PI, 3 * PI / 2]);
    this.x += this.step * cos(ranAng1);
    this.y += this.step * sin(ranAng2);
  }

  // Draw function: Draws the walker using various shapes and colors
  draw() {
    let oldX = this.x;
    let oldY = this.y;
    let temp = this.step;

    stroke(0);
    this.move();
    push();
    stroke(0);
    fill(this.color2);

    // Draw ovals with decreasing sizes
    drawOval(createVector(oldX, oldY), createVector(this.x, this.y), this.size / this.temp);
    fill(100);
    let i = 1;
    for (let i = 2; i < 5; i += 0.5) {
      drawOval(createVector(oldX, oldY), createVector(this.x, this.y), this.size / this.temp / i);
    }

    fill(this.color);

    // Draw ellipses with different sizes
    ellipse(this.x, this.y, this.size / 2, this.size / 2);
    ellipse(this.x, this.y, this.size / 4, this.size / 4);

    pop();
    strokeWeight(2);
  }
}

// Function to generate a random color with some variation
function generateColor(scale) {
  let temp = color(colors[floor(random(0, colors.length))]);
  myColor = color(
    hue(temp) + randomGaussian() * scale,
    saturation(temp) + randomGaussian() * scale,
    brightness(temp) + randomGaussian() * scale,
    random(100, 100)
  );
  return myColor;
}

// Function to draw an oval based on two points and size
function drawOval(p1, p2, mySize) {
  let d = p1.dist(p2) + mySize * 2;
  let a = atan2(p2.y - p1.y, p2.x - p1.x);
  let center = createVector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  push();
  translate(center.x, center.y);
  rotate(a);
  if (d > 0.1) {
    rect(0, 0, d, mySize * 2, 80, 80);
  }
  pop();
}
