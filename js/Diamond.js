var Diamond = function(position, gl, program){

	this.bigQuadgeo = new QuadGeometry(gl);
	this.bigQuadMaterial = new Material(gl, program);
	this.bigQuadTexture = new Texture2D(gl, "js/res/leancup2.png");
	this.bigQuadMaterial.colorTexture.set(this.bigQuadTexture);  
	this.Mesh = new Mesh(this.bigQuadgeo, this.bigQuadMaterial);
	GameObject2D.call(this, this.Mesh);
	this.position = position;
	this.type="diamond";
	this.isVisible = true;
	this.scale.set(1/15, 1/15, 1/15);
	
}

Diamond.prototype = new GameObject2D();

Diamond.prototype.Draw = function(camera){

	if (this.isVisible){
		this.updateModelTransformation();
		this.draw(camera);
	}
	
}

Diamond.prototype.detectCollision = function(gameobject){
	if (gameobject.type == "lander"){
		xLeft = gameobject.position.x - 0.2;
		xRight = gameobject.position.x + 0.2;
		yTop = gameobject.position.y + 0.2;
		yBot = gameobject.position.y - 0.2;
		if (this.isVisible && (xLeft <= this.position.x && this.position.x <= xRight &&
			yBot <= this.position.y && this.position.y <= yTop	)){
			this.isVisible = false;
			gameobject.DiamondsCollected += 1;	
			console.log(gameobject.DiamondsCollected);
		}
	}
	else if (gameobject.type == "platform"){
		if (this.position.x <= gameobject.Right && this.position.x >= gameobject.Left && this.position.y -.1 <= gameobject.Top && this.position.y -.1 >= gameobject.Bottom){
			console.log("COLLISION!");
	

	}
}

}
