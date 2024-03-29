const newGeometries = {
	ship:{
		rotation: -0.785, //PI/4, -0.785
		// scale: {x: 1, y: 1},
		shapes: [
		{
			angle: -0.785, scale: {x: 1, y: 1}, position: {x: 3, y: -3}, type: "concave line", label: "body", isPhysical: true, isRendering: true,
			fill: true, color: "#f5d259"/*"white"*/, outline: 144, stroke: 1, 
			// vertexes: [[1,0],[1,1],[0,1],[0,0],[-1,0],[-1,-1]]
			vertexes: [
				{x: 10, y: -10},
				{x: 10, y: 20},
				{x: 0, y: 20},
				// {x: 0, y: 10}, //
				// {x: -10, y: 10}, //
				// {x: -10, y: 0}, //
				{x: -20, y: 0},
				{x: -20, y: -10}
			]
		}, 
		{
			angle: -0.785, scale: {x: 1, y: 1}, position: {x: 8, y: 19}, type: "concave line", label: "right engine", isPhysical: false, renderCondition: "turningSide", renderConditionValue: -1,
			fill: true, color: "red", outline: 144, stroke: 1, 
			vertexes: [
				{x: 3, y: 0},
				{x: 0, y: 4},
				{x: -3, y: 0}
			],
			currentStep: {stepNum: 0, timeLeft: 0},
			animation:[
			{time: 1, options: {fill: false, stroke: 0}},
			{time: 3, options: {}},
			]
		},
		{
			angle: 0, scale: {x: 4, y: 4}, position: {x: 0, y: 11}, type: "concave line", label: "main engine", isPhysical: false, renderCondition: "isBoosting", renderConditionValue: true, isAnimContinuous: false,
			fill: true, color: "orange", outline: 144, stroke: 0.35, 
			vertexes: [
				{x: 3, y: 0},
				{x: 0, y: 2},
				{x: -3, y: 0}
			],
			currentStep: {stepNum: 0, timeLeft: 0},
			animation: [
			{time: 2, options: {fill: false, stroke: 0}},
			{time: 6, options: {}},
			// {time: 50, options: {color: "green"}}
			]
		},
		{
			angle: 0, scale: {x: 1, y: 1}, position: {x: 0, y: -8}, type: "circle", label: "window", isPhysical: false, renderCondition: null, 
			fill: true, color: "turquoise", outline: [50, 50, 230], stroke: 1, 
			r: 4, 
			currentStep: {stepNum: 0, timeLeft: 0},
			animation: [
			// {time: 2, options: {color: "lightblue", stroke: 1}},
			{time: 6, options: {}},
			// {time: 50, options: {color: "green"}}
			]
		},
		{
			angle: 0.785, scale: {x: 1, y: 1}, position: {x: -8, y: 19}, type: "concave line", label: "left engine", isPhysical: false, renderCondition: "turningSide", renderConditionValue: 1,
			fill: true, color: "red", outline: 144, stroke: 1, 
			vertexes: [
				{x: 3, y: 0},
				{x: 0, y: 4}, //{x: 0, y: 2},
				{x: -3, y: 0}
			],
			animation:[
			{time: 1, options: {fill: false, stroke: 0}},
			{time: 3, options: {}},
			]
		},
		{
			angle: 0, scale: {x: 4, y: 4}, position: {x: 0, y: 10}, type: "concave line", label: "warp engine", isPhysical: false, renderCondition: "isWarping", renderConditionValue: true,
			fill: true, color: "lightblue", outline: 144, stroke: 1, 
			vertexes: [
				{x: 3, y: 0},
				{x: 0, y: 7}, //{x: 0, y: 2},
				{x: -3, y: 0}
			],
			animation:[
			{time: 1, options: {fill: false, stroke: 0}},
			{time: 5, options: {}},
			]
		}
		// {angle: 0, scale: [1, 1], position: [0, 0], type: "circle", fill: true, color: "turqouse", outline: 144, stroke: 1, r: 1}
		]
	},

	animTestBox:{
		rotation: 0,
		scale: {x:10, y: 10},
		// position:{x:-10.3, y: -4.3},
		shapes: [
			{
				angle: 0, scale: {x: 1, y: 1}, position: {x: -50, y: -40}, type: "concave line", label: "body", isPhysical: true, isRendering: true,
				fill: true, color: "white", outline: 230, stroke: 0, isStrokeScaling: true, r: 1,
				// vertexes:[{x: 10, y: 0}, {x: 30, y: 5}, {x: 10, y: 10}, {x: 0, y: 10}, {x: 0, y: 0}, {x: 5, y: -5}],
				vertexes:[{x: 10, y: 0}, {x: 30, y: 0}, {x: 10, y: 10}, {x: 0, y: 10}, {x: 0, y: 0}],
				currentStep: {stepNum: 0, timeLeft: 0},
				animation: [
				{time: 15, options:{color: "orange"}},
				{time: 15, options:{color: "blue"}},
				{time: 15, options:{}}
				]
			}
		]
	},

	standartGeometry:{
		rotation: 0,
		scale: {x:1, y: 1},
		position:{x:0, y:0}, //shift render position
		shapes: [
			{
				angle: 0, scale: {x: 1, y: 1}, position: {x: 0, y: 0}, type: "concave line", label: "body", isPhysical: true, isRendering: true, renderCondition: null, renderConditionValue: null, isAnimContinuous: true,
				fill: true, color: "white", outline: 230, stroke: 1, isStrokeScaling: true, r: 1, //isStrokeScaling = false не работает!
				// vertexes: [[1,0],[1,1],[0,1],[0,0],[-1,0],[-1,-1]],
				vertexes:[{x: 10, y: 0}, {x: 10, y: 10}, {x: 0, y: 10}, {x: 0, y: 0}], //центр физической фигуры - 0, 0
				currentStep: {stepNum: 0, timeLeft: 0},
				animation: [
				{time: 1, options:{}}//settings
				]
			}
		]
	},

	testObject1:{
		// position: {x: -50, y: -50},
		scale: {x: 1, y: 1},
		shapes:[
			{
				type:"concave line", stroke: 0, isRendering: true,
				// vertexes:[{x: 50, y: -50}, {x: 50, y: 50}, {x: 0, y: 0}, {x: -50, y: 50}, {x: -50, y: -50}]
				// vertexes:[{x: 100, y: 0}, {x: 100, y: 100}, {x: 0, y: 100}, {x: 0, y: 0}]
				vertexes:[{x: 50, y: -50}, {x: 50, y: 50}, {x: 0, y: 0}, {x: -50, y: 50}, {x: -50, y: -50}]
			},
			{
				type: "circle", stroke: 0, color: "red", r: 1, outline: 0
			}
		]
	}
};