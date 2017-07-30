var Background = function(gl, program, image){

	this.bigQuadgeo = new QuadGeometry(gl);
	this.bigQuadMaterial = new Material(gl, program);
	this.bigQuadTexture = new Texture2D(gl, image);
	this.bigQuadMaterial.colorTexture.set(this.bigQuadTexture);  
	this.Mesh = new Mesh(this.bigQuadgeo, this.bigQuadMaterial);
	GameObject2D.call(this, this.Mesh);
	this.type="fireball";
	this.scale.set(2,2,2,2);
}

Background.prototype = new GameObject2D();

Background.prototype.Draw = function(camera){
	this.updateModelTransformation();
	this.draw(camera);
	
	
}

