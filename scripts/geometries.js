const geometries = {
	// ship: {
	// 	type: "concave line",
	// 	shape: [[1,-1],[1,2],[0,2],[0,1],[-1,1],[-1,0],[-2,0],[-2,-1]],  //[0,-1],[1,1],[-1,1]
 //        scale: [60, 60],
 //        mass: 10,
 //        startVel: [0, 0],
 //        rotation: - PI/4,
	// 	centreShiftY: 10, //почему координаты инвертированны?
 //        centreShiftX: -10,
 //        angularVel: 12000,
 //        speed: 500,
 //        geometry: { //RotoriCraft - од для Minecraft Bedrock Edition, добавляющий роторы и другие механизмы паровой эры, все они работают на угле, как печи и помогают со сложностями, но и добавляют новых - их нужно сначала построить
 //            type: "circle",
 //            shape: [[0,0],[1,0],[1,1],[0,1]],
 //            r: 1,
 //            rotation: 0,
 //            color: "white",
 //            isFilling: 0,
 //            centreShiftX: 0,
 //            centreShiftY: 0
 //        }
	// },

	ship: {
		angle: 0.785, //0.785398163397448, -PI/4
		scale: [20, 20],
		position: [0, 0],
		shapes: [
		{angle: 0, scale: [1, 1], position: [0, 0], type: "concave line", fill: false, color: "white", outline: 144, stroke: 1, 
		// vertexes: [[1,0],[1,1],[0,1],[0,0],[-1,0],[-1,-1]]
		vertexes: [[1,-1],[1,2],[0,2],[0,1],[-1,1],[-1,0],[-2,0],[-2,-1]]
	}
		// {angle: 0, scale: [1, 1], position: [0, 0], type: "circle", fill: true, color: "turqouse", outline: 144, stroke: 1, r: 1}
		]
	},

	testObject: {
		angle: 0,
		scale: [1, 1],
		position: [0, 0],
		shapes: [
		{angle: 0, scale: [1, 1], position: [0, 0], type: "concave line", fill: false, color: "white", outline: 144, stroke: 1, 
		// vertexes: [[10, 0], [10, 10], [20, 10], [20, 20], [10, 20], [0, 20],[10, 0]]
		vertexes: [[40, 0], [40, 20], [100, 20], [100, 80], [40, 80], [40, 100], [0, 50]]
	}]
	},

	standartGeometry: {
		angle: 0,
		scale: [2, 2],
		position: [0, 0],
        shapes: [{ 
        	angle: 0,
        	scale: [1, 1],
        	position: [0, 0],
            type: "concave line",
            fill: false,
            color: "white",
            outline: 144,
            stroke: 1,
            vertexes: [[0,0],[1,0],[1,1],[0,1]]
    	}]
	},

	box: {
		angle: 0,
		scale: [10, 10],
		position: [0, 0],
		shapes: [{ 
        	angle: 0,
        	scale: [1, 1],
        	position: [0, 0],
            type: "concave line",
            fill: true,
            color: "white",
            outline: 144,
            stroke: 1,
            vertexes: [[0,0],[1,0],[1,1],[0,1]]
    	}]
	}

};