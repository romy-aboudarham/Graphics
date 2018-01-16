"use strict"; 
let GameObject = function(mesh) { 
  this.mesh = mesh;
  this.gemType = "";
  this.status = "";
  this.position = new Vec3(.5, 0, 0); 
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1); 

  this.modelMatrix = new Mat4(); 
};

GameObject.prototype.updateModelMatrix =
                              function(){ 
// TODO: set the model matrix according to the position, orientation, and scale
this.modelMatrix.set().scale(this.scale).rotate(this.orientation).translate(this.position);
};

GameObject.prototype.draw = function(camera){ 
  this.updateModelMatrix();
  this.mesh.setUniform("modelViewProjMatrix", this.modelMatrix.mul(camera.viewProjMatrix));
  //this.mesh.material.modelViewProjMatrix.set(this.modelMatrix).mul(camera.viewProjMatrix);
  this.mesh.draw(); 
};
