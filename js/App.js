var app;
var overlay;
var pendingResources = {};

// App constructor
var App = function(canvas) {
	this.keysPressed = {};
	this.mousePressed = [false, [null, null]]
	//keys pressed
	document.onmousedown = function(event){
        var x = event.pageX;
        var y = event.pageY;
        x = (x - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - y) / (canvas.height / 2);
        app.mousePressed[0] = true;
        app.mousePressed[1] = [x, y];
	}
	document.onmouseup = function(event){
		app.mousePressed[0] = false;
	}


	document.onkeydown= function(event){
		app.keysPressed[keyboardMap[event.keyCode]]=true;
	}
	document.onkeyup = function(event){
		app.keysPressed[keyboardMap[event.keyCode]]=false;
	}

	// set a pointer to our canvas
	this.canvas = canvas;
	
	// if no GL support, cry
	this.gl = canvas.getContext("experimental-webgl");
	if (this.gl == null) {
		alert( ">>> Browser does not support WebGL <<<" );
		return;
	}
	
	// set the initial canvas size and viewport
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

	// create a simple scene
	this.scene = new Scene(this.gl);

	//camera resize shit
	window.addEventListener('resize', function() {
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		this.scene.camera.setAspectRatio(this.canvas.clientWidth / this.canvas.clientHeight );
	});
}

// animation frame update
App.prototype.update = function() {
	
	var pendingResourceNames = Object.keys(pendingResources);
	if(pendingResourceNames.length === 0) {
		// animate and draw scene
		this.scene.update(this.gl,app.keysPressed, app.mousePressed);
		overlay.innerHTML = "Ready.";
	} else {
		overlay.innerHTML = "Loading: " + pendingResourceNames;
	}

	// refresh
	window.requestAnimationFrame(function() {
		app.update();
	});
}

// entry point from HTML
window.addEventListener('load', function() {

	var canvas = document.getElementById("canvas");
	overlay = document.getElementById("overlay");
	overlay.innerHTML = "WebGL";

	app = new App(canvas);

	window.requestAnimationFrame(function() {
		app.update();
	});

});
