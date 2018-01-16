"use strict";

let Scene = function(gl) {
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.timeAtLastFrame = new Date().getTime();
  // TEXTURE STUFF
  this.vsTexture = new Shader(gl, gl.VERTEX_SHADER, "tex_vs.essl");
  this.fsTexture = new Shader(gl, gl.FRAGMENT_SHADER, "tex_fs.essl");
  this.textureProgram = new TextureProgram(gl, this.vsTexture, this.fsTexture);

  // Objects
  this.squareGeometry = new QuadGeometry(gl);
  this.starGeometry = new StarGeometry(gl);
  this.heartGeometry = new HeartGeometry(gl);
  this.circleGeometry = new CircleGeometry(gl);
  this.webGeometry = new WebGeometry(gl);

  // Objects
  this.quadTexGeometry = new TexturedQuadGeometry(gl);
  
  // Create Texture Geo
  this.texMaterial = new Material(gl, this.textureProgram);
  this.texMaterial.colorTexture.set(new Texture2D(gl, "/media/asteroid.png"));

  this.texMesh = new Mesh(this.quadTexGeometry, this.texMaterial);

  // Array of GameObjects
  this.gameObjects = [[],[]];

  // Materials
  this.starMaterial = new Material(gl, this.solidProgram);
  this.greenSquareMaterial = new Material(gl, this.solidProgram);
  this.greenSquareMaterial.solidColor.set(.2, .9, .1);
  this.webMaterial = new Material(gl, this.solidProgram);
  this.webMaterial.solidColor.set(.3, 0, .9);
  this.heartMaterial = new Material(gl, this.solidProgram);
  this.heartMaterial.solidColor.set(.5, 0, .1);
  this.blueSquareMaterial = new Material(gl, this.solidProgram);
  this.clickSquareMaterial = new Material(gl, this.solidProgram);
  this.clickSquareMaterial.solidColor.set(.9, .9, 0);
  this.circleMaterial = new Material(gl, this.solidProgram);

  // Meshes
  this.starMesh = new Mesh(this.starGeometry, this.starMaterial);
  this.heartMesh = new Mesh(this.heartGeometry, this.heartMaterial);
  this.greenSquareMesh = new Mesh(this.squareGeometry, this.greenSquareMaterial);
  this.webMesh = new Mesh(this.webGeometry, this.webMaterial);
  this.blueSquareMesh = new Mesh(this.squareGeometry, this.blueSquareMaterial);
  this.clickSquareMesh = new Mesh(this.squareGeometry, this.clickSquareMaterial);
  this.circleMesh = new Mesh(this.circleGeometry, this.circleMaterial);

  // Create SLOWPOKE
  this.slopeMat1 = new Material(gl, this.textureProgram);
  this.slopeMat1.colorTexture.set(new Texture2D(gl, "/media/slowpoke/YadonDh.png"));
  this.slopeMat2 = new Material(gl, this.textureProgram);
  this.slopeMat2.colorTexture.set(new Texture2D(gl, "/media/slowpoke/YadonEyeDh.png"));
  this.materials = [];
  this.materials.push(this.slopeMat1);
  this.materials.push(this.slopeMat2);
  this.multiMesh = new MultiMesh(gl,"/media/slowpoke/Slowpoke.json", this.materials);

  // Create a new board with numCols = 10 & numRows = 10
  this.board = [];

  // Create Board Background
  this.material = new Material(gl, this.solidProgram);
  this.mesh = new Mesh(this.squareGeometry, this.material);
  this.bg = new GameObject(this.mesh);
  this.bg.scale = new Vec3(52, 52, 1); 
  this.bg.position = new Vec3(4.5, 4.5, 0); 

  for (var i = 0; i < 10; i++)
    this.gameObjects[i] = new Array(10);

  // Build Board col, row
  for (var i = 0; i < 10; i++) {
    this.board[i] = new Array(10);
      for (var j = 0; j < 10; j++) {
          this.blueSquareMaterial = new Material(gl, this.solidProgram);
          this.blueSquareMesh = new Mesh(this.squareGeometry, this.blueSquareMaterial);
          this.tile = new GameObject(this.blueSquareMesh);
          this.tile.scale = new Vec3(5, 5, 1);
          this.tile.position = new Vec3(i, j, 0);
          this.board[i][j] = this.tile;
          this.getGem(i, j);
      }
  }
  this.quakeCount = 0;
  this.camera = new OrthoCamera();
  
};

