"use strict";

let StarGeometry = function(gl) {
  var rBig = 0.3; // longest side 
  var rSmall = 0.15; // smallest side
  var phiBaseBig = Math.PI/2; 
  var phiBaseSmall = Math.PI/2 * 3;
  var phiAdd = Math.PI/5*2;

  this.gl = gl;

  // Pentagon Vertex Buffer
  this.starVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.starVertexBuffer);
  var vertices = new Float32Array([
      0.0,  0.0, 0.0,
      0.0,  rBig, 0.0,
      rSmall*Math.cos(phiBaseSmall + 2 * phiAdd), rSmall*Math.sin(phiBaseSmall + 2 * phiAdd), 0.0,
    -(rSmall*Math.cos(phiBaseSmall + 2 * phiAdd)), rSmall*Math.sin(phiBaseSmall + 2 * phiAdd), 0.0,
      rBig*Math.cos(phiBaseBig + phiAdd), rBig*Math.sin(phiBaseBig + phiAdd), 0.0,
      rSmall*Math.cos(phiBaseSmall - phiAdd), rSmall*Math.sin(phiBaseSmall - phiAdd), 0.0,
      rBig*Math.cos(phiBaseBig + 2*phiAdd), rBig*Math.sin(phiBaseBig + 2*phiAdd), 0.0,
      rSmall*Math.cos(phiBaseSmall), rSmall*Math.sin(phiBaseSmall), 0.0,
      rBig*Math.cos(phiBaseBig + 3*phiAdd), rBig*Math.sin(phiBaseBig + 3*phiAdd), 0.0,
      rSmall*Math.cos(phiBaseSmall + phiAdd), rSmall*Math.sin(phiBaseSmall + phiAdd), 0.0,
      rBig*Math.cos(phiBaseBig - phiAdd), rBig*Math.sin(phiBaseBig - phiAdd), 0.0,
    ]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var vertices = new Array(33);
  // center vertex set to blue
  vertices[0] = 1.0;
  vertices[1] = 1.0;
  vertices[2] = 1.0;
  for (var i = 3; i < 33; i++) {
    vertices[i] = Math.random();
  }

  this.vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.STATIC_DRAW);

  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([
      0, 1, 2,
      0, 1, 3,
      0, 3, 4,
      0, 4, 5,
      0, 5, 6,
      0, 6, 7,
      0, 7, 8,
      0, 8, 9,
      0, 9, 10,
      0, 2, 10
    ]),
    gl.STATIC_DRAW);
};

StarGeometry.prototype.draw = function() {
  let gl = this.gl;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.starVertexBuffer);
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
  gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0); 
 };
