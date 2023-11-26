/*
=======================================================================
Sine
=======================================================================

Description:
This script generates a visually captivating canvas with wave-like shapes
using a unique color palette. The artwork is designed to evoke a sense of
harmony and tranquility through its dynamic and rhythmic patterns.

Specifications:
- Language: JavaScript (p5.js)
- Version: 1.0.0
- Author: 0xMilord
- Website: https://linktr.ee/0xmilord/
- GitHub: https://github.com/0xmilord/

License:
This artwork is licensed under the Attribution
-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0).
For details, see the full license text at: 
https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode

Scope of License:
You are free to:
- Share: Copy and redistribute the material in any medium or format.
- Adapt: Remix, transform, and build upon the material.

Under the following terms:
- Attribution: You must give appropriate credit, provide a link to the license,
  and indicate if changes were made. You may do so in any reasonable manner,
  but not in any way that suggests the licensor endorses you or your use.
- NonCommercial: You may not use the material for commercial purposes.
- ShareAlike: If you remix, transform, or build upon the material, you must
  distribute your contributions under the same license as the original.

=======================================================================
*/

let url = [
	"https://coolors.co/e63946-f1faee-a8dadc-457b9d-1d3557",
	"https://coolors.co/ffb5a7-fcd5ce-f8edeb-f9dcc4-fec89a",
	"https://coolors.co/f94144-f3722c-f8961e-f9c74f-90be6d-43aa8b-577590",
	"https://coolors.co/001427-708d81-f4d58d-bf0603-8d0801",
	"https://coolors.co/8ecae6-219ebc-023047-ffb703-fb8500",
	"https://coolors.co/46b1c9-84c0c6-9fb7b9-bcc1ba-f2e2d2",
	"https://coolors.co/000000-14213d-fca311-e5e5e5-ffffff",
	"https://coolors.co/ffffff-effffa-e5ecf4-c3bef7-8a4fff",
	"https://coolors.co/ffa69e-faf3f3-b8f2e6-aed9e0-5e6472",
	"https://coolors.co/eeebd3-d4a5a5-5e4c5a-3f4145-282d33",
	"https://coolors.co/f4ebd9-e9d2f4-aba9b0-46494c-2b2e4a",
	"https://coolors.co/9e768f-5b6c5d-d0ceba-ff9a8b-ff6f61",
	"https://coolors.co/d2a8a1-bf8b8b-ead7d1-a9bcd0-839b97",
	"https://coolors.co/ffbdbd-ffc3a0-ffd9a3-fad02e-8b80f9",
	"https://coolors.co/ff5e62-d5d8dc-6f7d8c-3f4c55-1f2f38",
	"https://coolors.co/5f0f40-9a031e-c22047-0d3b66-171e3c",
	"https://coolors.co/d9bf77-a99e9e-262335-49393b-7d7e75",
	"https://coolors.co/99b898-fecea8-f38181-6a0572-AB83A1",
	"https://coolors.co/453a94-6a0572-AB83A1-A05658-AB83A1",
	"https://coolors.co/A05658-6A0572-AB83A1-453A94-AB83A1",
	"https://coolors.co/303633-558F91-BF8D84-C54545-8E3531",
	"https://coolors.co/261447-3B0032-7D5A50-C6CDB0-FEF4B7",
	"https://coolors.co/F8B400-F5E356-FDE792-4E5760-2C3133",
	"https://coolors.co/262335-558F91-BF8D84-C54545-8E3531",
	"https://coolors.co/783f8e-9f86c0-b4aee8-8fa8db-415a77",
	"https://coolors.co/1e2328-7b0051-a9336e-48a9a6-ade8f4",
	"https://coolors.co/ffb6b9-fcd5ce-f8ead3-f9dcc4-fec89a",
	"https://coolors.co/364f6b-3d5a80-4687d0-61a0af-f0f7f4",
	"https://coolors.co/fc284f-ff824a-feeeed-d0e6e8-92a8d1",
	"https://coolors.co/fee140-fad02e-8b80f9-7c5ac1-3a3f44",
	"https://coolors.co/2f2d2e-706c61-a59e8c-ddd9c3-6a0572",
	"https://coolors.co/ff5972-ff693a-ffed48-4acfac-24a6d9",
	"https://coolors.co/f7c59f-392f5a-31a2ac-61c0bf-6b4226",
	"https://coolors.co/4e4e6a-9a8c98-c8c8a9-d2dcdd-cdd6d0",
	"https://coolors.co/5b2333-95203d-f15a22-043565-4e6792",
	"https://coolors.co/ef476f-ffd166-06d6a0-118ab2-073b4c"
  ];
  
  
  let palette, rs;
  
  function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 360, 100, 100, 100);
	noCursor();
	drawingContext.imageSmoothingEnabled = false;
  }
  
  function draw() {
	rs = random(10000);
	palette = createPalette(random(url));
	let p;
	let offset = min(width, height) / 5; // Adjust offset based on the smaller dimension
	for (let i = 0; i < 20; i++) {
	  randomSeed(rs);
	  p = get();
	  clear();
	  for (let j = 0; j < 55; j++) {
		let x = random(-offset, width + offset);
		let y = random(-offset, height + offset);
		rectMode(CENTER);
		push();
		translate(x, y);
		rotate(i / 25 * TWO_PI);
		fill(palette[i % palette.length]);
		noStroke();
		let d = random(5, 50);
		let scaledD = d * (width / 800); // Adjust circle size based on window width
		circle(0, 0, i * scaledD);
		pop();
	  }
	  p.mask(get());
	  push();
	  image(p, 0, 0, width, height);
	  pop();
	}
	frameRate(0.01);
  }
  
  function createPalette(_url) {
	let slash_index = _url.lastIndexOf('/');
	let pallate_str = _url.slice(slash_index + 1);
	let arr = pallate_str.split('-');
	for (let i = 0; i < arr.length; i++) {
	  arr[i] = color('#' + arr[i]);
	}
	return arr;
  }
  
  function generateElements() {
	rs = random(10000);
	palette = createPalette(random(url));
	let p;
	let offset = min(width, height) / 5;
	for (let i = 0; i < 20; i++) {
	  randomSeed(rs);
	  p = get();
	  clear();
	  for (let j = 0; j < 55; j++) {
		let x = random(-offset, width + offset);
		let y = random(-offset, height + offset);
		rectMode(CENTER);
		push();
		translate(x, y);
		rotate(i / 25 * TWO_PI);
		fill(palette[i % palette.length]);
		noStroke();
		let d = random(5, 50);
		let scaledD = d * (width / 800);
		circle(0, 0, i * scaledD);
		pop();
	  }
	  p.mask(get());
	  push();
	  image(p, 0, 0, width, height);
	  pop();
	}
	frameRate(0);
  }
  
  function createPalette(_url) {
	let slash_index = _url.lastIndexOf('/');
	let pallate_str = _url.slice(slash_index + 1);
	let arr = pallate_str.split('-');
	for (let i = 0; i < arr.length; i++) {
	  arr[i] = color('#' + arr[i]);
	}
	return arr;
  }
  
  function keyTyped() {
	if (key === "s" || key === "S") {
	  noLoop();
	  saveCanvas("Psych Circles", "png");
	}
  }
  
  function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	generateElements(); // Regenerate elements on window resize
  }
  
  function mousePressed() {
	generateElements(); // Generate new elements on mouse click
  }