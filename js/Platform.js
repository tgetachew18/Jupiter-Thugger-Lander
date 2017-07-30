var Platform = function(position, gl, program){
	this.isBouncy = true;
	//Platform
	this.bigQuadgeo = new QuadGeometry(gl);
	this.bigQuadMaterial = new Material(gl, program);
	this.bigQuadTexture = new Texture2D(gl, "js/res/platform.png");
	this.bigQuadMaterial.colorTexture.set(this.bigQuadTexture);  
	this.Mesh = new Mesh(this.bigQuadgeo, this.bigQuadMaterial);

	GameObject2D.call(this, this.Mesh);
	this.type = "platform";
	this.scale.set(0.3, 0.05, 0.1 ,0.1);
	this.position = position;
	//Left Cap
	this.smallGeo = new QuadGeometry(gl);
	this.capMaterial = new Material(gl, program);
	this.capTexture = new Texture2D(gl, "js/res/platformend.png");
	this.capMaterial.colorTexture.set(this.capTexture);  
	this.capMesh = new Mesh(this.smallGeo, this.capMaterial);
	this.leftCap = new GameObject2D(this.capMesh);
	this.leftCap.scale.set(0.04, 0.05, 0.04, 0.04);

	//Right Cap
	this.rightCap = new GameObject2D(this.capMesh);
	this.rightCap.scale.set(0.04, 0.05, 0.04, 0.04);
	this.rightCap.orientation = Math.PI;

	this.Left =  this.position.x - 0.3;
	this.Right = this.position.x + 0.3;
	this.Top = this.position.y + 0.05;
	this.Bottom = this.position.y - 0.05;


	

}

Platform.prototype = new GameObject2D();

Platform.prototype.Draw = function(camera){
    this.leftCap.position = new Vec3(this.position.x - .34, this.position.y, this.position.z);
     this.rightCap.position = new Vec3(this.position.x + .34, this.position.y, this.position.z);
	this.updateModelTransformation();
	this.leftCap.updateModelTransformation();
	this.rightCap.updateModelTransformation();
	this.leftCap.draw(camera);
	this.rightCap.draw(camera);
	this.draw(camera);


}


	