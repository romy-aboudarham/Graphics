"use strict"; 
let Mesh = function(geometry, material) {
  this.geometry = geometry;
  this.material = material;
};

Mesh.prototype.setUniform = function(name, value) {
  this.material[name].set(value);
};

Mesh.prototype.draw = function(){
  this.material.commit();
  this.geometry.draw();
};
