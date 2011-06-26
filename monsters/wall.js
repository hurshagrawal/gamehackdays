goog.provide('monsters.Wall');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.World');
goog.require('lime.Sprite');

monsters.Wall = function(xpos, ypos, width, height) {
	goog.base(this);
	
	//create ground in BOX
    var ground = new box2d.PolyDef;
	ground.restitution = .9
	ground.density = 0;
	ground.friction = 1;
//	ground.extents.Set(30, 10);//box version
	w = width/2;
	h = height/2;
    ground.SetVertices([[-w,-h],[w,-h],[w,h],[-w,h]]); // actually not a box

    var gbodyDef = new box2d.BodyDef;
    gbodyDef.position.Set(xpos, ypos);
    gbodyDef.AddShape(ground);
    var ground_body = world.CreateBody(gbodyDef);

    var box = (new lime.Sprite)
        .setFill(0,100,0)
	    .setSize(width, height);
    layer.appendChild(box);
}
goog.inherits(monsters.Wall, lime.Sprite);

