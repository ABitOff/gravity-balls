var CanvasElement = document.getElementById('canvas');
var canvas = CanvasElement.getContext('2d');
var padding = {
	w: 16,
	h: 16
};
var aspect = {
	w: 3,
	h: 4
};
var scale = 1;
var bottomFull = 15;
var boardColor = '#ebe5e0';
var ballColors = [0, 30, 60, 120, 190, 260, 310];
var ballRadius = aspect.w / bottomFull / 2;
var TAU = 2 * Math.PI;
var board = new Array();

window.onresize = function() {
	canvas.setTransform(1, 0, 0, 1, 0, 0);
	let width = (window.innerWidth - padding.w) / aspect.w;
	let height = (window.innerHeight - padding.h) / aspect.h;
	scale = Math.floor(Math.min(width, height));
	CanvasElement.width = aspect.w * scale;
	CanvasElement.height = aspect.h * scale;
	setElementTranslate(CanvasElement, window.innerWidth / 2 - CanvasElement.width / 2, window.innerHeight / 2 - CanvasElement.height / 2);
	canvas.scale(scale, scale);
}

function setElementTranslate(element, x, y) {
	let transform_value = 'matrix(1,0,0,1,' + x + ',' + y + ')';
	element.style['transform'] = transform_value; //chrome
	element.style['-webkit-transform'] = transform_value; //safari
	element.style['-ms-transform'] = transform_value; //IE 9
}

function draw() {
	canvas.fillStyle = boardColor;
	canvas.fillRect(0, 0, aspect.w, aspect.h);
	for (let ball of board) {
		canvas.translate(ball.x, aspect.h - ball.y);
		canvas.fillStyle = 'rgb(0,0,0,0.125)'
		canvas.beginPath();
		canvas.arc(ball.radius / 4.5, ball.radius / 6, ball.radius, 0, TAU);
		canvas.fill();
		canvas.translate(-ball.x, ball.y - aspect.h);
	}
	for (let ball of board) {
		canvas.translate(ball.x, aspect.h - ball.y);
		var grad = canvas.createRadialGradient(-ball.radius / 3, -ball.radius / 4, 0, -ball.radius / 3, -ball.radius / 4, 2.25 * ball.radius);
		grad.addColorStop(0, '#fff')
		grad.addColorStop(0.075, 'hsl(' + ball.color + ',100%,50%)');
		grad.addColorStop(1, '#000');
		canvas.fillStyle = grad;
		canvas.beginPath();
		canvas.arc(0, 0, ball.radius, 0, TAU);
		canvas.fill();
		canvas.translate(-ball.x, ball.y - aspect.h);
	}
	let time = Date.now();
	let dt = (time - fpsTime) / 1000;
	fpsTime = time;
	canvas.setTransform(1, 0, 0, 1, 0, 0);
	canvas.fillStyle = '#000';
	canvas.fillText('fps: ' + (1 / dt).toPrecision(4), 3, 10);
	canvas.fillText('ups: ' + (1 / upsDT).toPrecision(4), 3, 20);
	canvas.scale(scale, scale);
	setTimeout(draw, 0);
}

var fpsTime = Date.now();
var upsTime = fpsTime;
var upsDT = 0;

window.onresize();
setTimeout(draw, 0);
var worker = new Worker('physics_worker.js');
worker.onmessage = function(e) {
	let time = Date.now();
	upsDT = (time - upsTime) / 1000;
	upsTime = time;
	if (e && e.data && e.data.length)
		board = e.data;
}
worker.postMessage({
	message: 'start',
	size: aspect
});

CanvasElement.onclick = function(e) {
	let x = e.offsetX / scale;
	let y = aspect.h - e.offsetY / scale;
	let data = {
		message: 'add',
		x: x,
		y: y,
		radius: ballRadius,
		mass: 1000,
		dir: 0,
		mag: 0,
		color: ballColors[Math.floor(Math.random() * ballColors.length)],
		fixed: false
	}
	worker.postMessage(data);
}

/*
for (var i = 0; i < bottomFull; i++) {
	for (var j = i; j < bottomFull; j++) {
		let jj = j - i;
		let ball = new Ball((2 * i + jj + 1) * ballRadius, jj * ballRadius * Math.sqrt(3), ballRadius, 1, new Vector(), ballColors[Math.floor(Math.random() *
			7)]);
		board.push(ball);
	}
}
*/