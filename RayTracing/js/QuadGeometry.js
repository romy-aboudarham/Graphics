"use strict";
let QuadGeometry = function(gl) {
  this.gl = gl;

  // Square Vertex Buffer
  this.squareVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexBuffer);
  var vertices = new Float32Array([
      0.0,  0.0, 0.0,
     -0.1,  0.1, 0.0,
      0.1,  0.1, 0.0,
      0.1, -0.1, 0.0,
     -0.1, -0.1, 0.0,
    ]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  this.vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([
        0.0, 0.0, 0.9,
        0.0, 0.0, 0.3,
        0.0, 0.0, 0.3,
        0.0, 0.0, 0.3, 
        0.0, 0.0, 0.3, 
    ]),
    gl.STATIC_DRAW);

  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,
      0, 2, 3,
      0, 3, 4,
      0, 4, 1,
    ]),
    gl.STATIC_DRAW);
};

QuadGeometry.prototype.draw = function() {
  let gl = this.gl;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1,
    3, gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 0); 
 };
