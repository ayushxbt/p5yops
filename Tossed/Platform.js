class Platform{
	constructor(x, y, w, h, theta) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.theta = theta;
		
		this.setColours();
		
		//radius of minimum bounding circle (for collision)
		this.minBoundRadius = sqrt(sq(this.w) + sq(this.h)) / 2;
		
		this.setVertices();
		this.setEdgeSamples();
		this.setAllSamples();
		
		// list of intersecting balls. This way we can only call collide on those that have just entered collision range
		this.alreadyIntersecting = []; // this one is set at the end of the last frame, and is referred to during checking for collision
		this.intersecting = []; // this one is set each frame, than at the end of checking collisions, alreadyIntersecting becomes a clone of this one
		
		this.debug = false;
	}
	
	setColours() {
		this.colOuter = random(colPlatforms);
		this.colInner = copyColour(this.colOuter);
		this.colInner.setAlpha(220);
	}
	
	setVertices() {
		this.centre = createVector(this.x, this.y);
		
		// calculate the vector connecting the centre to the bottom right vertex (without accounting for theta)
		let angle_c2br = atan(this.h / this.w);
		let c2br = p5.Vector.fromAngle(angle_c2br, this.minBoundRadius);
		
		// calculate vectors from centre to other vertices by negating components (without accounting for theta)
		let c2bl = createVector(-c2br.x, c2br.y);
		let c2tr = createVector(c2br.x, -c2br.y);
		let c2tl = createVector(-c2br.x, -c2br.y);
		
		// rotate these vectors by theta
		c2br.rotate(this.theta);
		c2bl.rotate(this.theta);
		c2tl.rotate(this.theta);
		c2tr.rotate(this.theta);
		
		// set vertices
		this.a = this.centre.copy().add(c2br);
		this.b = this.centre.copy().add(c2bl);
		this.c = this.centre.copy().add(c2tl);
		this.d = this.centre.copy().add(c2tr);
	}
	
	setEdgeSamples() {
		//generate a sample of points along the edges of the rectangle. These will be used to see if the ball collides with a certain edge.
		this.abSample = this.sampleAlongEdge(this.a, this.b);
		this.bcSample = this.sampleAlongEdge(this.b, this.c);
		this.cdSample = this.sampleAlongEdge(this.c, this.d);
		this.daSample = this.sampleAlongEdge(this.d, this.a);
	}
	
	sampleAlongEdge(v1, v2) {
		//generate a bunch of points uniformly between vertices v1 and v2. Importantly these don't include vertices
		let v1Tov2 = v2.copy().sub(v1);
		let n = v1Tov2.mag() / 10;
		let sample = [];
		
		// increment vector, i.e. vector between samples.
		v1Tov2.div(n + 1);
		
		for (let i = 0; i < n; i ++) {
			sample.push(v1.copy().add(v1Tov2.copy().mult(i + 1)));
		}
		
		return sample;
	}
	
	setAllSamples() {
		// puts all edge and vertex samples in one array
		this.allSamples = [].concat(this.a,
																this.b,
																this.c,
																this.d,
																this.abSample,
																this.bcSample,
																this.cdSample,
																this.daSample);
		
	}
	
	draw() {
		rectMode(CENTER);
		push();
		translate(this.x, this.y);
		rotate(this.theta);
		
		strokeWeight(10);
		stroke(this.colOuter);
		fill(this.colInner);
		
		rect(0, 0, this.w, this.h);
		pop();
		
		if (this.debug) {
			this.drawSamples();
		}
	}
	
	drawSamples() {
		fill(0);
		noStroke();
		this.drawSample(this.abSample);
		this.drawSample(this.bcSample);
		this.drawSample(this.cdSample);
		this.drawSample(this.daSample);
	}
	
	drawSample(sample) {
		for (let s of sample) {
			ellipse(s.x, s.y, 3);
		}
	}
	
	checkCollision(balls) {
		for (let ball of balls) {
			if (this.fastRangeCheck(ball)) {
				this.detailedCollisionCheck(ball);
			}
		}
		this.alreadyIntersecting = clone(this.intersecting);
		this.intersecting = [];
	}
	
	fastRangeCheck(ball) {
		// this is the maximum distance (of centres of rect and circle) to still have a collision
		let maxCollisionRadius = this.minBoundRadius + ball.r;
		
		let ballToRect = createVector(this.x, this.y).sub(ball.pos);
		let distance = ballToRect.mag();
		
		// debug print
		if (this.debug) {
			noFill();
			strokeWeight(1);
			
			stroke(0);
			ellipse(this.x, this.y, this.minBoundRadius * 2);
			
			stroke(255, 0, 0);
			ellipse(this.x, this.y, maxCollisionRadius * 2);
		}
		
		return distance < maxCollisionRadius;
	}
	
	detailedCollisionCheck(ball) {
		let closestSamplePoint = this.getClosestSamplePoint(ball);
		if (ball.contains(closestSamplePoint)) {
			this.intersecting.push(ball);
			if (!arrayContains(this.alreadyIntersecting, ball)) {
				this.executeCollision(ball, closestSamplePoint);
			}
		}
	}
	
	getClosestSamplePoint(ball) {
		let closest = this.allSamples[0];
		let closestDistance = vdistance(closest, ball.pos);
		let distance = 0;
		
		for (let sp of this.allSamples) {
			distance = vdistance(sp, ball.pos)
			if (distance < closestDistance) {
				closestDistance = distance;
				closest = sp;
			}
		}
		return closest;
	}
	
	executeCollision(ball, closestSamplePoint) {
		let normal;
		
		// check each edge. If the closestSamplePoint is an edge, the normal is perpendicular to the vector between vertices
		if (arrayContains(this.abSample, closestSamplePoint)) {
			normal = this.a.copy().sub(this.b).rotate(PI / 2);
			ball.collide(normal);
		}
		else if (arrayContains(this.bcSample, closestSamplePoint)) {
			normal = this.b.copy().sub(this.c).rotate(PI / 2);
			ball.collide(normal);
		}
		else if (arrayContains(this.cdSample, closestSamplePoint)) {
			normal = this.c.copy().sub(this.d).rotate(PI / 2);
			ball.collide(normal);
		}
		else if (arrayContains(this.daSample, closestSamplePoint)) {
			normal = this.d.copy().sub(this.a).rotate(PI / 2);
			ball.collide(normal);
		}
		else {
			// vertex collision. Normal is just the vector from the vertex to the ball
			normal = ball.pos.copy().sub(closestSamplePoint);
			ball.collide(normal);
		}
	}
}