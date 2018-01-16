"use strict";

let Scene = function(gl) {
  this.timeAtLastFrame = new Date().getTime();
  /* ---------- Shaders ---------- */
  this.vsTexture = new Shader(gl, gl.VERTEX_SHADER, "tex_vs.essl");
  this.fsTexture = new Shader(gl, gl.FRAGMENT_SHADER, "tex_fs.essl");
  this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.vsShadow = new Shader(gl, gl.VERTEX_SHADER, "shadow_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid_fs.essl");
  this.fsTextureMarble = new Shader(gl, gl.FRAGMENT_SHADER, "texMarble_fs.essl");
  /* ---------- Programs ---------- */
  this.shadowProgram = new Program(gl, this.vsShadow, this.fsSolid);
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.textureProgram = new TextureProgram(gl, this.vsTexture, this.fsTexture);
  this.textureMarbleProgram = new TextureProgram(gl, this.vsTexture, this.fsTextureMarble);
  this.quadTexGeometry = new TexturedQuadGeometry(gl);

  // Array of GameObjects
  this.objects = [];
  this.objectShadows = [];

  // Create SLOWPOKE
  this.slopeMat1 = new Material(gl, this.textureProgram);
  this.slopeMat1.colorTexture.set(new Texture2D(gl, "/media/slowpoke/YadonDh.png"));
  this.slopeMat2 = new Material(gl, this.textureProgram);
  this.slopeMat2.colorTexture.set(new Texture2D(gl, "/media/slowpoke/YadonEyeDh.png"));
  this.materials = [];
  this.materials.push(this.slopeMat1);
  this.materials.push(this.slopeMat2);

  this.treeMat = new Material(gl, this.textureProgram);
  this.treeMat.colorTexture.set(new Texture2D(gl, "/media/json/tree.png"));
  this.treeMaterial = [];
  this.treeMaterial.push(this.treeMat);
  this.treeMaterial.push(this.treeMat);

  // Create Marble Slowpoke
  this.marbleMaterial = [];
  this.marbleMat = new Material(gl, this.textureMarbleProgram);
  this.marbleMaterial.push(this.marbleMat);
  this.marbleMaterial.push(this.marbleMat);

  this.groundMaterial = new Material(gl, this.textureProgram);
  this.groundMaterial.colorTexture.set(new Texture2D(gl, "/media/json/ground.png"));

  /* ---------- Meshes ---------- */
  this.slopeMultiMesh = new MultiMesh(gl,"/media/slowpoke/Slowpoke.json", this.materials);
  this.mainRotorMultiMesh = new MultiMesh(gl,"/media/json/heli/mainrotor.json", this.materials);
  this.marbleMultiMesh = new MultiMesh(gl,"/media/slowpoke/Slowpoke.json", this.marbleMaterial);
  this.treeMultiMesh = new MultiMesh(gl,"/media/json/tree.json", this.treeMaterial);
  this.groundMesh = new Mesh(this.quadTexGeometry, this.groundMaterial);
  
  /* ---------- Shadows ---------- */
  this.shadowMaterials = [];
  this.slopeShaderMaterial = new Material(gl, this.shadowProgram);
  this.slopeShaderMaterial.solidColor.set(0, 0, 0);
  this.shadowMaterials.push(this.slopeShaderMaterial);
  this.shadowMaterials.push(this.slopeShaderMaterial);

  /* ---------- GAME OBJECTS ---------- */
  // Trees
  this.treeObjects = [];
  var x, y, z;
  for (var i = 0; i < 50; i++) {
    this.tree = new GameObject(this.treeMultiMesh);
    x = Math.floor(Math.random() * 300)-100;
    z = Math.floor(Math.random() * 300)-100;
    this.tree.position = new Vec3(x, 0, z);
    this.tree.scale = new Vec3(1, 2, 1);
    this.objects.push(this.tree);
    // Tree Shadows
    this.treeShadowMesh = new MultiMesh(gl,"/media/json/tree.json", this.shadowMaterials);
    this.treeShadow = new GameObject(this.treeShadowMesh);
    this.treeShadow.position.set(this.tree.position.x,this.tree.position.y, this.tree.position.z, 1);
    this.objectShadows.push(this.treeShadow);
  }
  // Avatar - Slowpoke = slope
  this.slope = new GameObject(this.slopeMultiMesh);
  this.slope.position = new Vec3(25, 0, 25);
  this.slope.orientation = 60;
  this.objects.push(this.slope);
   // Slope Shadow
  this.slopeShadowMesh = new MultiMesh(gl,"/media/slowpoke/Slowpoke.json", this.shadowMaterials);
  this.slopeShadow = new GameObject(this.slopeShadowMesh);
  this.slopeShadow.orientation = 60;
  this.slopeShadow.position.set(this.slope.position.x,this.slope.position.y, this.slope.position.z, 1);
  this.objectShadows.push(this.slopeShadow);
  // Rotor
  this.mainRotor = new GameObject(this.mainRotorMultiMesh);
  this.mainRotor.scale = new Vec3(.3, .3, .3);
  this.objects.push(this.mainRotor);
  // Rotor Shadow
  this.rotorShadowMesh = new MultiMesh(gl,"/media/json/heli/mainrotor.json", this.shadowMaterials);
  this.rotorShadow = new GameObject(this.rotorShadowMesh);
  this.rotorShadow.position.set(this.slope.position.x, this.slope.position.y + 7, this.slope.position.z, 1);
  this.rotorShadow.scale = new Vec3(.3, .3, .3);
  this.objectShadows.push(this.rotorShadow);
  // Marble 
  this.marbleSlope = new GameObject(this.marbleMultiMesh);
  this.marbleSlope.position = new Vec3(15, 0, 15);
  // Ground
  this.ground = new GameObject(this.groundMesh);

  /* ---------- Light Sources ---------- */
  this.lightSources = new LightSource();
  // Sun
  this.lightSources.position.at(0).set(1,2.5,1,0);
  // Point Light
  this.lightSources.position.at(1).set(this.slope.position.x-2,this.slope.position.y+2, this.slope.position.z, 1);
  // Power Density 
  // Sun
  this.lightSources.powerDensity.at(0).set(10,10,10);
  // Point Light
  this.lightSources.powerDensity.at(1).set(100,100,100);
  // Light Direction
  this.lightSources.lightDirection.at(0).set(0, 1, 1);

  this.camera = new PerspectiveCamera();
};

