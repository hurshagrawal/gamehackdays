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
monsters.GRAVITY = 600;
monsters.JUMP = 1200;
monsters.BOUNCE = .02;
monsters.FRICTION = .5;
monsters.JUMPTIMEOUT = .5;

monsters.jumping = false;

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
	
	//----CREATE FLOOR(S)---
	var borderThickness = 20;
	
    var floorBody = world.CreateBody(createBox(0,
							monsters.HEIGHT - borderThickness,
							monsters.WIDTH,
							borderThickness*.6,
							monsters.BOUNCE,
							null));

    var floor = (new lime.Sprite)
        .setFill(0,100,0)
	    .setSize(monsters.WIDTH, borderThickness);
    layer.appendChild(floor);

	floorBody.m_shapeList.m_friction = monsters.FRICTION;

    var ceilingBody = world.CreateBody(createBox(0,0,
							monsters.WIDTH,
							borderThickness,
							monsters.BOUNCE,
							null));

    var ceiling = (new lime.Sprite)
        .setFill(0,100,0)
	    .setSize(monsters.WIDTH, borderThickness);
    layer.appendChild(ceiling);

    var leftWallBody = world.CreateBody(createBox(0,
							borderThickness+1,
							borderThickness,
							monsters.HEIGHT - 2*(borderThickness+1),
							monsters.BOUNCE,
							null));

    var leftWall = (new lime.Sprite)
          .setFill(0,100,0)
    	  .setSize(borderThickness, monsters.HEIGHT);
      layer.appendChild(leftWall);
    
      var rightWallBody = world.CreateBody(createBox(
    							monsters.WIDTH - borderThickness,
    							borderThickness+1,
    							borderThickness,
    							monsters.HEIGHT - 2*(borderThickness+1),
    							monsters.BOUNCE,
								null));
    
      var rightWall = (new lime.Sprite)
          .setFill(0,100,0)
    	  .setSize(borderThickness, monsters.HEIGHT);
      layer.appendChild(rightWall);

      var platformOneBody = world.CreateBody(createBox(
    							borderThickness,
    							monsters.HEIGHT*.6,
    							monsters.WIDTH/4,
    							borderThickness*.6,
    							monsters.BOUNCE,
								null));
    
      var platformOne = (new lime.Sprite)
          .setFill(0,100,0)
    	  .setSize(monsters.WIDTH/4, borderThickness);
      layer.appendChild(platformOne);
	  platformOneBody.m_shapeList.m_friction = monsters.FRICTION;


      var platformTwoBody = world.CreateBody(createBox(
    							monsters.WIDTH*(3/4) - borderThickness,
    							monsters.HEIGHT*.6,
    							monsters.WIDTH/4,
    							borderThickness*.6,
    							monsters.BOUNCE,
								null));
    
      var platformTwo = (new lime.Sprite)
          .setFill(0,100,0)
    	  .setSize(monsters.WIDTH/4, borderThickness);
      layer.appendChild(platformTwo);
	  platformTwoBody.m_shapeList.m_friction = monsters.FRICTION;
	

      var platformThreeBody = world.CreateBody(createBox(
    							monsters.WIDTH*.33,
    							monsters.HEIGHT*.35,
    							monsters.WIDTH/3,
    							borderThickness*.6,
    							monsters.BOUNCE,
								null));
    
      var platformThree = (new lime.Sprite)
          .setFill(0,100,0)
    	  .setSize(monsters.WIDTH/3, borderThickness);
      layer.appendChild(platformThree);

  	  platformThreeBody.m_shapeList.m_friction = monsters.FRICTION;
	

	//----CREATE CHARACTER----
	var img = new Image();
	img.src = "images/dragon.png"; //randomize, at some point
	var scale = 0.4; //randomize, at some point
		
	var playerBody = world.CreateBody(createBox(monsters.WIDTH/2,
												monsters.HEIGHT*.8,
												img.width*scale,
												img.height*scale,
												monsters.BOUNCE,10));

	playerBody.m_shapeList.m_friction = monsters.FRICTION;
	
    var player = (new lime.Sprite)
        .setFill(img.src)
	    .setSize(img.width, img.height)
		.setScale(scale);
    layer.appendChild(player);
	
	// ----INPUT EVENT HANDLERS----

	var leftDown = false;
	var rightDown = false;
	var moveDir = null;
	var shootDown = false;
	
	goog.events.listen(scene,['keydown'],function(e){
		if (e.event.keyCode == 37) { //if "LEFT" is pressed 
			leftDown = true;
			moveDir = "left";
		} else if (e.event.keyCode == 39) { //if "RIGHT" is pressed 
			rightDown = true;
			moveDir = "right";
		} 
		
		if (e.event.keyCode == 32 && !monsters.JUMPING) { //if "SPACE" is pressed
			monsters.JUMPING = true;
			var t = setTimeout("restoreJump()", monsters.JUMPTIMEOUT*1000);
			var force = new box2d.Vec2(0, -1000000*monsters.JUMP);
			playerBody.ApplyForce(force, playerBody.GetOriginPosition());
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
	var pos = floorBody.GetCenterPosition().clone();
    floor.setPosition(pos);
	pos = ceilingBody.GetCenterPosition().clone();
    ceiling.setPosition(pos);
	pos = leftWallBody.GetCenterPosition().clone();
	    leftWall.setPosition(pos);
	pos = rightWallBody.GetCenterPosition().clone();
	    rightWall.setPosition(pos);
	pos = platformOneBody.GetCenterPosition().clone();
    	platformOne.setPosition(pos);
	pos = platformTwoBody.GetCenterPosition().clone();
    	platformTwo.setPosition(pos);
	pos = platformThreeBody.GetCenterPosition().clone();
	    platformThree.setPosition(pos);


	//DRAW DYNAMIC ITEMS
	lime.scheduleManager.schedule(function(dt) {
        world.Step(dt / 1000, 3);
		var speed = Math.abs(playerBody.m_linearVelocity.x);
		
		//LR KEY INPUT
		if (moveDir == "right") {
			if (speed < 550) {
				var force = new box2d.Vec2(50000000, 0);
				playerBody.ApplyForce(force, playerBody.GetOriginPosition());
			}
		} else if (moveDir == "left") {
			if (speed < 550) {
				var force = new box2d.Vec2(-50000000, 0);
				playerBody.ApplyForce(force, playerBody.GetOriginPosition());
			}
		}
		//REDRAW POSITION
       	var pos = playerBody.GetCenterPosition().clone();
        player.setPosition(pos);		
    },this);

}
//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('monsters.start', monsters.start);

function createBox(xpos, ypos, width, height, bounciness, density) {
		//create box in BOX
	    var box = new box2d.PolyDef;
		box.restitution = bounciness;
		box.density = 0;
		box.friction = 0;
		if (density) box.density = density;
	//	box.extents.Set(30, 10);//box version
		w = width/2;
		h = height/2;
	    box.SetVertices([[-w,-h],[w,-h],[w,h],[-w,h]]);

	    var gbodyDef = new box2d.BodyDef;
	    gbodyDef.position.Set(xpos + w, ypos + h);
	    gbodyDef.AddShape(box);
	    return gbodyDef;
}

function createCircle(xpos, ypos, width, height, bounciness, density) {
		//create box in BOX
	    var box = new box2d.CircleDef;
		box.restitution = bounciness;
		box.density = 0;
		box.friction = 0;
		if (density) box.density = density;
	//	box.extents.Set(30, 10);//box version
		box.radius = ((width+height)/4);

	    var gbodyDef = new box2d.BodyDef;
	    gbodyDef.position.Set(xpos + w, ypos + h);
	    gbodyDef.AddShape(box);
	    return gbodyDef;
}

function restoreJump() {
	monsters.JUMPING = false;
};