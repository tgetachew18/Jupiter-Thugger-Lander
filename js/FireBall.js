var FireBall = function(gl, program){

	this.bigQuadgeo = new QuadGeometry(gl);
	this.bigQuadMaterial = new Material(gl, program);
	this.bigQuadTexture = new Texture2D(gl, "js/res/fireball.png");
	this.bigQuadMaterial.colorTexture.set(this.bigQuadTexture);  
	this.Mesh = new Mesh(this.bigQuadgeo, this.bigQuadMaterial);
	GameObject2D.call(this, this.Mesh);
	this.type="fireball";
	this.isVisible = false;
	this.scale.set(1/15, 1/15, 1/15);
	this.fireVelocity = 15;
}

FireBall.prototype = new GameObject2D();

FireBall.prototype.Draw = function(camera, mousePressed, landerPos){
	if (mousePressed[0]){
				var src = new Vec3(landerPos.x, landerPos.y, 0);
				var dst = new Vec3(mousePressed[1][0] + .5, mousePressed[1][1], 0);

				this.position = src;
				this.velocity = dst.minus(src).direction().times(5);
				console.log(dst.x+" "+dst.y);
				
				this.isVisible = true;
				

	}

	if (this.isVisible){
		this.updateModelTransformation();
		this.draw(camera);
	}
	
}

