function Vector() {
	let direction = undefined;
	let magnitude = undefined;
	let x = undefined;
	let y = undefined;

	/**
	 * Sets the direction (aka angle) of this Vector
	 * @param {Number} new_direction The value to set as the direction of this Vector
	 */
	this.setDirection = function(new_direction) {
		direction = new_direction;
		magnitude = this.getMagnitude();
		x = y = undefined;
	}

	/**
	 * Sets the magnitude (aka size) of this Vector
	 * @param {Number} new_magnitude The value to set as the magnitude of this Vector
	 */
	this.setMagnitude = function(new_magnitude) {
		magnitude = new_magnitude;
		direction = this.getDirection();
		x = y = undefined;
	}

	/**
	 * Sets the x-coordinate of this Vector
	 * @param {Number} new_x The value to set as the x-coordinate of this Vector
	 */
	this.setX = function(new_x) {
		x = new_x;
		y = this.getY();
		direction = magnitude = undefined;
	}

	/**
	 * Sets the y-coordinate of this Vector
	 * @param {Number} new_y The value to set as the y-coordinate of this Vector
	 */
	this.setY = function(new_y) {
		y = new_y;
		x = this.getX();
		direction = magnitude = undefined;
	}

	/**
	 * Returns the direction (aka angle) of this Vector
	 * @return {Number} The direction of this Vector
	 */
	this.getDirection = function() {
		if (direction !== undefined)
			return direction;
		if (x === undefined || y === undefined)
			return undefined;
		direction = Math.atan2(y, x);
		return direction;
	}

	/**
	 * Returns the magnitude (aka size) of this Vector
	 * @return {Number} The magnitude of this Vector
	 */
	this.getMagnitude = function() {
		if (magnitude !== undefined)
			return magnitude;
		if (x === undefined || y === undefined)
			return undefined;
		magnitude = Math.sqrt(x * x + y * y);
		return magnitude;
	}

	/**
	 * Returns the x-coordinate of this Vector
	 * @return {Number} The x-coordinate of this Vector
	 */
	this.getX = function() {
		if (x !== undefined)
			return x;
		if (direction === undefined || magnitude === undefined)
			return undefined;
		return x = magnitude * Math.cos(direction);
		return x;
	}

	/**
	 * Returns the y-coordinate of this Vector
	 * @return {Number} The y-coordinate of this Vector
	 */
	this.getY = function() {
		if (y !== undefined)
			return y;
		if (direction === undefined || magnitude === undefined)
			return undefined;
		y = magnitude * Math.sin(direction);
		return y;
	}

	/**
	 * Adds this Vector and the given Vector
	 * @param  {Vector} vector The Vector to add to thie Vector
	 * @return {Vector}        The resultant Vector of the addition
	 */
	this.add = function(vector) {
		let x1 = this.getX();
		let y1 = this.getY();
		let x2 = vector.getX();
		let y2 = vector.getY();
		return Vector.createXY(x1 + x2, y1 + y2);
	}

	/**
	 * Subtracts the given Vector from this Vector
	 * @param  {Vector} vector The Vector to subtract from this Vector
	 * @return {Vector}        The resultant Vector of the subtraction
	 */
	this.subtract = function(vector) {
		let x1 = this.getX();
		let y1 = this.getY();
		let x2 = vector.getX();
		let y2 = vector.getY();
		return Vector.createXY(x1 - x2, y1 - y2);
	}

	/**
	 * Performs a dot multiplication between this Vector and the given Vector
	 * @param  {Vector} vector The vector with which to perform a dot multiplication
	 * @return {Number}        The resultant of the dot multiplication
	 */
	this.dot = function(vector) {
		let x1 = this.getX();
		let y1 = this.getY();
		let x2 = vector.getX();
		let y2 = vector.getY();
		return x1 * x2 + y1 * y2;
	}

	/**
	 * Multiplies the Vector by a given value, aka scalar multiplication, aka scaling
	 * @param  {Number} scalar The value by which to scale the Vector
	 * @return {Vector}        The resultant vector, after scaling.
	 */
	this.scale = function(scalar) {
		let dir = this.getDirection();
		let mag = this.getMagnitude();
		return Vector.createDM(dir, mag * scalar);
	}

	/**
	 * Creates a normalized Vector from this Vector
	 * @return {Vector} A normalized version of this Vector
	 */
	this.normalize = function() {
		return Vector.createDM(this.getDirection(), 1);
	}
}

/**
 * Creates a Vector from the given direction and magnitude
 * @param  {Number} direction The direction or angle of the Vector, given in radians
 * @param  {Number} magnitude The magnitude or size of the Vector
 * @return {Vector}           A 2-dimensional Vector constructed from the given direction and magnitude
 */
Vector.createDM = function(direction, magnitude) {
	let vec = new Vector();
	vec.setDirection(direction);
	vec.setMagnitude(magnitude);
	return vec;
}

/**
 * Creates a Vector from the given (x,y) coordinate
 * @param  {Number} x x-coordinate
 * @param  {Number} y y-coordinate
 * @return {Vector}   A 2-dimensional Vector constructed from the given coordinate
 */
Vector.createXY = function(x, y) {
	let vec = new Vector();
	vec.setX(x);
	vec.setY(y);
	return vec;
}