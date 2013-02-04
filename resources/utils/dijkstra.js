exports.dijkstraGrid = function(obj) {
	var L1 = obj.graph.length;
	var L2 = obj.graph[0].length;
	var graph = [];

	OffsetX = function() {
		return Math.floor(L1/2);
	}

	OffsetY = function() {
		return Math.floor(L2/2);
	}

	ToLateralCoord = function(c) {
		return {
			x: c.x + OffsetX(),
			y: c.y + OffsetY(),
			z: c.z
		}
	}

	ToCentralCoord = function(c) {
		return {
			x: c.x - OffsetX(),
			y: c.y - OffsetY(),
			z: c.z
		}		
	}

	Vec2Grid = function(n) {
		var z = Math.floor(n / (L1 * L2));
		n = n - z * L1 * L2;
		return {
			x: (n % L1),
			y: Math.floor(n / L1),
			z: z
		}
	}

	Grid2Vec = function(c) {
		return c.x + c.y * L1 + c.z * L1 * L2;			
	}
	
	nearest = function(c) {
		return (obj.nearest==true && JSON.stringify(obj.to) == JSON.stringify(ToCentralCoord(c)));
	}
	
	append = function(n, coord, offset, w) {
		offset.x = offset.x || 0;
		offset.y = offset.y || 0;
		offset.z = offset.z || 0;
		var bloccato=false;
		var c = {x: coord.x + offset.x, y: coord.y + offset.y, z: coord.z + offset.z};
		if (offset.x!=0 && offset.y!=0)
			if (obj.graph[c.x-offset.x] && obj.graph[c.x-offset.x][c.y] && obj.graph[c.x-offset.x][c.y][c.z+1])
			if (obj.graph[c.x] && obj.graph[c.x][c.y-offset.y] && obj.graph[c.x][c.y-offset.y] && obj.graph[c.x][c.y-offset.y][c.z+1])
				bloccato=true;
		if (!(offset.x!=0 && offset.y!=0 && nearest(c)))
			if (obj.graph[c.x] && obj.graph[c.x][c.y] && obj.graph[c.x][c.y][c.z])
				if (typeof obj.graph[c.x][c.y][c.z+1] == "undefined" || nearest(c))
					if (bloccato!=true)
					graph[n].push({n: Grid2Vec(c), w: w});
	}

	for (var x = 0; x < L1; x += 1) {
		for (var y = 0; y < L2; y += 1) {
			var L = obj.graph[x][y].length;
			for (var z = 0; z < L; z += 1) {
				var c = {x: x, y: y, z: z};
				var n = Grid2Vec(c);
				graph[n] = [];
				append(n, c, {x: -1}, 2);
				append(n, c, {x: 1}, 2);
				append(n, c, {y: -1}, 2);
				append(n, c, {y: 1}, 2);
				if (obj.diag) {
					append(n, c, {x: -1, y: -1}, 3);
					append(n, c, {x: 1, y: -1}, 3);
					append(n, c, {x: -1, y: 1}, 3);
					append(n, c, {x: 1, y: 1}, 3);
				}
				if (obj.zeta) {
					append(n, c, {x: -1, z: 1}, 4);
					append(n, c, {x: 1, z: 1}, 4);
					append(n, c, {y: -1, z: 1}, 4);
					append(n, c, {y: 1, z: 1}, 4);
					append(n, c, {x: -1, z: -1}, 4);
					append(n, c, {x: 1, z: -1}, 4);
					append(n, c, {y: -1, z: -1}, 4);
					append(n, c, {y: 1, z: -1}, 4);
					if (obj.diag) {
						append(n, c, {x: -1, y: -1, z: 1}, 5);
						append(n, c, {x: 1, y: -1, z: 1}, 5);
						append(n, c, {x: -1, y: 1, z: 1}, 5);
						append(n, c, {x: 1, y: 1, z: 1}, 5);
						append(n, c, {x: -1, y: -1, z: -1}, 5);
						append(n, c, {x: 1, y: -1, z: -1}, 5);
						append(n, c, {x: -1, y: 1, z: -1}, 5);
						append(n, c, {x: 1, y: 1, z: -1}, 5);
					}
				}
			}
		}
	}

	var m = this.dijkstra({
		from: Grid2Vec(ToLateralCoord(obj.from)),
		to: Grid2Vec(ToLateralCoord(obj.to)),
		graph: graph
	});

	var v = new Array();
	for (var i = 0; i < m.length; i += 1)
		v[i] = ToCentralCoord(Vec2Grid(m[i]));
	return v;
}

exports.dijkstra = function(obj) {
	var V = {
			weight: [],
			found: [],
			father: []
		};
		
	// initialization
	for (var i = 0; i < obj.graph.length; i += 1) {
		V.weight[i] = 10000000;
		V.found[i] = false;
		V.father[i] = -1;
	}
	
	// i know where i am
	V.found[obj.from] = true;
	V.weight[obj.from] = 0;
	
	// start the search
	var found = false;
	var node = obj.from;
	var node_old = node;
	while (!found) {
		// the most intelligent things to do is look the world around you
		if (obj.graph[node])
		for (var i = 0; i < obj.graph[node].length; i += 1) {
			var new_weight = V.weight[node] + obj.graph[node][i].w;
			if (V.weight[obj.graph[node][i].n] > new_weight) {
				V.father[obj.graph[node][i].n] = node;
				V.weight[obj.graph[node][i].n] = new_weight;
			}
		}
		
		// i want to be light
		var light = 10000000;
		var lightest;
		for (var i = 0; i < obj.graph.length; i += 1) {
			if (!V.found[i] && V.weight[i] <= light) {
				light = V.weight[i];
				lightest = i;
			}
		}
		
		// oh right, lightest you are safe ;)
		V.found[lightest] = true;
		
		// and now you are the boss!
		node = lightest;
		
		// oops... i iterate the same path: there is no way :(
		if (node == node_old)
			found = true;
		node_old = node;
		
		// you are a good monkey
		if (node == obj.to)
			found = true
	}
	
	// calculate the path
	var movement = new Array();
	if (V.found[obj.to]) {
		found = false;
		node = obj.to;
		while (!found){
			if (V.father[node]<0)
				found=true;
			else {
				movement.push(node);
				node = V.father[node];
				if (obj.from == node)
					found = true;
			}
		}
		// reverse
		var message=[];
		for (var i = movement.length; i > 0; i -= 1) {
			message.push(movement[i-1]);
		}
	}
		
	return message;
}
