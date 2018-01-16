"use strict";

let WebGeometry = function(gl) {
  this.gl = gl;
  // Web Vertex Buffer
  this.webVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.webVertexBuffer);
  let vertices = [0, 0, 0];
  var x, y, t = 0;
  for (var i = 0; i < 20; i++) {
    x = (6*Math.cos(t) + Math.cos(6*t))/17;
    y = (6*Math.sin(t) - Math.sin(6*t))/17;
    vertices.push(x);
    vertices.push(y);
    vertices.push(0);
    t += Math.PI/10;
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Web Color Buffer
  var colors = new Array(63);
  // center vertex set to white
  colors[0] = 1.0;
  colors[1] = 1.0;
  colors[2] = 1.0;
  for (var i = 3; i < 63; i++) {
    colors[i] = .5;
  }

  this.vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors),gl.STATIC_DRAW);
  
  // Web Index Buffer
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

WebGeometry.prototype.draw = function() {
  let gl = this.gl;

  gl.bindBuffer(gl.ARRAY_BUFFER, this.webVertexBuffer);
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



