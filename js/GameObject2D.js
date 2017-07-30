
var GameObject2D = function(mesh) { 
  this.mesh = mesh;

  this.position = new Vec3(0, 0, 0);   
  this.velocity = new Vec3(0, 0, 0);
  this.acceleration = new Vec3(0, 0, 0);
  this.angular_velocity = 0; // rad/s
  this.angular_acceleration = 0;
  this.gravity = new Vec3(0, -1, 0);
  this.mass = 1;
  this.dragCoeff = 2;
  this.hasDrag = true;
  this.forces = {"gravity":this.gravity, "drag" : new Vec3(0, 0, 0)};
  this.torques = {"gravity":0};
  this.orientation = 0; 
  this.scale = new Vec3(1, 1, 1); 
  
  this.modelMatrix = new Mat4(); 
  this.type = null;

  this.updateModelTransformation();

  
};

GameObject2D.prototype.updateModelTransformation = function(){
	this.modelMatrix.set().scale(this.scale).rotate(this.orientation).translate(this.position);

};		


GameObject2D.prototype.draw = function(camera){ 

  Material.shared.modelViewProjMatrix.set().mul(this.modelMatrix).mul(camera.viewProjMatrix);

  this.mesh.draw(); 
};

GameObject2D.prototype.findForcesTorques = function(){

	if (this.hasDrag){
		var oppVec = new Vec3(0, 0, 0);
		if (!(this.velocity.x == 0 && this.velocity.y == 0 && this.velocity.z == 0))
			oppVec = this.velocity.direction().times(-1);
		var drag = oppVec.times(this.velocity.length2()).times(this.dragCoeff);
		this.forces["drag"] = drag;

		//this.torques["gravity"] = this.gravity.y * this.mass * Math.cos(this.orientation);
	}
}

GameObject2D.prototype.move = function(dt){
	this.findForcesTorques();
	netAcceleration = new Vec3(0,0,0);
	netAngularAcceleration = 0;

	for (var key in this.forces){
		if (this.forces.hasOwnProperty(key)){
				netAcceleration.add( this.forces[key].times(1/this.mass) );}
	}

	this.velocity.addScaled(dt, netAcceleration );
	this.position.addScaled(dt, this.velocity);



	for (var key in this.torques){
		if (this.torques.hasOwnProperty(key)){
				netAngularAcceleration += this.torques[key]/this.mass;

		}
	}

	this.angular_velocity += dt * netAngularAcceleration;
	this.orientation += dt* this.angular_velocity;


}



