var Lander = function(gl, program){

	//Big Lander
	this.gl = gl;
	this.program = program;
	this.bigQuadgeo = new QuadGeometry(gl);
	this.bigQuadMaterial = new Material(gl, program);
	this.bigQuadTexture = new Texture2D(gl, "js/res/lander.png");
	this.bigQuadMaterial.colorTexture.set(this.bigQuadTexture);  
	this.Mesh = new Mesh(this.bigQuadgeo, this.bigQuadMaterial);

	this.DiamondsCollected = 0;

	GameObject2D.call(this, this.Mesh);
	this.type = "lander";
	this.scale.set(1/4, 1/4, 1/4);
	this.thrustAcc = 5;
	this.angular_acceleration  = 0;
	this.orientation = 0;

	this.position.y = 1;

	//Thruster 1
	this.smallGeo = new QuadGeometry(gl);
	this.thMaterial = new Material(gl, program);
	this.thTexture = new Texture2D(gl, "js/res/afterburner.png");
	this.thMaterial.colorTexture.set(this.thTexture);
	this.thMesh = new Mesh(this.smallGeo, this.thMaterial);
	this.thrusterOne = new GameObject2D(this.thMesh);
	this.thrusterOne.position.x += .75;
	this.thrusterOne.position.y += .3;
	this.thrusterOne.scale = .2;
	this.thrusterOneActive = false;


	//Thruster 2
	this.thrusterTwo = new GameObject2D(this.thMesh);
	this.thrusterTwo.scale = .3;
	this.thrusterTwo.position.x -= .6;
	this.thrusterTwo.position.y += .40;
	this.thrusterTwo.orientation= Math.PI;
	this.thrusterTwoActive = false;

	//Thruster 3
	this.thrusterThree = new GameObject2D(this.thMesh);
	this.thrusterThree.scale = .3;
	this.thrusterThree.position.y -= .95;
	this.thrusterThree.position.x -= .1;
	this.thrusterThree.orientation= Math.PI*1.5;
	this.thrusterThreeActive = false;


}

Lander.prototype = new GameObject2D();

Lander.prototype.Draw = function(camera){
	
	this.updateModelTransformation();

	
	this.thrusterOne.updateModelTransformation();
	this.thrusterTwo.updateModelTransformation();
	this.thrusterThree.updateModelTransformation();
	this.thrusterOne.modelMatrix.mul(this.modelMatrix);
	this.thrusterTwo.modelMatrix.mul(this.modelMatrix);
	this.thrusterThree.modelMatrix.mul(this.modelMatrix);


	
	if (this.thrusterOneActive)
	 	this.thrusterOne.draw(camera);
	if (this.thrusterTwoActive)
		this.thrusterTwo.draw(camera);
	if (this.thrusterThreeActive)
		this.thrusterThree.draw(camera);
	this.draw(camera);
}

Lander.prototype.force = function(keysPressed){
	this.thrusterOneActive = keysPressed["LEFT"];
	this.thrusterTwoActive = keysPressed["RIGHT"];
	this.thrusterThreeActive = keysPressed["UP"];	
	this.leftForce = new Vec3(this.thrustAcc * 0.5* Math.cos(this.orientation), this.thrustAcc *0.5 * Math.sin(this.orientation), 0);
	this.rightForce = this.leftForce.times(-1);
	this.upForce = new Vec3(-1*this.thrustAcc * Math.sin(this.orientation), this.thrustAcc*Math.cos(this.orientation), 0 );
	if (keysPressed["LEFT"] ){
		this.forces["left"] = this.rightForce;
		this.torques["left"] = 0.05;

	}
	if (keysPressed["RIGHT"]){
		this.forces["right"] = this.leftForce;
		this.torques["right"] = -0.05;
	}
	if (keysPressed["LEFT"] == false){
		this.forces["left"] = new Vec3(0,0,0);
		this.torques["left"] = 0;
		
	}

	if (keysPressed["RIGHT"] == false){
		this.forces["right"] = new Vec3(0,0,0);
		this.torques["right"] = 0;
	}
	if (keysPressed["UP"] ){
		this.forces["up"] = this.upForce;
	}

	if (keysPressed["UP"] == false){
		this.forces["up"] = new Vec3(0,0,0);//acc0.y;
	}

}




Lander.prototype.detectCollision = function(platform){
	if (this.position.x <= platform.Right && this.position.x >= platform.Left && this.position.y -.22 <= platform.Top && this.position.y -.22 >= platform.Bottom){
		this.forces["normal"] = new Vec3(0, -1*this.gravity.y, 0);
		this.angular_velocity = 0;
		if (platform.isBouncy){
			this.velocity.y *= -2	;
		}
		else{
			
			this.velocity = new Vec3(0, 0, 0);}
	}
	else{
		this.forces["normal"] = new Vec3(0, 0, 0);
	}

}