Scene.prototype.update = function(gl, keysPressed) {
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.heartMaterial.time.add(3*dt);

  // ROTATE LEFT
  if (keysPressed.A) {
    this.camera.rotation = this.camera.rotation - .1;
    this.camera.updateViewProjMatrix(); 
  }

  // ROTATE RIGHT
  if (keysPressed.D) {
    this.camera.rotation = this.camera.rotation + .1;
    this.camera.updateViewProjMatrix(); 
  }

  // QUAKE
  // can quake up to 3 times (for infinite time lol)
  if (keysPressed.Q && this.quakeCount < 3) {
    this.quake(timeAtThisFrame);
  } else { // Reset Camera 
    this.camera.position = new Vec2(4, 4); 
    this.camera.updateViewProjMatrix(); 
  }

  // Set Bomb
  if (keysPressed.B) {
    this.boom = true;
  } else {
    this.boom = false;
  }

  // Draw Background
  this.bg.draw(this.camera);

  // Draw Board
  for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board.length; j++) {
        this.board[i][j].draw(this.camera);
      }
  }

  // MOVE GEMS
  this.fall();

  gl.enable(gl.BLEND);
  gl.blendFunc(
  gl.SRC_ALPHA,
  gl.ONE_MINUS_SRC_ALPHA);


  // Draw Objects
  for (var i = 0; i < this.gameObjects.length; i++) {
      for (var j = 0; j < this.gameObjects.length; j++) {
        if (this.gameObjects[i][j] != undefined){
          if (this.gameObjects[i][j].gemType == "star") {
            this.gameObjects[i][j].orientation = this.gameObjects[i][j].orientation + .05;
          }
          if (this.gameObjects[i][j].status == "exploded") {
            this.shrink(this.gameObjects[i][j]);
          }
        }
        if (this.gameObjects[i][j] != undefined){
          this.gameObjects[i][j].draw(this.camera);
        } 
      }
  }

 // this.img.draw(this.camera);
  this.textureProgram.commit();
  this.solidProgram.commit();
};

Scene.prototype.fall = function() {
  // traverse though each tile in a column from the 
  // bottom to the top and feather fall each tile down one
  for (var col = 0; col < this.gameObjects.length; col++) {
    for (var row = 0; row < this.gameObjects.length; row++) {
      if (this.gameObjects[col][row] == undefined && this.gameObjects[col][row+1] != undefined) {
      // feather fall
        if (this.gameObjects[col][row+1].position.y > row) {
          this.gameObjects[col][row+1].position.y -= .1;
        } else {
          this.gameObjects[col][row+1].position.y = Math.abs(Math.round(this.gameObjects[col][row+1].position.y));
          var temp = this.gameObjects[col][row+1];
          this.gameObjects[col][row] = temp;
          this.gameObjects[col][row+1] = undefined;
        }
      }
      if (this.gameObjects[col][row] == undefined && row == this.gameObjects.length-1) {
        this.getGem(col, row);
      }
    }
  } 
}

/* Quake
 * Shake camera using the time at this frame. 
 * Removes a random gem with 10% probability
*/
Scene.prototype.quake = function(time) {
  var A = 1;
  var s = A*Math.sin(2*Math.PI*Math.pow(10,8)*time/2) + 4;
  this.camera.position = new Vec2(s, 4); 
  this.camera.updateViewProjMatrix(); 

  var obj = Math.floor(Math.random() * 10) + 1;
  if (obj == 1) {
    var randx = Math.floor(Math.random() * 9);
    var randy = Math.floor(Math.random() * 9);
    if (this.gameObjects[randx][randy] != undefined)
      this.removeObj(randx, randy);
  }
}

/* shrink
 * remove specified gem from game objects array by
 * "shrinking" it by adjusting the scale and orientation
 */
Scene.prototype.shrink = function(object) {
  if (object.scale.x > 0 && object.scale.y > 0) {
    object.scale.sub(new Vec3(.06, .06, 0));
    object.orientation = object.orientation + .25;
  } else if (object.position.y < 8.5) {
      this.gameObjects[Math.round(object.position.x)][Math.round(object.position.y)] = undefined;
  } else {
    this.getGem(Math.round(object.position.x), 9);
  }
}

