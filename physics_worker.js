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
		let renderUpdate = [];
		let cur_time = Date.now();
		let dt = (cur_time - time) / 1000;
		time = cur_time;
		for (let i = 0; i < board.length; i++) {
			let ball = board[i];
			let ballArray = new SortedArray((a, b) => {
				if (a.distance < b.distance) return -1;
				if (a.distance > b.distance) return 1;
				if (a.distance == b.distance) return 0;
				return NaN;
			})
			for (let j = i + 1; j < board.length; j++) {
				let ball2 = board[j];
				let vec = Vector.createXY(ball2.x, ball2.y).subtract(Vector.createXY(ball.x, ball.y));
				let mag = Math.max(vec.getMagnitude(), 1e-5);
				ballArray.insert({
					ball: ball2,
					distance: mag,
					normal: Vector.createXY(vec.getX(), vec.getY()).normalize()
				});
				if (gravity) {
					mag = G * ball.mass * ball2.mass / mag;
					vec.setMagnitude(mag);
					ball.setVelocity(ball.getVelocity().add(vec));
					vec.setDirection(vec.getDirection() + Math.PI);
					ball2.setVelocity(ball2.getVelocity().add(vec));
				}
			}
			if (collision) {
				for (let j = 0; j < ballArray.length(); j++) {
					let obj = ballArray.get(j);
					if (obj.distance >= ball.radius + obj.ball.radius)
						break;
					let jr = obj.ball.getVelocity().subtract(ball.getVelocity()).scale(-1 - coofrest).dot(obj.normal) / ((1 / ball.mass) + (1 / obj.ball.mass));
					ball.setVelocity(ball.getVelocity().subtract(obj.normal.scale(jr / ball.mass)));
					obj.ball.setVelocity(obj.ball.getVelocity().add(obj.normal.scale(jr / obj.ball.mass)));
					let dir = obj.normal.getDirection();
					let mag = (ball.radius + obj.ball.radius - obj.distance) / (ball.fixed ? 1 : 2);
					let vec = Vector.createDM(dir, mag);
					ball.setXY(ball.x - vec.getX(), ball.y - vec.getY());
					obj.ball.setXY(obj.ball.x + vec.getX(), obj.ball.y + vec.getY());
				}
			}
			let vx = ball.getVelocity().getX();
			let vy = ball.getVelocity().getY();
			ball.setXY(ball.x + dt * vx, ball.y + dt * vy);
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
			renderUpdate.push({
				x: ball.x,
				y: ball.y,
				radius: ball.radius,
				color: ball.color
			});
		}
		if (renderUpdate.length > 0)
			postMessage(renderUpdate);
		setTimeout(tick, Math.min(1, 1 - dt * 1000));
	}
}