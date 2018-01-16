let ClippedQuadric = function(surfaceCoeffMatrix, clipperCoeffMatrix) {
	this.surfaceCoeffMatrix = surfaceCoeffMatrix;
	this.clipperCoeffMatrix = clipperCoeffMatrix;
}

ClippedQuadric.prototype.setUnitSphere = function(){
  this.surfaceCoeffMatrix.set(	
  		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(	
  		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
}

ClippedQuadric.prototype.setUnitCylinder = function(){
  this.surfaceCoeffMatrix.set(	
  		1, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(	
  		0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1);
}

ClippedQuadric.prototype.setDisk = function(){
  this.surfaceCoeffMatrix.set(	
  		0, 0, 0, 0,
		0, 0, 0, 1,
		0, 0, 0, 0,
		0, 0, 0, -1);
  this.clipperCoeffMatrix.set(	
		1, 0, 0, 0,
		0, 0, 0, 1,
		0, 0, 1, 0,
		0, 0, 0, -1);
}


ClippedQuadric.prototype.setCone = function(){
  this.surfaceCoeffMatrix.set(	
  		1, 0, 0, 0,
		0, -1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 0);
  this.clipperCoeffMatrix.set(	
		0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1).translate(0, -2, 0);

}


ClippedQuadric.prototype.setHyperboloid = function(){
  this.surfaceCoeffMatrix.set(	
  		1, 0, 0, 0,
		0, -1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -.4);
  this.clipperCoeffMatrix.set(	
		0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -2).translate(0, .5, 0);

}

ClippedQuadric.prototype.setInfinitePlane = function(){
  this.surfaceCoeffMatrix.set(	
  		0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -0.01);
  this.clipperCoeffMatrix.set(	
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -512);
}

ClippedQuadric.prototype.setParaboloid = function(){
  this.surfaceCoeffMatrix.set(	
  		1, 0, 0, 0,
		0, 0, 0, -1,
		0, 0, 1, 0,
		0, 0, 0, 0);
  this.clipperCoeffMatrix.set(	
  		0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1).translate(0, 1.3, 0);
}

ClippedQuadric.prototype.setTopParaboloid = function(){
  this.surfaceCoeffMatrix.set(	
  		0, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, -1).translate(0, 1.3, 0);
  this.clipperCoeffMatrix.set(	
  		1, 0, 0, 0,
		0, 0, 0, -1,
		0, 0, 1, 0,
		0, 0, 0, 0);
}

ClippedQuadric.prototype.transform = function(T){
	this.surfaceCoeffMatrix.premul(T.invert()).mul(T.transpose());
	this.clipperCoeffMatrix.premul(T.transpose()).mul(T.transpose());
}