/* getGem
 * place a randomly generated gem at a specific location in the game objects array
 */
Scene.prototype.getGem = function(x, y) {
  var obj = Math.floor(Math.random() * 5) + 1;
          if (obj == 1) {
            this.gameobject = new GameObject(this.starMesh);
            this.gameobject.gemType = "star";
            this.gameobject.position = new Vec3(x, y, 0);
            this.gameobject.scale = new Vec3(1.5, 1.5, 1); 
            this.gameObjects[x][y] = this.gameobject;
          }
          if (obj == 2) {
            this.gameobject = new GameObject(this.greenSquareMesh);
            this.gameobject.gemType = "diamond";
            this.gameobject.position = new Vec3(x, y, 0);
            this.gameobject.orientation = Math.PI/4;
            this.gameobject.scale = new Vec3(2.6, 2.6, 1); 
            this.gameObjects[x][y] = this.gameobject;

          }
          if (obj == 3) {
            this.gameobject = new GameObject(this.heartMesh);
            this.gameobject.gemType = "heart";
            this.gameobject.position = new Vec3(x, y, 0);
            this.gameobject.scale = new Vec3(2.5, 2.5, 2.5); 
            this.gameObjects[x][y] = this.gameobject;

          }
           if (obj == 4) {
            this.gameobject = new GameObject(this.circleMesh);
            this.gameobject.gemType = "circle";
            this.gameobject.position = new Vec3(x, y, 0);
            this.gameobject.scale = new Vec3(3, 3, 1); 
            this.gameObjects[x][y] = this.gameobject;
          }
          if (obj == 5) {
            this.gameobject = new GameObject(this.texMesh);
            this.gameobject.gemType = "asteroid";
            this.gameobject.position = new Vec3(x, y, 0);
            this.gameobject.scale = new Vec3(.4, .4, 1); 
            this.gameObjects[x][y] = this.gameobject;
          }
}

/* removeObj
 * this function is called when we want to "remove" a gem
 * at a specified index in the game objects array
 * This function doesn't actually remove the gem, but rather
 * updates the status so we know to shrink it when drawing it
 */
Scene.prototype.removeObj = function(x, y) {
    this.gameObjects[x][y].status = "exploded";
}

/* mouseClicked
 * handles all clicking events
 */
Scene.prototype.mouseClicked = function(mouse) {
  if (this.checkRange(mouse)) {

    this.clicked = true;
    this.removeHighlight(mouse);

    if (this.boom) {
      this.removeObj(mouse.startX, mouse.startY);
    }
  } else {
    this.clicked = false;
  }
}

/* mouseUp
 * handles mouse up events: swaps and validates the swap
 */
Scene.prototype.mouseUp = function(mouse) {
  var x = Math.round(mouse.x);
  var y = Math.round(mouse.y);
  var xo = Math.round(mouse.startX);
  var yo = Math.round(mouse.startY);
  
  if (this.clicked) {
    this.clicked = false;
    // check if gem dragged to an adjacent cell, swap if yes and check the swap
    if (x != xo || y != yo && this.checkRange(mouse)) { 
      this.swap(mouse);
      if (this.checkSwap(mouse)) { // if swap necessary
      }
      else {
        this.swap(mouse);
      }
    } else { // snap back to center of cell
       this.gameObjects[xo][yo].position = new Vec3(xo, yo, 0) ;
    }
    this.highlight(mouse);
  }
}

/* mouseMoved 
 * sets position of gem to mouse simulates drags
 */
Scene.prototype.mouseMoved = function(mouse) {
  if (this.clicked) {
      if (this.checkRange(mouse)) {
        this.gameObjects[mouse.startX][mouse.startY].position = new Vec3(mouse.x, mouse.y, 0);
      }
  }
}

/* swap
 * swaps the gem at the cell clicked on and the cell released on
 */
Scene.prototype.swap = function(mouse) {
  var temp = this.gameObjects[mouse.x][mouse.y];
  this.gameObjects[mouse.x][mouse.y].position = new Vec3(Math.round(mouse.startX), Math.round(mouse.startY), 0);
  this.gameObjects[mouse.x][mouse.y] = this.gameObjects[Math.round(mouse.startX)][Math.round(mouse.startY)];
  this.gameObjects[Math.round(mouse.startX)][Math.round(mouse.startY)].position = new Vec3(mouse.x, mouse.y, 0);
  this.gameObjects[Math.round(mouse.startX)][Math.round(mouse.startY)] = temp;
}

