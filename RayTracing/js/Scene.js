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
  this.fsReflect = new Shader(gl, gl.FRAGMENT_SHADER, "reflect_fs.essl");
  this.vsReflect = new Shader(gl, gl.VERTEX_SHADER, "reflect_vs.essl");
  /* ---------- Programs ---------- */
  this.environmentProgram = new TextureProgram(gl, this.vsReflect, this.fsReflect);
  this.shadowProgram = new Program(gl, this.vsShadow, this.fsSolid);
  this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
  this.textureProgram = new TextureProgram(gl, this.vsTexture, this.fsTexture);
  this.textureMarbleProgram = new TextureProgram(gl, this.vsTexture, this.fsTextureMarble);
  this.quadTexGeometry = new TexturedQuadGeometry(gl);

  /* ---------- QUADRICS ---------- */
   /* Cylinder Quadric */
  this.cylinder = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.cylinder.setUnitCylinder();
  /* Top/BottomCylinder Quadric */
  this.disk = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.disk.setTopParaboloid();
  /* Sphere Quadric */
  this.pawnHead = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.pawnHead.setUnitSphere();
  /* Cone Quadric */
  this.pawnBody = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.pawnBody.setCone();
  this.pawnNeck = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.pawnNeck.setUnitSphere();
  this.pawnBottom = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.pawnBottom.setUnitSphere();
   /* Plane Quadric */
  this.board = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.board.setInfinitePlane();
  /* Bishop Quadric */
  this.bishBottom = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.bishBottom.setUnitSphere();
  this.bishNeck = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.bishNeck.setUnitSphere();
  this.bishHead = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.bishHead.setUnitSphere();
  this.bishBody = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.bishBody.setCone();
    /* King Quadric */
  this.kingBottom = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.kingBottom.setUnitSphere();
  this.kingNeck = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.kingNeck.setUnitSphere();
  this.kingHead = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.kingHead.setParaboloid();
  this.kingBody = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.kingBody.setCone();
    /* Queen Quadric */
  this.queenBottom = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.queenBottom.setUnitSphere();
  this.queenNeck = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.queenNeck.setUnitSphere();
  this.queenHead = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.queenHead.setUnitSphere();
  this.queenBody = new ClippedQuadric(new Mat4(), new Mat4()); 
  this.queenBody.setHyperboloid();

  /* ---------- TRANSFORMATIONS ---------- */
  // Pawn Scaling
  this.pawnNeck.transform(new Mat4().scale(.33, .13, .33));
  this.pawnBottom.transform(new Mat4().scale(1, .2, 1));
  this.pawnHead.transform(new Mat4().scale(.4, .4, .4));
  this.pawnBody.transform(new Mat4().scale(.37, .9, .37));
  // Pawn Translating
  this.pawnHead.transform(new Mat4().translate(5, -1.5, 0));
  this.pawnBottom.transform(new Mat4().translate(5, -3.8, 0));
  this.pawnNeck.transform(new Mat4().translate(5, -2, 0));
  this.pawnBody.transform(new Mat4().translate(5, -1.7, 0));
  this.board.transform(new Mat4().translate(0, -4, 0));
   // Bishop Scaling
  this.bishNeck.transform(new Mat4().scale(.58, .18, .58));
  this.bishBottom.transform(new Mat4().scale(1.3, .2, 1.3));
  this.bishBody.transform(new Mat4().scale(.5, 1.2, .5));
  this.bishHead.transform(new Mat4().scale(.4, 1.1, .4));
  // Bishop Translating
  this.bishHead.transform(new Mat4().translate(-5, -1.3, 0));
  this.bishBottom.transform(new Mat4().translate(-5, -3.8, 0));
  this.bishNeck.transform(new Mat4().translate(-5, -1.8, 0));
  this.bishBody.transform(new Mat4().translate(-5, -1, 0));
  // king Scaling
  this.kingNeck.transform(new Mat4().scale(.7, .2, .7));
  this.kingBottom.transform(new Mat4().scale(1.9, .3, 1.9));
  this.kingBody.transform(new Mat4().scale(.8, 2, .8));
  this.kingHead.transform(new Mat4().scale(1, 1, 1));
  // Queen Scaling
  this.queenNeck.transform(new Mat4().scale(1.6, .3, 1.6));
  this.queenBottom.transform(new Mat4().scale(1, .3, 1));
  this.queenBody.transform(new Mat4().scale(.7, 1.5, .7));
  this.queenHead.transform(new Mat4().scale(.7, .7, .7));
  // King Translating
  this.kingHead.transform(new Mat4().translate(-3, 0, -7));
  this.disk.transform(new Mat4().translate(-3, 0, -7));
  this.kingBottom.transform(new Mat4().translate(-3, -3.8, -7));
  this.kingNeck.transform(new Mat4().translate(-3, 0, -7));
  this.kingBody.transform(new Mat4().translate(-3, .6, -7));
  // Queen Translating
  this.queenHead.transform(new Mat4().translate(2, 1, -7));
  this.queenBottom.transform(new Mat4().translate(2, -3.8, -7));
  this.queenNeck.transform(new Mat4().translate(2, .8, -7));
  this.queenBody.transform(new Mat4().translate(2, -2.2, -7));

  // Draw full screen quad
  this.environmentMaterial = new Material(gl, this.environmentProgram);
  this.environmentMaterial.probeTexture.set(new Texture2D(gl, "/probe2017fall1.png"));
  this.environmentMesh = new Mesh(this.quadTexGeometry, this.environmentMaterial);
  this.environment = new GameObject(this.environmentMesh);

   /* ---------- Light Sources ---------- */
  this.lightSources = new LightSource();
  this.lightSources.position.at(0).set(1,5,1,0);
  this.lightSources.powerDensity.at(0).set(10,10,10);
  // Light Direction
  this.lightSources.lightDirection.at(0).set(0, 1, 1);

  this.camera = new PerspectiveCamera();
};

