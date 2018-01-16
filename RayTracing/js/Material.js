"use strict"; 
let Material = function(gl, program) { 
  this.gl = gl; 
  this.program = program; 
  let theMaterial = this; 

  Object.keys(program.uniforms).forEach(function(uniformName) { 
    let uniform = program.uniforms[uniformName]; 
    let reflectionVariable = 
        UniformReflectionFactories.makeVar(gl,
                                uniform.type, uniform.size); 
    Object.defineProperty(theMaterial, uniformName,
        {value: reflectionVariable} ); 
  }); 
}; 

Material.prototype.commit = function() { 
  let gl = this.gl; 
  this.program.commit(); 
  let theMaterial = this; 
  Object.keys(this.program.uniforms).forEach( function(uniformName) { 
    let uniform = theMaterial.program.uniforms[uniformName]; 
    let reflectionVariable = Material[uniformName] || theMaterial[uniformName]; 
    reflectionVariable.commit(gl,uniform.location); 
  }); 
}; 

Object.defineProperty(Material, "modelViewProjMatrix", {value: new Mat4()});
Material.lightPositions = new Vec4Array(3);
Material.modelMatrix = new Mat4();
Material.modelMatrixInverse = new Mat4();
Material.lightPowerDensity = new Vec3Array(3);
Material.lightDirection = new Vec3Array(3);
Material.light = new Vec3Array(3);
Material.viewProjMatrix = new Mat4();
Material.cameraPos = new Vec3(3);
Material.rayDirMatrix = new Mat4();
Material.quadrics = new Mat4Array(32);
Material.multiclipper = new Mat4Array(6);
Material.brdfs = new Vec4Array(17);
Material.multibrdfs = new Vec4Array(32);

