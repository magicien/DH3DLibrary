// (C) 2012 shin <s2pch.luck@gmail.com>
(function() {

	// constant
	var WIDTH = 300;
	var HEIGHT = 300;
	var CAMERA_SPEED = 30.0;
	var CAMERA_ANGLE_SPEED = 10.0;

	// variables for DH3DLibrary
	var pmdObject, canvasField, camera, renderer, light, key, animator;
	// resources
	var model, motion;
	
	// first init
	var init = function(canvasElem) {
		canvasElem.width = WIDTH;
		canvasElem.height = HEIGHT;
		canvasField = new CanvasField(canvasElem);
		model = ModelBank.getModel("./res/miku_mp.pmd");
		motion = MotionBank.getMotion("./res/miracle_paint.vmd");
		new ObjectLoadMonitor([model, motion], {onload: init2});
	};

	// called after loading resources in `init`
	var init2 = function() {
		pmdObject = new DH3DObject();
		// camera
		camera = new Camera();
		camera.bind(pmdObject);
		camera.setBindOffset(0, 10.0, 0);
		camera.perspective(45.0, 1.0, 10.0, 1000.0);
		camera.distance = 35;
		camera.bindYAngle = Math.PI;
		// light
		light = new Light();
		light.setPosition(30, 70, 100);
		light.setAmbient(0.6, 0.6, 0.6, 0.0);
		light.setDiffuse(0.7, 0.7, 0.7, 0.0);
		light.setSpecular(0.9, 0.9, 0.9, 0.0);
		// renderer
		renderer = new SimpleRenderer(canvasField.getContext(), camera);
		renderer.setLight(light);
		// canvas field
		canvasField.setCamera(camera);
		canvasField.addObject(pmdObject);
		canvasField.setFrameCallback(update);
		// animator
		animator = new MMDAnimator();
		// main object
		pmdObject.setModel(model);
		pmdObject.setMotion(motion);
		pmdObject.setAnimationTime(0);
		pmdObject.setAnimator(animator);
		pmdObject.setAnimating(true);
		pmdObject.setLoop(false);
		pmdObject.setRenderer(renderer);
		pmdObject.setPosition(0, 0, 0);
		// input
		key = new KeyListener();
		key.setKeyDownCallback(function(event) {
			update(0.01);
			draw();
		});
		
		// first drawing
		draw();
		// start animation
		canvasField.start();
	};

	var update = function(elapsedTime) {
		if (key.getKeyState("J")) {
			camera.bindYAngle -= CAMERA_ANGLE_SPEED * elapsedTime;
		} else if (key.getKeyState("L")) {
			camera.bindYAngle += CAMERA_ANGLE_SPEED * elapsedTime;
		} else if (key.getKeyState("I")) {
			camera.distance -= CAMERA_SPEED * elapsedTime;
		} else if (key.getKeyState("K")) {
			camera.distance += CAMERA_SPEED * elapsedTime;
		}
		key.resetKeyNewState();
	};
	
	var draw = function() {
		canvasField.drawOneFrame();
	};
	
	//-------------------------------------
	
	// entry point
	this.addEventListener("load", function() {
		init(document.getElementById("mmd"));
	});

}).call(this);




