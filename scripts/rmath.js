class rmath{
	static c = 12; //12, 30, 2, 4, 120, 60, 9
	static c2 = rmath.c ** 2;

		// v is velocity
	static lorentz(v){return 1 / Math.sqrt( 1 - (v*v / rmath.c2) )};
	// version where v is already squared
	static lorentz2(v2){return 1 / Math.sqrt( 1 - (v2 / rmath.c2) )};

	// 1/lorentz(v)
	static invLorentz(v){ return Math.sqrt( 1 - ( v*v / rmath.c2) ) };

	// d is distance
	// v is velocity
	static contract(d, v){ return d * Math.sqrt( 1 - (v*v / rmath.c2) ) };
	// version where v is already squared
	static contract2(d, v2){ return d * Math.sqrt( 1 - (v2 / rmath.c2) ) };

	// t is time
	// v is velocity
	static dilate(t, v){ return t / Math.sqrt( 1 - (v*v / rmath.c2) ) };
	// version where v is already squared
	static dilate2(t, v2){ return t / Math.sqrt( 1 - (v2 / rmath.c2) ) };

	// v1 and v2 are velocity vectors according to an external frame
	static vDiff(v1, v2){
	  if( mySqrOfVec3(v1) == 0 || mySqrOfVec3(v2) == 0){return {x: 0, y: 0}}
	  var l2 = rmath.lorentz2(mySqrOfVec3(v2))
	  var d = 1 / ( l2 * (1 - myScalarMult(v2, v1) / rmath.c2 ) );
	  return ( myAdd(mySub(v1, v2), myMult(v2, (l2 - 1) * ( ( myScalarMult(v2, v1) / mySqrOfVec3(v2) ) - 1 ) )) ) * d;
	}

	// Version that just gives magnitude of velocity, speed.
	static sDiff(v1, v2){
	  var n = (rmath.c2 - mySqrOfVec3(v2)) * (rmath.c2 - mySqrOfVec3(v1)) / ((rmath.c2 - myScalarMult(v2, v1)) ** 2);
	  return Math.sqrt(1 - n) * rmath.c;
	}






	static relativeVelocity(VelOfTargetPoint, referencePointVel){
	    // var resultX = (VelOfTargetPoint.x - referencePointVel.x) / (1 - (VelOfTargetPoint.x*referencePointVel.x) / (c**2));
	    // var resultY = (VelOfTargetPoint.y - referencePointVel.y) / (1 - (VelOfTargetPoint.y*referencePointVel.y) / (c**2));

	    // return {x: resultX, y: resultY};

	    return myDiv(mySub(VelOfTargetPoint, referencePointVel), (1 - (myMagnitude(VelOfTargetPoint)*myMagnitude(referencePointVel))/(c**2)))
	}

	static relativeVelocity2(VelOfTargetPoint, referencePointVel, gammaOfTarget){ //Скорость объекта, который мы измеряем, относительно центра координат и скорость наблюдателя относительно центра координат. И лоренц-фактор объекта относительно центра координат
	    // return myMult(myAdd(mySub(referencePointVel, VelOfTargetPoint), myMult(myMult(VelOfTargetPoint, gammaOfTarget - 1), myScalarMult(VelOfTargetPoint, referencePointVel)/(myMagnitude(VelOfTargetPoint)**2)-1)), 1/(gammaOfTarget*(1-myScalarMult(VelOfTargetPoint, referencePointVel)/(c**2))));
	    // return myDiv(myAdd(mySub(VelOfTargetPoint, referencePointVel), (gammaOfTarget - 1)*myDiv(referencePointVel, myMagnitude(referencePointVel)**2)*(myScalarMult(referencePointVel, VelOfTargetPoint) - myMagnitude(referencePointVel)**2)), gammaOfTarget*(1-myScalarMult(referencePointVel, VelOfTargetPoint)/c**2));
	    return myDiv(myAdd(mySub(VelOfTargetPoint, referencePointVel), myMult(myDiv(referencePointVel, myMagnitude(referencePointVel)**2), (gammaOfTarget - 1) * (myScalarMult(referencePointVel, VelOfTargetPoint) - myMagnitude(referencePointVel)**2))), gammaOfTarget*(1-myScalarMult(referencePointVel, VelOfTargetPoint)/c**2));

	}

	static relativeSpeed(VelOfTargetPoint, referencePointVel){
	    // return Math.sqrt(1-(c**2- myMagnitude(VelOfTargetPoint)**2)*(c**2- myMagnitude(referencePointVel)**2)/((c**2- myScalarMult(VelOfTargetPoint, referencePointVel))**2))*c
	    return Math.sqrt((mySqrOfVec3(mySub(VelOfTargetPoint, referencePointVel)) - 1/(c**2) * myCrossProduct(VelOfTargetPoint, referencePointVel)**2), (1 - myScalarMult(referencePointVel, VelOfTargetPoint)/(c**2)))
	}
}

