function strVector(v) {
	return "(" + round(v.x) + ", " + round(v.y) + ")";
}

function project(v1, v2) {
	// project v1 onto v2, i.e. get return component of v1 that is parallel to v2
	
	let magnitude = v1.dot(v2) / v2.dot(v2);
	return v2.copy().mult(magnitude);
}

function arrayContains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function clone(src) {
	let copy = [];
	for (let item of src) {
		copy.push(item);
	}
	return copy;
}

function vline(v1, v2) {
	line(v1.x, v1.y, v2.x, v2.y);
}

function vdistance(v1, v2) {
	return v1.copy().sub(v2).mag();
}

function vlerp(p1, p2, t) {
	let x = p1.x + (p2.x - p1.x) * t;
	let y = p1.y + (p2.y - p1.y) * t;
	return createVector(x, y);
}

function vequals(v1, v2, tolerance) {
	let distance = v1.copy().sub(v2).mag();
	return distance < tolerance;
}

function generateNoiseTexture() {
	let amount = 0.2;
	let img = createImage(int(width), int(height));
	img.loadPixels();
	for (let i = 0; i < img.width; i++) {
		for (let j = 0; j < img.height; j++) {
			if (random(1) < amount) {
				img.set(i, j, color(random(255), 15));
			} else {
				img.set(i, j, color(0, 0));
			}
		}
	}
	img.updatePixels();
	return img;
}

function copyColour(c) {
	return color(
  	red(c),
  	green(c),
  	blue(c),
  	alpha(c)
	)
}