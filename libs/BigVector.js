/*
 * Creates and manipulates vectors using arbitrary-precision 
 * arithmetic. Components: an array containing the components of the 
 * vector represented as arbitrary-precision numbers of type Big using the 
 * library big.js. All values used are arbitary-precision numbers or vectors 
 * unless otherwise specified.
 */

"use strict";
 
function BigVector(components) {
	this.components = components;
	
	/*
	 * Returns an array containing the components of the vector.
	*/
	this.getComponents = function() {
		return this.components;
	};
	
	/*
	 * Returns the vector's magnitude.
	 */
	this.magnitude = function() {
		var sumOfSquares = new Big(0);
		for (var i = 0; i < this.components.length; i++) {
			sumOfSquares = sumOfSquares.plus(this.components[i].pow(2));
		}
		return sumOfSquares.sqrt();
	};
	
	/*
	 * Returns the vector's direction represented as its components normalized 
	 * to have unit magnitude. If the vector is of magnitude zero, NaN is 
	 * returned.
	 */
	this.direction = function() {
		if (!this.magnitude().eq(new Big(0))) {
			var components = [];
			for (var i = 0; i < this.components.length; i++) {
				var normalizedComponent = this.components[i].div
					(this.magnitude());
				components.push(normalizedComponent);
			}
			return new BigVector(components);
		} else {
			return NaN;
		}
	};
	
	/*
	 * Returns the vector sum of the current and inputted vectors. 
	 * Precondition: the vectors have the same number of dimensions.
	 */
	this.plus = function(vector) {
		var components = [];
		for (var i = 0; i < this.components.length; i++) {
			var sum = this.components[i].add(vector.components[i]);
			components.push(sum);
		}
		return new BigVector(components);
	};
	
	/*
	 * Returns the vector difference of the current and inputted vectors.
	 * Precondition: the vectors have the same number of dimensions.
	 */
	this.minus = function(vector) {
		var components = [];
		for (var i = 0; i < this.components.length; i++) {
			var difference = this.components[i].minus(vector.components[i]);
			components.push(difference);
		}
		return new BigVector(components);
	};
	
	/*
	 * Returns the current vector scaled by the scalar.
	 */
	this.scale = function(scalar) {
		var components = [];
		for (var i = 0; i < this.components.length; i++) {
			var product = this.components[i].times(scalar);
			components.push(product);
		}
		return new BigVector(components);
	};
	
	/* 
	 * Returns the dot product of the current and inputted vectors. 
	 * Precondition: both vectors have the same number of dimensions.
	 */
	this.dot = function(vector) {
		var sum = new Big(0);
		for (var i = 0; i < this.components.length; i++) {
			sum = sum.plus(this.components[i].times(vector.components[i]));
		}
		return sum;
	};
	
	/*
	 * Returns the distance between the current and inputted vectors. 
	 * Precondition: both vectors have the same number of dimensions.
	 */
	this.distance = function(vector) {
		var squaresOfDifs = new Big(0);
		for (var i = 0; i < this.components.length; i++) {
			squaresOfDifs = squaresOfDifs.plus((this.components[i].minus
				(vector.components[i])).pow(2));
		}
		return squaresOfDifs.sqrt();
	}
	
	/*
	 * Returns the cross product between the current and inputted vectors. 
	 * Precondition: both vectors are three-dimensional.
	 */
	this.cross = function(vector) {
		var x = this.components[1].times(vector.components[2]).minus
			(this.components[2].times(vector.components[1]));
		var y = this.components[2].times(vector.components[0]).minus
			(this.components[0].times(vector.components[2]));
		var z = this.components[0].times(vector.components[1]).minus
			(this.components[1].times(vector.components[0]));
		return new BigVector([x, y, z]);
	}
	
	/*
	 * Returns the angle between the current and inputted vectors in radians.
	 * Note that though this function returns a Big, it is not completely 
	 * arbitary-precision, as it uses Math.acos(). 
	 */
	this.angle = function(vector) {
		var numerator = this.dot(vector);
		var denominator = this.magnitude().times(vector.magnitude());
		return new Big(Math.acos(numerator.div(denominator)));
	}
	
	/*
	* Returns the polar coordinates of the vector represented as an array with
	* the first element being the vector's magnitude and the second being its
	* angle in radians in the interval [0, 2 pi]. If the vector's magnitude is 
	* zero, the angle returned is 0. Precondition: the vector is 
	* two-dimensional.
	*/
	this.polarCoords = function() {
		var magnitude = this.magnitude();
		
		var angle = new Big(0);
		if (!magnitude.eq(0)) {
			// Find the angle between it and a vector on the positive x axis.
			var x = new Big(1);
			var y = new Big(0);
			angle = this.angle(new BigVector([x, y]));
		}
		
		return [magnitude, angle];
	}
	
	return this;
}