MG.Core.Map = (function(MG){
	
	var C = function(obj){
		this.obstacles = [];
		this.id = obj.id;
		this.map=obj;

		this.drawMap();
		this.drawUsers();
	};

	C.prototype={
		drawMap: function() {
			var Ld=this.getDepth();
			var Lw=this.getWeight();
			for(var x=0;x<Ld;x++)
				for(var y=0;y<Lw;y++)
					for(var z=0;z<this.map.coord[x][y].length;z++)
					if (JSON.stringify(this.map.coord[x][y][z]) != JSON.stringify({})) {
						var	x1 = x - MG.Core.OffsetDepth(Ld),
							y1 = y - MG.Core.OffsetWeight(Lw);
						var loc = MG.Core.Coord2Loc({
							x: x1,
							y: y1,
							z: z
						},{z:-2});
						this.drawObj(this.map.coord[x][y][z].c,{x:x1,y:y1,z:z},loc);
					}
		},
		drawUsers: function() {
			for (var i=0;i<this.map.users.length;i++) {
				MG.users[this.map.users[i].id] = new MG.Core.Player(this.map.users[i]);
				this.addObstacle(this.map.users[i].coord);
			}
		},
		setObstacle: function(coord,val) {
			var c = MG.Core.toLateralCoord(coord,this.getDepth(),this.getWeight());
			if (!this.obstacles[c.x]) this.obstacles[c.x] = [];
			if (!this.obstacles[c.x][c.y]) this.obstacles[c.x][c.y] = [];
			this.obstacles[c.x][c.y][c.z] = val;
		},
		addObstacle: function(coord) {
			this.setObstacle(coord,1);
		},
		removeObstacle: function(coord) {
			this.setObstacle(coord,0);
		},
		getMap: function() {
			return this.map;
		},
		getObstacles: function() {
			return this.obstacles;
		},
		getDepth: function() {
			return this.map.coord.length;
		},
		getWeight: function() {
			return this.map.coord[0].length;
		},
		destroy: function(c) {
			c = MG.Core.toLateralCoord(c, this.getDepth(), this.getWeight());
			this.removeObj(c);
			this.map.coord[c.x][c.y][c.z] = undefined;
			
		},
		conquer: function(o) {
			for (var i = o.coords.length - 1; i >= 0; i -= 1) {
				var c = MG.Core.toLateralCoord(o.coords[i], this.getDepth(), this.getWeight());
				this.map.coord[c.x][c.y][c.z].team = o.team;
				this.changeTeamObj(c, o.team);
			}
		}
	};

	MG.Extend(C.prototype, MG.D3.Map);

	return C;

}(MG));
