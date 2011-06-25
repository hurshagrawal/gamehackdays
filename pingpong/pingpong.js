//set main namespace
goog.provide('pingpong');


//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Sprite');

goog.require('pingpong.Player');
goog.require('pingpong.Ball');
goog.require('pingpong.Wall');

// entrypoint
pingpong.start = function(){

	var director = new lime.Director(document.body,600,480),
	    scene = new lime.Scene(),
		
		floor_ = new lime.Layer().setPosition(0,0),
		walls_ = new lime.Layer().setPosition(0,0),
		board_ = new lime.Layer().setPosition(0,0),
		
		playerOne = new pingpong.Player().setPosition(40, 240)
										 .setRotation(180)
										 .setMovementBounds(20,600,460,20),
		playerTwo = new pingpong.Player().setPosition(560,240)
										 .setMovementBounds(20,600,460,20),
		ball = new pingpong.Ball().setPosition(320,240)
		                          .setMovementBounds(20,620,460,20)
		                          .setVelocity(.2)
		                          .setResetPosition(320,240);
		
		
	floor_.appendChild(new lime.Sprite().setPosition(150, 240)
										.setSize(300,480)
										.setFill(100,100,100));
	
	floor_.appendChild(new lime.Sprite().setPosition(450, 240)
										.setSize(300,480)
										.setFill(200,200,200));
	
	// horizontal walls
	for (x = 10; x <= 630; x += 20) {
	    walls_.appendChild(new pingpong.Wall().setPosition(x, 10));
	    walls_.appendChild(new pingpong.Wall().setPosition(x, 470));
	}
	// vertical walls
	for (y = 30; y <= 450; y += 20) {
	    walls_.appendChild(new pingpong.Wall().setPosition(10, y));
	    walls_.appendChild(new pingpong.Wall().setPosition(590, y));
	}
	
	
	scene.appendChild(floor_);
	scene.appendChild(walls_);
	scene.appendChild(board_);
	scene.appendChild(playerOne);
	scene.appendChild(playerTwo);
	scene.appendChild(ball);
	
	//GAME LOGIC
	
	//moves the paddles
	goog.events.listen(floor_,['mousedown','touchstart'],function(e) {
		var player_ = (e.position.x <= 300) ? playerOne : playerTwo;
		player_.runAction(
			new lime.animation.MoveTo(
				player_.alignBounds(
					player_.getPosition().x,e.position.y))
							  .setDuration(1));
	});
	
	var hitPos_;
	lime.scheduleManager.schedule(function(dt){
	    if (hitPos_ = ball.updateAndCheckHit(dt, playerOne, playerTwo)) {
	       console.log('player',(hitPos_.x <= 320) ? 1 : 2,'is a loser');
	    };
	},ball);
	
	
	
	
	// set current scene active
	director.replaceScene(scene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('pingpong.start', pingpong.start);
