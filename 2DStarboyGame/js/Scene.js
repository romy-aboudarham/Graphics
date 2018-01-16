"use strict";
let Scene = function(gl) {
  this.vsTrafo = new Shader(gl, gl.VERTEX_SHADER, "trafo_vs.essl");
  this.vsBackground = new Shader(gl, gl.VERTEX_SHADER, "background_vs.essl");  
  this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured_fs.essl");
  this.texturedProgram = new TexturedProgram(gl, this.vsTrafo, this.fsTextured);
  this.backgroundProgram = new TexturedProgram(gl, this.vsBackground, this.fsTextured);  

  this.quadGeometry = new TexturedQuadGeometry(gl);

  this.start = false;
  this.hold = false;
  this.startCount = true;
  this.score = 0;
  this.gamePoints = 1;
  this.currBullets = 0;

  this.gameObjects = [];
  this.erasers = [];
  this.doodlemies = [];
  this.titles = [];
  this.points = [1];

  this.backgroundMaterial = new Material(gl, this.backgroundProgram);
  this.backgroundMaterial.colorTexture.set(new Texture2D(gl, "media/binder.png"));
  this.backgroundMesh = new Mesh(this.quadGeometry, this.backgroundMaterial);
  this.background = new GameObject( this.backgroundMesh );
  this.gameObjects.push(this.background);

  this.raiderMaterial = new Material(gl, this.texturedProgram);
  //this.raiderMaterial.colorTexture.set(new Texture2D(gl, "media/transstarboy.png"));
  this.raiderMaterial.colorTexture.set(new Texture2D(gl, "media/transStarHat.png"));
  this.raiderMesh = new Mesh(this.quadGeometry, this.raiderMaterial);
  this.avatar = new GameObject( this.raiderMesh );

  this.avatar.texScale = new Vec2(.3333333333333333333333333333334, .64);

  this.avatar.scale = new Vec3 (1, 1.8, 1);
  this.avatar.position.x = -14.0;
  this.avatar.radius = 1.8;
  this.gameObjects.push(this.avatar);

  this.blueWhaleMaterial = new Material(gl, this.texturedProgram);
  this.blueWhaleMaterial.colorTexture.set(new Texture2D(gl, "media/transBlueWhale.png"));
  this.blueWhaleMesh = new Mesh(this.quadGeometry, this.blueWhaleMaterial);

  this.pinkWhaleMaterial = new Material(gl, this.texturedProgram);
  this.pinkWhaleMaterial.colorTexture.set(new Texture2D(gl, "media/transpinkWhale.png"));
  this.pinkWhaleMesh = new Mesh(this.quadGeometry, this.pinkWhaleMaterial);

  this.eraserMaterial = new Material(gl, this.texturedProgram);
  this.eraserMaterial.colorTexture.set(new Texture2D(gl, "media/transEraser.png"));
  this.eraserMesh = new Mesh(this.quadGeometry, this.eraserMaterial);

  this.eraserLifeMaterial = new Material(gl, this.texturedProgram);
  this.eraserLifeMaterial.colorTexture.set(new Texture2D(gl, "media/transLifeEraser.png"));
  this.eraserLifeMesh = new Mesh(this.quadGeometry, this.eraserLifeMaterial);

  //Title
  this.titleMaterial = new Material(gl, this.texturedProgram);
  this.titleMaterial.colorTexture.set(new Texture2D(gl, "media/transTitle.png"));
  this.titleMesh = new Mesh(this.quadGeometry, this.titleMaterial);
  this.startTitle = new GameObject( this.titleMesh );
  this.startTitle.scale = new Vec3 (8, 8, 8);
  this.startTitle.position.x = this.avatar.position.x + 9.0;
  this.titles.push(this.startTitle);

    //Instruction
  this.instMaterial = new Material(gl, this.texturedProgram);
  this.instMaterial.colorTexture.set(new Texture2D(gl, "media/transInstr.png"));
  this.instMesh = new Mesh(this.quadGeometry, this.instMaterial);
  this.instruction = new GameObject( this.instMesh );
  this.instruction.scale = new Vec3 (8, 8, 8);
  this.instruction.position.x = this.avatar.position.x+9.0;
  this.titles.push(this.instruction);

  this.lives = new GameObject( this.eraserMesh );
  this.lives.scale = new Vec3 (1.5, 1.5, 1.5);
  this.gameObjects.push(this.lives);
  this.lives.position.set(this.avatar.position.x-7.5, this.avatar.position.y + 9.5);

  this.sx = 0;
  this.sy = 0;
  this.ssize = 1;
  this.iter = 0;

  let genericMove = function(t, dt){
    this.gravity = 0.009;
    this.position.y += this.velocityY * t;
    this.velocityY -= this.gravity * t;
    //this.momentum.addScaled(dt, this.force);
    //this.angularMomentum += this.torque;  
    //this.position.addScaled(dt*this.invMass, this.momentum);
    //this.orientation += dt*this.angularMomentum*this.invAngularMass;
  };

  this.avatar.backDrag = 0.9;
  this.avatar.sideDrag = 0.5;
  this.avatar.angularDrag = 0.5;
  this.avatar.control = function(t, dt, keysPressed, gameObjects){
    // PRACTICAL TODO
    let thrust = 0;
    this.torque = 0;
    if (keysPressed.UP && !this.hold) {
      //thrust = 120;
      this.velocityY = .20;
      this.hold = true;
      
    } else if (!keysPressed.UP && this.hold) {
      this.hold = false;
    }

    let ahead = new Vec3(Math.sin(this.orientation), Math.cos(this.orientation), 0.0);
    // split ahead vector to vector ahead and slide
    let momAhead = ahead.times(ahead.dot(this.momentum)); 
    let momSide = this.momentum.minus(momAhead);
    // 
    momSide.mul(Math.pow(this.sideDrag, dt));
    momAhead.mul(Math.pow(this.backDrag, dt));
    // combine them back
    this.momentum.set().add(momAhead).add(momSide);

    this.force = ahead.times(thrust); 
  };  
  this.avatar.move = genericMove;

  this.camera = new OrthoCamera();

  this.timeAtLastFrame = new Date().getTime();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

};