Scene.prototype.update = function(gl, keysPressed) {
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000;
  this.timeAtLastFrame = timeAtThisFrame;

  // clear the screen
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

/*
  gl.enable(gl.BLEND);
  gl.blendFunc(
  gl.SRC_ALPHA,
  gl.ONE_MINUS_SRC_ALPHA);
*/
  this.move(dt, keysPressed);
  this.camera.followAvatar(this.slope);
// this.mainRotor.draw(this.camera, this.lightSources);
 // this.slope.draw(this.camera, this.lightSources);
 // this.slopeShadow.drawShadows(this.camera, this.lightSources);
  this.marbleSlope.draw(this.camera, this.lightSources);

  for (var i = 0; i < this.treeObjects.length; i++) {
    this.treeObjects[i].draw(this.camera, this.lightSources);
  }

  for (var i = 0; i < this.objects.length; i++) {
    this.objects[i].draw(this.camera, this.lightSources);
  }

  for (var i = 0; i < this.objectShadows.length; i++) {
    this.objectShadows[i].drawShadows(this.camera, this.lightSources);
  }

  if (this.slope.position.y <= 0) {
    this.slope.onGround = true;
  } else {
    this.slope.onGround = false;
  }

  gl.enable(gl.DEPTH_TEST);
  
  this.ground.draw(this.camera, this.lightSources);
 
  //this.textureProgram.commit();
  this.solidProgram.commit();
};

Scene.prototype.move = function(dt, keysPressed) {
  this.slope.move(dt, keysPressed);
  this.mainRotor.orientation += .2;
  this.rotorShadow.orientation = this.mainRotor.orientation;
  this.mainRotor.position = new Vec3(this.slope.position.x, this.slope.position.y + 7, this.slope.position.z);
  this.lightSources.position.at(1).set(this.slope.position.x-2,this.slope.position.y+2, this.slope.position.z, 1);
  this.slopeShadow.position.set(this.slope.position.x,this.slope.position.y, this.slope.position.z, 1);
  this.rotorShadow.position.set(this.slope.position.x,this.slope.position.y, this.slope.position.z, 1);
  this.slopeShadow.orientation = this.slope.orientation;
}
