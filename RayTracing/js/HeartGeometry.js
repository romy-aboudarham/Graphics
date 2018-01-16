"use strict";

let HeartGeometry = function(gl) {
  this.gl = gl;
  // Heart Vertex Buffer
  this.heartVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.heartVertexBuffer);
  let vertices = [0, 0, 0];
  var x, y, t = 0;
  for (var i = 0; i < 20; i++) {
    x = .16*Math.pow(Math.sin(t), 3);
    y = .13*Math.cos(t)-.05*Math.cos(2*t)-.02*Math.cos(3*t)-.01*Math.cos(4*t);
    vertices.push(x);
    vertices.push(y);
    vertices.push(0);
    t += Math.PI/10;
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Heart Color Buffer
  var colors = new Array(63);
  // center vertex set to blue
  colors[0] = 1.0;
  colors[1] = .9;
  colors[2] = .9;
  for (var i = 3; i < 63; i++) {
    colors[i] = .2;
  }

  this.vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors),gl.STATIC_DRAW);
  
  // Heart Index Buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  var indexArray = [];
  for (var i = 0; i < 20; i++) { 
    indexArray.push(0);
    indexArray.push(i+1);
    indexArray.push(i+2);
  }
  indexArray.pop();
  indexArray.push(1);

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
};

HeartGeometry.prototype.draw = function() {
  let gl = this.gl;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.heartVertexBuffer);
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
  gl.drawElements(gl.TRIANGLES, 60, gl.UNSIGNED_SHORT, 0); 
 }