Scene.prototype.restart = function() { 
    this.erasers = [];
    this.doodlemies = [];
    this.currBullets = 0;
    clearInterval(this.score);
    clearInterval(this.enemies);
    this.start = false;
    this.titles[0].position.x = this.avatar.position.x + 9.0;
    this.titles[1].position.x = this.avatar.position.x + 9.0;
    this.startCount = true;
    this.gamePoints = 1;
    this.points = [1];
    this.hold = false;
    this.avatar.position.y = 0;
};


Scene.prototype.update = function(gl, keysPressed, overlay) {
  //jshint bitwise:false
  //jshint unused:false
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;

  //this.overlay = overlay;
  this.overlay = document.getElementById("overlay");
  this.bullets = document.getElementById("bullets");
  this.bullets.innerHTML = this.currBullets;
  // clear the screen
  gl.clearColor(0.6, 0.0, 0.3, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  if (keysPressed.S && !this.start) {
      this.start = true;
      this.avatar.velocityY = .30;
      this.gamePoints = 1;
  } 

  if (this.start) {
    // SCORE
    if (this.startCount) {
      this.counter();
      this.createDoodlemies();
      this.startCount = false;
    } 
    if (this.avatar.position.y >= this.camera.windowSize.y/2 || this.avatar.position.y <= -this.camera.windowSize.y/2) {
      this.restart();
    }
    if (keysPressed.SPACE && !this.hold && this.currBullets > 0) {
      this.shoot(keysPressed, this.gameObjects);
      this.hold = true;
    } else if (!keysPressed.SPACE && this.hold) {
      this.hold = false;
    }

    if (this.avatar.velocityY > this.avatar.gravity) {
    this.avatar.texCurr = new Vec2(this.sx, 0); ////
        if (this.iter < 3) {
          this.sx = this.sx+.3333333333333333333333333333334;
          this.iter++;
        } else {
        this.sx = 0;
        this.iter = 0;
    }
  }

    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].control(timeAtThisFrame, dt, keysPressed, this.gameObjects);
    }

    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].move(timeAtThisFrame/1000000000000.0, dt);
    }

    for (let i = 0; i < this.erasers.length; i++) {
      this.erasers[i].move(timeAtThisFrame/1000.0, dt);
    }
    for (let i = 0; i < this.doodlemies.length; i++) {
      this.doodlemies[i].move(timeAtThisFrame/1000.0, dt);
    }

    this.camera.position.x += .09;
    this.avatar.position.x += .09;
    this.lives.position.x += .09;
  }

  this.camera.updateViewProjMatrix();
  Material.viewProjMatrixInverse.set(this.camera.viewProjMatrix).invert();


  for (let i = 0; i < this.gameObjects.length; i++) {
    this.gameObjects[i].draw(this.camera);
  }

  for (let i = 0; i < this.erasers.length; i++) {
     if (this.erasers[i].position.x <= this.avatar.position.x + this.camera.windowSize.x) {
          this.erasers[i].draw(this.camera);
      } else {
        this.erasers.splice(i,1);
      }
  }

  for (let i = 0; i < this.doodlemies.length; i++) {
      if (this.doodlemies[i].position.x >= this.avatar.position.x - this.camera.windowSize.x) {
        if (Math.sqrt(Math.pow((this.doodlemies[i].position.x-this.avatar.position.x), 2) + Math.pow((this.doodlemies[i].position.y-this.avatar.position.y), 2)) < this.avatar.radius) {
           if (this.doodlemies[i].life) {
              this.doodlemies.splice(i,1);
              this.bullets.innerHTML = this.currBullets++;
           } else {
              this.restart();
           }
        } else if (this.hit(this.doodlemies[i])) {
            this.doodlemies.splice(i,1);
            this.gamePoints += 100;
        } else {
          this.doodlemies[i].draw(this.camera);
        }
      } else {
        this.doodlemies.splice(i,1);
      }
  }
  if (!this.start && !keysPressed.I) {
    this.titles[0].draw(this.camera);
  } else if (keysPressed.I) {
    this.titles[1].draw(this.camera);
  }
};

