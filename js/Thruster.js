var Thruster = function(Lander){
	GameObject2D.call(this, mesh);
	this.thrustAcc = 10;
	this.acc0 = {x: 0, y: -0.5};
	this.acceleration.x = 0;
	this.acceleration.y = -0.5;
	this.position.y = 1;


}

Lander.prototype = new GameObject2D();

Lander.prototype.force = function(keysPressed){
	
	if (keysPressed["LEFT"] ){
		this.acceleration.x = this.acc0.x - this.thrustAcc;
	}
	if (keysPressed["RIGHT"]){
		this.acceleration.x = this.acc0.x + this.thrustAcc;
	}
	if (keysPressed["LEFT"] == false && keysPressed["RIGHT"] == false){
		this.acceleration.x = this.acc0.x;
	}
	if (keysPressed["UP"] ){
		this.acceleration.y = this.acc0.y + this.thrustAcc;
	}

	if (keysPressed["UP"] == false){
		this.acceleration.y = this.acc0.y;//acc0.y;
	}

}