importScripts('sorted_array.js', 'vector.js');

var board = new Array();
var gravity = true;
var G = 6.67408e-11;
var coofrest = 0.5;
var collision = true;
var size = undefined;
var paused = true;

onmessage = function(e) {
	let data = e.data;
	let message = data.message;
	if (message == 'start') {
		size = e.data.size;
		paused = false;
		tick();
	} else if (message == 'pause') {
		paused = true;
	} else if (message == 'add') {
		let ball = new Ball(data.x, data.y, data.radius, data.mass, Vector.createDM(data.dir, data.mag), data.color, data.fixed);
		board.push(ball);
	}
}

function Ball(x, y, radius, mass, velocity, color, fixed) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.mass = mass;
	let vel = velocity;
	this.color = parseInt(color);
	this.fixed = fixed;
	this.setXY = function(x, y) {
		if (!this.fixed) {
			this.x = x;
			this.y = y;
		}
	}
	this.getVelocity = function() {
		if (this.fixed)
			return Vector.createXY(0, 0);
		return vel;
	}
	this.setVelocity = function(new_velocity) {
		if (!this.fixed)
			vel = new_velocity;
	}
}

var time = Date.now();

function tick() {
	if (!paused) {
		// list of simplified objects to send to the renderer
		let renderUpdate = new Array(board.length);
		// get delta time to calculate time step for this tick
		let cur_time = Date.now();
		let dt = (cur_time - time) / 1000;
		time = cur_time;
		for (let i = 0; i < board.length; i++) {
			let ball = board[i];
			doPerBallInteractions(i, ball);
			doBallDT(ball, dt);
			doBallEdgeCollision(ball);
			renderUpdate[i] = {
				x: ball.x,
				y: ball.y,
				radius: ball.radius,
				color: ball.color
			};
		}
		if (renderUpdate.length > 0)
			postMessage(renderUpdate);
		setTimeout(tick, Math.min(1, 1 - dt * 1000));
	}
}

function doPerBallInteractions(i, ball) {
	for (let j = i + 1; j < board.length; j++) {
		let ball2 = board[j];
		let vec = Vector.createXY(ball2.x, ball2.y).subtract(Vector.createXY(ball.x, ball.y));
		let mag = Math.max(vec.getMagnitude(), 1e-5);
		if (collision && mag < ball.radius + ball2.radius) {
			collide(ball, ball2, vec, mag);
		}
		if (gravity) {
			gravitate(ball, ball2, vec, mag);
		}
	}
}

function collide(ball, ball2, vec, mag) {
	let normal = Vector.createXY(vec.getX(), vec.getY()).normalize();
	let jr = ball2.getVelocity().subtract(ball.getVelocity()).scale(-1 - coofrest).dot(normal) / ((1 / ball.mass) + (1 / ball2.mass));
	ball.setVelocity(ball.getVelocity().subtract(normal.scale(jr / ball.mass)));
	ball2.setVelocity(ball2.getVelocity().add(normal.scale(jr / ball2.mass)));
	let dir = normal.getDirection();
	let newmag = (ball.radius + ball2.radius - mag) / (ball.fixed ? 1 : 2);
	let newvec = Vector.createDM(dir, newmag);
	ball.setXY(ball.x - newvec.getX(), ball.y - newvec.getY());
	ball2.setXY(ball2.x + newvec.getX(), ball2.y + newvec.getY());
}

function gravitate(ball, ball2, vec, mag) {
	mag = G * ball.mass * ball2.mass / mag;
	vec.setMagnitude(mag);
	ball.setVelocity(ball.getVelocity().add(vec));
	vec.setDirection(vec.getDirection() + Math.PI);
	ball2.setVelocity(ball2.getVelocity().add(vec));
}

function doBallDT(ball, dt) {
	let vx = ball.getVelocity().getX();
	let vy = ball.getVelocity().getY();
	ball.setXY(ball.x + dt * vx, ball.y + dt * vy);
}

function doBallEdgeCollision(ball) {
	let vx = ball.getVelocity().getX();
	let vy = ball.getVelocity().getY();
	if (ball.x - ball.radius < 0) {
		ball.getVelocity().setX(Math.abs(vx) * coofrest);
		ball.setXY(ball.radius, ball.y);
	}
	if (ball.y - ball.radius < 0) {
		ball.getVelocity().setY(Math.abs(vy) * coofrest);
		ball.setXY(ball.x, ball.radius);
	}
	if (ball.x + ball.radius > size.w) {
		ball.getVelocity().setX(-Math.abs(vx) * coofrest);
		ball.setXY(size.w - ball.radius, ball.y);
	}
	if (ball.y + ball.radius > size.h) {
		ball.getVelocity().setY(-Math.abs(vy) * coofrest);
		ball.setXY(ball.x, size.h - ball.radius);
	}
}