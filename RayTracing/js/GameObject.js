"use strict"; 
let GameObject = function(mesh) { 
  this.mesh = mesh;
  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.rotationAxis = new Vec3(0, 1, 0);
  this.scale = new Vec3(1, 1, 1); 
  this.speed = 10;

  this.modelMatrix = new Mat4(); 
};

GameObject.prototype.updateModelMatrix =
                              function(){ 
  // TODO: set the model matrix according to the position, orientation, and scale
  this.modelMatrix.set().scale(this.scale).rotate(this.orientation, this.rotationAxis).translate(this.position);
};

GameObject.prototype.draw = function(camera, lightSources){ 
  this.updateModelMatrix();
  //this.mesh.setUniform("modelViewProjMatrix", this.modelMatrix.mul(camera.viewProjMatrix));
  //this.mesh.material.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  Material.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  Material.modelMatrix.set(this.modelMatrix);
  Material.modelMatrixInverse.set(this.modelMatrix).invert();
  Material.lightPositions.set(lightSources.position);
  Material.lightPowerDensity.set(lightSources.powerDensity);
  Material.lightDirection.set(lightSources.lightDirection);
  Material.rayDirMatrix.set(camera.rayDirMatrix);
  this.mesh.draw(); 
};

GameObject.prototype.move = function(dt, keysPressed) { 
  // Position
 
  // Orientation
  if(keysPressed[keyboardMap[38]]) { 
    this.position.add(this.speed*dt*Math.sin(this.orientation), 0, this.speed*dt*Math.cos(this.orientation));
  } 
  if(keysPressed[keyboardMap[37]]) { 
    this.orientation += .1;
  } 
  if(keysPressed[keyboardMap[39]]) { 
    this.orientation -= .1;
  } 
  if(keysPressed[keyboardMap[40]]) { 
    this.position.add(this.speed*dt*Math.sin((this.orientation)+Math.PI), 0, this.speed*dt*Math.cos((this.orientation)+Math.PI));
  } 

  this.updateModelMatrix(); 
}; 