/* checkSwap 
 * searches the neighbors of the gem that we want to swap with
 * Returns true if we can swap to make 3 or more in a row
 */
Scene.prototype.checkSwap = function(mouse) {
  var gemToSwap = this.gameObjects[mouse.startX][mouse.startY];
  var currGem = this.gameObjects[Math.round(mouse.x)][Math.round(mouse.y)];

  // search above neighbors
  var count = 0;
  for (var row = currGem.position.y; row < this.gameObjects.length; row++){
    if (this.gameObjects[currGem.position.x][row].gemType == currGem.gemType) {
      count++;
    } else break;
  } 
  if (count > 2) return true;
  // search below neighbors
  var count = 0;
  for (var row = currGem.position.y; row >= 0; row--){
    if (this.gameObjects[currGem.position.x][row].gemType == currGem.gemType) {
      count++;
    } else break;
  }
  if (count > 2) return true;
  // search right neighbors
  var count = 0;
  for (var col = currGem.position.x; col < this.gameObjects.length; col++){
    if (this.gameObjects[col][currGem.position.y].gemType == currGem.gemType) {
      count++;
    } else break;
  } 
  if (count > 2) return true;
  // search left neighbors
  var count = 0;
  for (var col = currGem.position.x; col >= 0; col--){
    if (this.gameObjects[col][currGem.position.y].gemType == currGem.gemType) {
      count++;
    } else break;
  }
  if (count > 2) return true;
  // search right and left
  var count = 0;
  for(var col = currGem.position.x-1; col >= 0 && col < this.gameObjects.length; col++) {
    if (this.gameObjects[col][currGem.position.y].gemType == currGem.gemType) {
      count++;
    } else break;
  }
  if (count > 2) return true;
  // search up and down
  var count = 0;
  for(var row = currGem.position.y-1; row >= 0 && row < this.gameObjects.length; row++) {
    if (this.gameObjects[currGem.position.x][row].gemType == currGem.gemType) {
      count++;
    } else break;
  } 
  if (count > 2) return true;
}

/* updateQuakeCount
 * increment quake count
 */
Scene.prototype.updateQuakeCount = function() {
  this.quakeCount++;
}

/* checkRange - very ugly code
 * checks mouse position and returns true or false
 */
Scene.prototype.checkRange = function(mouse) {
  var x = mouse.x;
  var y = mouse.y;
  var xo = Math.round(mouse.startX);
  var yo = Math.round(mouse.startY);
  if (x <= this.gameObjects.length - .5 && y <= this.gameObjects.length - .5
    && x > -.5 && y > -.5) { // is on board
    if (xo < 10 && xo >= 0 && yo < 10 && yo >= 0) {
      if (mouse.x <= xo + .2 && mouse.x >= xo - .2 ) {
        if (mouse.y >= yo - 1 && mouse.y <= yo + 1) {
          return true;
        }
      } else if (mouse.y <= yo + .2 && mouse.y >= yo - .2) {
        if (mouse.x >= xo - 1 && mouse.x <= xo + 1) {
          return true;
        }
    } else {
      return false;
      }
  } else {
    return false;
    } 
  } else {
    return false;
  }
}

/* highlight
 * replaces the current blue (default) block
 * in the board array where mouse clicked with highlighted yellow square
 */
Scene.prototype.highlight = function(mouse) {
  this.tile = new GameObject(this.blueSquareMesh);
  this.tile.scale = new Vec3(5, 5, 1);
  this.tile.position = new Vec3(Math.round(mouse.startX), Math.round(mouse.startY), 0);
  this.board[Math.round(mouse.startX)][Math.round(mouse.startY)] = this.tile;
}

/* removeHighlight
 * replaces the current yellow (highlighted) block
 * in the board array where mouse clicked with default blue square
 */
Scene.prototype.removeHighlight = function(mouse) {
  this.tile = new GameObject(this.clickSquareMesh);
  this.tile.scale = new Vec3(5, 5, 1);
  this.tile.position = new Vec3(mouse.startX, mouse.startY, 0);
  this.board[mouse.startX][mouse.startY] = this.tile;
  this.gameObjects[mouse.startX][mouse.startY].position = new Vec3(mouse.x, mouse.y, 0);
}
