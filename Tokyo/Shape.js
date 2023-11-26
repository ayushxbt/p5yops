function Shape(index) {
  this.index=index;
  this.pos=createVector(int(.1*width)+int(random(9))*int(width*.1), int(.1*height)+int(random(9))*int(height*.1));
  this.col=cols[int(random(ncols))];
	this.col0=this.col;
  this.cols=cols[int(random(ncols))];
  this.type=int(random(ntypes));
  this.w0=random(PI);
  this.h0=random(PI);
  this.c=15;//random(30);
  this.speedx=0;
  this.speedy=0;
  if (this.pos.x%(width*.05)==0) {
    if (random(1)>.7)this.speedx=int(random(1,6));
    else if (random(1)>.5)this.speedx=-int(random(1,6));
  }
  if (this.pos.y%(height*.05)==0&&this.speedx==0) {
    if (random(1)>.7)this.speedy=int(random(1,6));
    else if (random(1)>.5)this.speedy=-int(random(1,6));
  }
}

Shape.prototype.display=function() {
  
  if ((this.pos.x-int(.1*width))%int(width*.1)==0&&(this.pos.y-int(.1*height))%int(height*.1)==0) {
    if (random(1)>.7&&this.speedy==0){
			this.col=this.col0;
      this.speedx=0;
      this.speedy=random(1)>.5?-int(random(1,6)):int(random(1,6));
    }
    if (random(1)>.7&&this.speedx==0){
			this.col=this.col0;
      this.speedy=0;
      this.speedx=random(1)>.5?-int(random(1,6)):int(random(1,6));
    }
    if(random(1)>.1){
      this.speedy=this.speedx=0;
			this.col=color(hue(this.col),saturation(this.col),brightness(this.col),200);
    }
  }
  this.pos.x+=this.speedx;
  this.pos.y+=this.speedy;
	this.w=20+sin((this.w0+frameCount*.001)%PI)*140;
	this.h=20+sin((this.h0+frameCount*.0013)%PI)*140;
  if (this.pos.x>=int(.1*width)+8*int(width*.1) &&this.speedx>0)this.speedx=-int(random(1,6));
  if (this.pos.x<=int(.1*width) &&this.speedx<0)this.speedx=int(random(1,6));
  if (this.pos.y>=int(.1*height)+8*int(.1*height) &&this.speedy>0)this.speedy=-int(random(1,6));
  if (this.pos.y<=int(.1*height) &&this.speedy<0)this.speedy=int(random(1,6));
  push();
  translate(this.pos.x, this.pos.y);
  fill(this.col);
  stroke(hue(this.cols), 255, 50, 150);
  rect(0, 0, this.w, this.h, this.c, this.c);
	/*ellipse(-this.w*.2,-this.h*.1,8,8);
	ellipse(this.w*.2,-this.h*.1,8,8);
	noFill();
	arc(0,this.h*.2,this.w*.4,this.h*.3,0,PI);*/
  pop();
}