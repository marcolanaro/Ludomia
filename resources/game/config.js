var Types = function() {
	return {
		types:{
			tiles: [
				{texture: 0, set: 0},
				{texture: 1, set: 0, conquerable: {time: 10}},
				{texture: 2, set: 0, destroyable: {power: 20}},
				{texture: 3, set: 0, destroyable: {power: 35}},
				{texture: 4, set: 0},
				{texture: 5, set: 0},
				{texture: 6, set: 1, conquerable: {time: 2}},
				{texture: 7, set: 1, conquerable: {time: 1.5}}
			],
			players: [
				{idModel: 0, velocity: 4,

					destroy: {
						velocity: 2,
			
			power: 6,
						animation: "attack"
			
		},

					conquer: {
			
			velocity: 0.5,
						animation: "painb"
			
		}
				},
				{idModel: 1, velocity: 6,

					destroy: {
						velocity: 2,
			
			power: 3,
						animation: "attack"
			
		},

					conquer: {
			
			velocity: 0.5,
						animation: "crpain"
			
		}
				},
				{idModel: 2, velocity: 6,

					destroy: {
						velocity: 2,
			
			power: 3,
						animation: "flip"
			
		},

					conquer: {
			
			velocity: 0.5,
						animation: "point"
			
		}
				}
			]
		}
	}
};


if(!(typeof exports === 'undefined')) {
    module.exports = Types;
}