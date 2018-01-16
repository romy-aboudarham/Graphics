"use strict"; 
let GameObject = function(mesh) { 
  this.mesh = mesh;
  this.position = new Vec3(0, 0, 0); 
  this.orientation = 0; 
  this.rotationAxis = new Vec3(0, 1, 0);
  this.scale = new Vec3(1, 1, 1); 
  this.speed = 10;
  this.onGround = false;

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
  this.mesh.draw(); 
};

GameObject.prototype.drawShadows = function(camera, lightSources){ 
  this.updateModelMatrix();
  //Material.modelViewProjMatrix.set(this.modelMatrix).scale(new Vec3(lightDir.x, 0, lightDir.z)).translate(new Vec3(0, 0.01, 0)).mul(camera.viewProjMatrix);
  Material.viewProjMatrix.set(camera.viewProjMatrix);
  Material.modelMatrix.set(this.modelMatrix);
  Material.lightPositions.set(lightSources.position);
  this.mesh.draw(); 
};

GameObject.prototype.move = function(dt, keysPressed) { 
  // Position
  if(keysPressed.Q) { 
    this.position.add(0, this.speed * dt, 0); 
  }
  if(keysPressed.E && !this.onGround) { 
    this.position.add(0, -this.speed * dt, 0); 
  } 
 
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