Scene.prototype.update = function(gl, keysPressed) {
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000;
  this.timeAtLastFrame = timeAtThisFrame;

  Material.cameraPos.set(this.camera.position);
  // Pawn
  Material.quadrics.at(0).set(this.pawnHead.surfaceCoeffMatrix);
  Material.quadrics.at(1).set(this.pawnHead.clipperCoeffMatrix);
  Material.quadrics.at(2).set(this.pawnBody.surfaceCoeffMatrix);
  Material.quadrics.at(3).set(this.pawnBody.clipperCoeffMatrix);
  Material.quadrics.at(4).set(this.pawnNeck.surfaceCoeffMatrix);
  Material.quadrics.at(5).set(this.pawnNeck.clipperCoeffMatrix);
  Material.quadrics.at(6).set(this.pawnBottom.surfaceCoeffMatrix);
  Material.quadrics.at(7).set(this.pawnBottom.clipperCoeffMatrix);
  // Bishop
  Material.quadrics.at(8).set(this.bishBody.surfaceCoeffMatrix);
  Material.quadrics.at(9).set(this.bishBody.clipperCoeffMatrix);
  Material.quadrics.at(10).set(this.bishNeck.surfaceCoeffMatrix);
  Material.quadrics.at(11).set(this.bishNeck.clipperCoeffMatrix);
  Material.quadrics.at(12).set(this.bishBottom.surfaceCoeffMatrix);
  Material.quadrics.at(13).set(this.bishBottom.clipperCoeffMatrix);
   // king  
  Material.quadrics.at(14).set(this.kingBottom.surfaceCoeffMatrix);
  Material.quadrics.at(15).set(this.kingBottom.clipperCoeffMatrix);
  Material.quadrics.at(16).set(this.kingBody.surfaceCoeffMatrix);
  Material.quadrics.at(17).set(this.kingBody.clipperCoeffMatrix);
  Material.quadrics.at(18).set(this.kingNeck.surfaceCoeffMatrix);
  Material.quadrics.at(19).set(this.kingNeck.clipperCoeffMatrix);
  Material.quadrics.at(20).set(this.kingHead.surfaceCoeffMatrix);
  Material.quadrics.at(21).set(this.kingHead.clipperCoeffMatrix);
  Material.quadrics.at(22).set(this.disk.surfaceCoeffMatrix);
  Material.quadrics.at(23).set(this.disk.clipperCoeffMatrix);
   // Queen  -12
  Material.quadrics.at(24).set(this.queenBottom.surfaceCoeffMatrix);
  Material.quadrics.at(25).set(this.queenBottom.clipperCoeffMatrix);
  Material.quadrics.at(26).set(this.queenBody.surfaceCoeffMatrix);
  Material.quadrics.at(27).set(this.queenBody.clipperCoeffMatrix);
  Material.quadrics.at(28).set(this.queenNeck.surfaceCoeffMatrix);
  Material.quadrics.at(29).set(this.queenNeck.clipperCoeffMatrix);
  Material.quadrics.at(30).set(this.queenHead.surfaceCoeffMatrix);
  Material.quadrics.at(31).set(this.queenHead.clipperCoeffMatrix);

  Material.multiclipper.at(0).set(this.bishHead.surfaceCoeffMatrix);
  Material.multiclipper.at(1).set(this.bishHead.clipperCoeffMatrix);
  Material.multiclipper.at(2).set(
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0
  );
  Material.multiclipper.at(3).set(this.board.surfaceCoeffMatrix);
  Material.multiclipper.at(4).set(this.board.clipperCoeffMatrix);
  Material.multiclipper.at(5).set(
      1, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, -512
  );


  //material
  Material.brdfs.at(0).set(1, .71, .85, 1.0); // sphere
  Material.brdfs.at(1).set(1, .71, .85, 1.0); // 
  Material.brdfs.at(2).set(1, .71, .85, 1.0); // squish
  Material.brdfs.at(3).set(1, .71, .85, 1.0); // squish
  // Bishop
  Material.brdfs.at(4).set(.3, .71, .4, 0); // sphere
  Material.brdfs.at(5).set(.3, .71, .4, 0); // 
  Material.brdfs.at(6).set(.3, .71, .4, 0); // squish
  // King
  Material.brdfs.at(7).set(0, 0, .49, 0); // sphere
  Material.brdfs.at(8).set(0, 0, .49, 0); // 
  Material.brdfs.at(9).set(0, 0, .49, 0); // squish
  Material.brdfs.at(10).set(0, 0, .49, 0); // squish
  Material.brdfs.at(11).set(0, 0, .49, 0); // squish
  // Queen
  Material.brdfs.at(12).set(1, .71, .85, 0.0); // sphere
  Material.brdfs.at(13).set(1, .71, .85, 2.0); // 
  Material.brdfs.at(14).set(1, .71, .85, 0.0); // squish
  Material.brdfs.at(15).set(1, .71, .85, 0.0); // squish

  Material.multibrdfs.at(0).set(.3, .71, .4, 0);  
  Material.multibrdfs.at(1).set(0, 0, 0, 0); 

  this.bishHead.transform(new Mat4().translate(.09*(Math.cos(timeAtThisFrame/1000)), 0, .09*(Math.sin(timeAtThisFrame/1000))));
  this.bishNeck.transform(new Mat4().translate(.09*(Math.cos(timeAtThisFrame/1000)), 0, .09*(Math.sin(timeAtThisFrame/1000))));
  this.bishBody.transform(new Mat4().translate(.09*(Math.cos(timeAtThisFrame/1000)), 0, .09*(Math.sin(timeAtThisFrame/1000))));
  this.bishBottom.transform(new Mat4().translate(.09*(Math.cos(timeAtThisFrame/1000)), 0, .09*(Math.sin(timeAtThisFrame/1000))));

  this.camera.move(dt, keysPressed);

  this.environment.draw(this.camera, this.lightSources);

  gl.enable(gl.DEPTH_TEST);

  this.solidProgram.commit();
};

