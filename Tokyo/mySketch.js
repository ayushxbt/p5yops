var cols;
var ncols=7;
var colb;
var shapes;
var nshapes;
var ntypes=2;
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 255, 255, 255);
  rectMode(CENTER);
  strokeWeight(5);
  init();
}
function init() {
  shapes=[];
  cols=[];
	nshapes=int(random(20,200));
  for (var i=0; i<ncols; i++) {
    cols[i]=color(random(360), 255, 50+310*i/ncols, 120);
  }
  for (var i=0; i<nshapes; i++) {
    shapes[i]=new Shape(i);
  }
  colb=cols[int(random(ncols))];
  colb=color(hue(colb), 20, 255);
}

function draw() {
  background(colb);  
  stroke(color(hue(colb), 100, 50,50));
  for (var i=0; i<9; i++) {
    line(int(.1*width)+i*int(width*.1), int(.1*height),int(.1*width)+i*int(width*.1), int(.1*height)+8*int(height*.1));
    line(int(.1*width), int(.1*height)+i*int(height*.1), int(.9*width),int(.1*height)+i*int(height*.1));
  }
  for (var i=0; i<nshapes; i++) {
    shapes[i].display();
  }
}
function mousePressed(){
	init();
}