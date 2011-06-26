//set main namespace
goog.provide('monsters');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.World');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');

monsters.HEIGHT = 400;
monsters.WIDTH = 800;
monsters.GRAVITY = 300;

monsters.start = function(){

	//----LIME INITIALIZATION----
	var director = new lime.Director(document.body,monsters.WIDTH,monsters.HEIGHT);
	director.makeMobileWebAppCapable();
	
	var scene = new lime.Scene();
	var layer = new lime.Layer().setPosition(0,0);
	scene.appendChild(layer);
			
	// set current scene active
	director.replaceScene(scene);
	
	//----BOX 2D INITIALIZATION----
	var gravity = new box2d.Vec2(0, monsters.GRAVITY);
	var bounds = new box2d.AABB();
	bounds.minVertex.Set(-monsters.WIDTH, -monsters.HEIGHT);
	bounds.maxVertex.Set(2*monsters.WIDTH, 2*monsters.HEIGHT);
	var world = new box2d.World(bounds, gravity, false);
	
	//----CREATE FLOOR---
	var borderThickness = 20;
    var physicsFloor = world.CreateBody(createBox(0,
							monsters.HEIGHT - borderThickness,
							monsters.WIDTH,
							borderThickness,
							.3,null));

    var floor = (new lime.Sprite)
        .setFill(0,100,0)
	    .setSize(monsters.WIDTH, borderThickness);
    layer.appendChild(floor);

	//----CREATE BLOCK----
	var img = new Image();
	img.src = "images/dragon.png"; //randomize, at some point
	var scale = 0.4; //randomize, at some point
		
	var physicsBlock = world.CreateBody(createBox(200,100,
												  img.width*scale,
												  img.height*scale,.3,10));
	
    var block = (new lime.Sprite)
        .setFill(img.src)
	    .setSize(img.width, img.height)
		.setScale(scale);
    layer.appendChild(block);
	
	// ----INPUT EVENT HANDLERS----

	var leftDown = false;
	var rightDown = false;
	var moveDir = null;
	var shootDown = false;
	
	goog.events.listen(scene,['keydown'],function(e){
		if (e.event.keyCode == 37) { //if "LEFT" is pressed 
			//block.setFill(155,155,155,.5);
			leftDown = true;
			moveDir = "left";
		} else if (e.event.keyCode == 39) { //if "RIGHT" is pressed 
			rightDown = true;
			moveDir = "right";
		}
		//console.log(e.event.keyCode);
	});
	
	goog.events.listen(scene,['keyup'],function(e){
		if (e.event.keyCode == 37) { //LEFT
			leftDown = false;
			if (rightDown) moveDir = "right";
			else moveDir = null;
		} else if (e.event.keyCode == 39) { //RIGHT
			rightDown = false;
			if (leftDown) moveDir = "left";
			else moveDir = null;
		}
	});

	
	//DRAW STATIC ITEMS
	var pos = physicsFloor.GetCenterPosition().clone();
    floor.setPosition(pos);
	
	//DRAW DYNAMIC ITEMS
	lime.scheduleManager.schedule(function(dt) {
        world.Step(dt / 1000, 3);

		//REDRAW POSITION
       	var pos = physicsBlock.GetCenterPosition().clone();
        var rot = physicsBlock.GetRotation();
        block.setRotation(-rot/Math.PI*180);
        block.setPosition(pos);		
    },this);

}
//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('monsters.start', monsters.start);

function createBox(xpos, ypos, width, height, bounciness, density) {
		//create ground in BOX
	    var ground = new box2d.PolyDef;
		ground.restitution = bounciness;
		ground.density = 0;
		ground.friction = 1;
		if (density) ground.density = density;
	//	ground.extents.Set(30, 10);//box version
		w = width/2;
		h = height/2;
	    ground.SetVertices([[-w,-h],[w,-h],[w,h],[-w,h]]); // actually not a box

	    var gbodyDef = new box2d.BodyDef;
	    gbodyDef.position.Set(xpos + w, ypos);
	    gbodyDef.AddShape(ground);
	    return gbodyDef;
}