Scene.prototype.createDoodlemies = function () {
  let blueWhaleMesh = this.blueWhaleMesh;
  let eraserLifeMesh = this.eraserLifeMesh;
  let pinkWhaleMesh = this.pinkWhaleMesh;
  let camera = this.camera;
  let doodlemies = this.doodlemies;
  let avatar = this.avatar;
  let currSpeed = .05;
  let count = 1;
  let scale = 2;
  
  this.enemies = setInterval(function(){
    // Speed up whales every 10 points
    if (count == 10) {
        //currSpeed += .03;
        scale += 1.05;
        count = 1;
    }
    count++;
    let doodlemy;
    let obj = Math.floor(Math.random() * 2) + 1;
    if (obj == 1) { // blue whale
      doodlemy = new GameObject(blueWhaleMesh);
    }
    if (obj == 2) { // pink whale
      doodlemy = new GameObject(pinkWhaleMesh);
    }
    doodlemy.position.set(avatar.position.x + 35, Math.random()*16 - 8);
    let s = Math.random()*2 + scale;
    doodlemy.scale = new Vec3 (s, s, s);
    doodlemy.speed = currSpeed + Math.random()*.08;
    let doodlemyMove = function(t, dt) {
      this.position.x -= this.speed;
    }

    doodlemy.move = doodlemyMove;
    doodlemies.push(doodlemy);
  }, 1000);

  this.life = setInterval(function(){
    let lifeMove = function(t, dt) {
      let speed = .2;
      this.position.x -= speed;
    }

    let life = new GameObject(eraserLifeMesh);
    life.position.set(avatar.position.x + 30, Math.random()*16 - 8);
    life.move = lifeMove;
    life.life = true;

    life.scale = new Vec3 (1.4, 1.4, 1.4);
    doodlemies.push(life);
  }, 10000);
}

Scene.prototype.counter = function() {
    var gamePoints = this.gamePoints;
   // let point = this.points;
    this.score = setInterval(function() {
      this.overlay.innerHTML = "Score: " + gamePoints++;
      //point.push(i);
      }, 100);
} 

Scene.prototype.shoot = function(gl, keysPressed, gameObjects) { 
    let eraserMove = function(t, dt){
      this.position.x += .3;
    };

    let eraser = new GameObject(this.eraserMesh);
    eraser.scale = new Vec3 (1.3, 1.3, 1.3);
    eraser.position.set(this.avatar.position);
    eraser.radius = 1.3;

    this.erasers.push(eraser);
    eraser.move = eraserMove;
    this.currBullets--;
};

Scene.prototype.hit = function(doodlemy) {
  for (let i = 0; i < this.erasers.length; i++) {
    let dist = Math.sqrt(Math.pow((doodlemy.position.x - this.erasers[i].position.x), 2) + Math.pow((doodlemy.position.y - this.erasers[i].position.y), 2));
    if (dist < 1.5) {
      this.erasers.splice(i,1);
      return true;
    }
  }
  return false;
}

