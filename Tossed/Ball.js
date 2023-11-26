class Ball {
	constructor(x, y, r) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.r = r;
		this.restitution = 1.5;
		
		this.debug = false;
	}
	
	draw() {
		ellipse(this.pos.x, this.pos.y, this.r * 2);
	}
	
	update() {
		this.updateMovement();
	}
	
	collide(normal) {
		// ball collided with an object.
		
		// component of velocity perpendicular to collision plane
		let perp = project(this.vel, normal);
		
		// component of velocity parallel to collision plane
		let para = this.vel.copy().sub(perp);
		
		// parallel component stays the same, but perpendicular component is reversed
		this.vel = (para.copy().add(perp.copy().mult(-this.restitution)));
		
		// apply camera knock
		addKnock(perp.copy().mult(-3));
		
		if(this.debug) {
			print("collision at " + strVector(point));
			stroke(255, 0, 0);
			line(point.x, 0, point.x, height);
			line(0, point.y, width, point.y);
			
			vline(point, point.copy().add(perp.copy().mult(100)));
			vline(point, point.copy().add(para.copy().mult(100)));
			
			//noLoop(); // freeze sim
		}
	}
	
	contains(point) {
		// ball to point vector
		let b2p = this.pos.copy().sub(point);
		let distance = b2p.mag();
		
		if(distance < this.r) {
			return true;
		}
		else {
			return false;
		}
	}
	
	updateMovement() {
		this.vel.add(gravity.copy().mult(deltaTime));
		this.clampVelocity();
		this.pos.add(this.vel.copy().mult(deltaTime));
	}
	
	clampVelocity() {
		let terminalVelocity = 0.5;
		if (this.vel.mag() > terminalVelocity) {
			this.vel.normalize();
			this.vel.mult(terminalVelocity);
		}
	}
}