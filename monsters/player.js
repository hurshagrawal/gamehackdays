goog.provide('monsters.Player');

goog.require('lime.Sprite');

monsters.Player = function() {
	goog.base(this);
	
	this.setFill(255,255,0)
		.setSize(50,50);
		
	this._XVelocity = 0;
	this._YVelocity = 0;
	this._gravity = 0.05;
}
goog.inherits(monsters.Player, lime.Sprite);

monsters.Player.prototype.setXVelocity = function(velocity) {
	if (velocity) this._XVelocity = velocity;
	return this;
};

monsters.Player.prototype.setYVelocity = function(velocity) {
	if (velocity) this._YVelocity = velocity;
	return this;
};

//collision and update velocity
monsters.Player.prototype.updateAndCheckHit = function(dt) {
    var newPos_ = this.getPosition();

	//updates pos every frame based on velocity
    newPos_.x += this._XVelocity * dt;

	this._YVelocity += this._gravity;
    newPos_.y += this._YVelocity * dt;


    
	//updates pos based on calculations
    this.setPosition(newPos_.x, newPos_.y);
    return null;
}