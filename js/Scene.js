var Scene = function(gl, output) {

  this.quadPosition = new Vec3(0, 0, 0);
  this.velocity = Vec3(0.1, 0.1, 0.1);
  this.quadRotation = 0;
  this.quadScale = 0;
  this.thrustAcc = .5;
  this.spun = false;
  this.quadGeometry = new QuadGeometry(gl);

  gl.enable(gl.BLEND);
  gl.blendFunc(
  gl.SRC_ALPHA,
  gl.ONE_MINUS_SRC_ALPHA);
  this.audio = new Audio('js/res/audio.mp3');
  this.audio.play();
  



  // in constructor 
  this.vsTrafo2d = new Shader(gl, gl.VERTEX_SHADER, "idle_vs.essl");
  this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "blue_fs.essl"); 
  this.asteroidProgram = new Program(gl, this.vsTrafo2d, this.fsSolid);


  this.landerObject = new Lander(gl, this.asteroidProgram);
  this.gameObjects = [new Platform(new Vec3(-1,-.3,0), gl, this.asteroidProgram), new Platform(new Vec3(.9,-.9,0), gl, this.asteroidProgram)];
  this.gameObjects[1].isBouncy = false;
  this.gameObjects.push(new FireBall(gl, this.asteroidProgram));

  this.camera = new OrthoCamera();
  
  this.timeAtLastFrame = new Date().getTime();
  this.rightEdge = 2;
  this.leftEdge = -2;
  this.bottomEdge = -2;
  this.topEdge = 2;
  this.windowPush = 2;
  this.count = 0;

  this.scoreDiamond = new Diamond(new Vec3(0, this.topEdge - 0.1, 0), gl, this.asteroidProgram); //Create scored diamonds
  this.scoreDiamond.scale.set(1/20, 1/20, 1/20);
  this.background = new Background(gl, this.asteroidProgram, "js/res/youngthug.jpeg");
  this.background2 = new Background(gl, this.asteroidProgram, "js/res/thug2.jpeg");
  this.back3 = new Background(gl, this.asteroidProgram, "js/res/uzi.jpeg");
  this.back3.position.x += 4;
  this.mainBack = this.background;
  for (var i =  0; i < 5; i++){ //Generate falling diamonds
  	var xposition =  Math.random() * (this.rightEdge+1) + this.leftEdge;
  	var diamond = new Diamond(new Vec3(xposition, 1.5, 0), gl, this.asteroidProgram);
  	diamond.velocity.y = xposition;
  	this.gameObjects.push( diamond );
  	
  }

 }

Scene.prototype.update = function(gl, keysPressed, mousePressed) {
	// // set clear color (part of the OpenGL render state)
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// // clear the screen
	gl.clear(gl.COLOR_BUFFER_BIT);  
	this.count += 1;

	var timeAtThisFrame = new Date().getTime();
	var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
	this.timeAtLastFrame = timeAtThisFrame;


	if (this.landerObject.DiamondsCollected >= 5 && !this.spun ){
		this.camera.rotation += .01;
		this.camera.updateViewProjMatrix();
    if (this.camera.rotation > 2 * Math.PI){
      this.spun = true;
      this.camera.rotation = 0;
      this.camera.updateViewProjMatrix();

    }
	}


	// Moving Camera window 
	if (this.landerObject.position.x > this.rightEdge){
			//console.log("outside! "+this.landerObject.position.x);
			this.camera.position.x += this.windowPush;
			this.camera.updateViewProjMatrix();
			this.rightEdge += this.windowPush;
			this.leftEdge += this.windowPush;
	}

	if (this.landerObject.position.x < this.leftEdge){
		this.camera.position.x -= this.windowPush;
		this.camera.updateViewProjMatrix();
		this.leftEdge -= this.windowPush;
		this.rightEdge -= this.windowPush;
	}
	if (this.count % 20 == 0){
		if (this.mainBack == this.background)
			this.mainBack = this.background2;
		else
			this.mainBack = this.background;
	}
	this.mainBack.Draw(this.camera);
  this.back3.Draw(this.camera);
	

	this.landerObject.force(keysPressed);
	this.landerObject.move(dt);
  	this.landerObject.Draw(this.camera);
  	var i = 0;


  	for (i = 0; i < this.gameObjects.length; i++){
  		if (this.gameObjects[i].type == "platform"){
  			this.landerObject.detectCollision(this.gameObjects[i]);

  			this.gameObjects[i].Draw(this.camera);


  		}
  		  		
  		else if (this.gameObjects[i].type == "fireball" ){
  				this.gameObjects[i].move(dt);
  				this.gameObjects[i].Draw(this.camera, mousePressed, this.landerObject.position);
  				
  			}
  		else if (this.gameObjects[i].type == "diamond"){
  				this.gameObjects[i].move(dt);
  				this.gameObjects[i].detectCollision(this.landerObject);	
  				this.gameObjects[i].Draw(this.camera);
  				if (this.gameObjects[i].position.y < this.bottomEdge){
  					var xposition =  Math.random() * (this.rightEdge+1) + this.leftEdge;
  					this.gameObjects[i].position.y = this.topEdge;
  					this.gameObjects[i].position.x = xposition;
  					this.gameObjects[i].isVisible = true;

  					this.gameObjects[i].velocity.mul(Math.random()*1.5);
  				}

  		}
  		else
  		  	    this.gameObjects[i].Draw(this.camera);
  	}


  	for (i = 0; i < this.landerObject.DiamondsCollected; i ++){ //Draw collected diamonds
  		this.scoreDiamond.position.x = this.rightEdge - i*0.15 - .1;
  		this.scoreDiamond.Draw(this.camera);
  		
  	}



}