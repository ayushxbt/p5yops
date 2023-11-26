var balls = [];
var platforms = [];

var imgNoiseTexture;

// camera knock parameters
var knock = false;
var knockAim;
var knockVector;
var knockDamping = 0.9;
var knockCounter = 0;
var knockTime = 3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  imgNoiseTexture = generateNoiseTexture();
  setColours();
  makePlatforms();
  setPhysicsParameters();
  balls.push(new Ball(width / 2, 0, min(width, height) * 0.04)); // Adjusted ball size based on canvas size
  knockAim = createVector(0, 0);
  knockVector = createVector(0, 0);
}

function makePlatforms() {
  platforms = [];
  platforms.push(new Platform(0, height / 2, 10, height, 0));
  platforms.push(new Platform(width, height / 2, 10, height, 0));
  let n = round(random(10)) + 5;
  let sizeScalar = 0.4;
  for (let i = 0; i < n; i++) {
    platforms.push(new Platform(random(width - 100) + 50, random(height - 100) + 50, random(width) * sizeScalar, random(height) * sizeScalar, random(PI)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Adjust any other elements that need resizing
}

function mouseClicked() {
  for (let p of platforms) {
    p.setColours();
  }
}

function draw() {
  background(255);
  checkCollision();
  updateBalls();
  render();
}

function checkCollision() {
  for (let p of platforms) {
    p.checkCollision(balls);
  }
}

function updateBalls() {
  for (let ball of balls) {
    ball.update();
    if (ball.pos.x < ball.r) {
      ball.pos.x = ball.r;
    } else if (ball.pos.x > width - ball.r) {
      ball.pos.x = width - ball.r;
    }
    if (ball.pos.y > height + ball.r * 5) {
      ball.pos.y = -ball.r * 2;
      makePlatforms();
    }
  }
}

function render() {
  background(colBackground);
  push();
  cameraKnock();
  drawPlatforms();
  drawBalls();
  pop();
  image(imgNoiseTexture, 0, 0);
  drawFrame();
}

function addKnock(_knockVector) {
	knockAim = _knockVector.copy();
	knockCounter = 0;
}

function cameraKnock() {
	if (!knock) {
		return;
	}
	
	translate(knockVector.x, knockVector.y);
	
	if (knockAim.x == 0 && knockAim.y == 0) {
		// dampen shake
		knockVector.mult(knockDamping);
	}
	else {
		knockVector = vlerp(createVector(0, 0), knockAim, knockCounter / knockTime);
		if (vequals(knockVector, knockAim, 0.1)) {
			knockAim = createVector(0, 0);
		}
	}
	
	knockCounter++;
}

function drawBalls() {
	strokeWeight(5);
	stroke(colBallOuter);
	fill(colBallInner);
	for (let ball of balls) {
		ball.draw();
	}
}

function drawPlatforms() {
	for (let p of platforms) {
		p.draw();
	}
}

function drawFrame() {
	rectMode(CORNER);
	strokeWeight(30);
	stroke(colFrame);
	noFill();
	rect(0, 0, width, height);
}