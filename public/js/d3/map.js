MG.D3.Map = (function(MG){
	
	function pathTextures(folder, id) {
		return "img/textures/"+folder+"/"+id+".jpg";
	}

	var C = {
		drawObj: function(id,coord,loc) {
			var c = MG.Core.toLateralCoord(coord, this.getDepth(), this.getWeight());

			// Nel caso di collada
			//var c=(new GLGE.Collada());
			//c.setDocument("mesh/dae/"+this.map.coord[x][y][z].dae+"/mesh.dae");
			if (this.map.coord[c.x][c.y][c.z].md2) {
				var path = "mesh/md2/"+this.map.coord[c.x][c.y][c.z].md2+"/"+this.map.coord[c.x][c.y][c.z].md2;
				MG.addMaterial(path+".png");
				var obj = (new GLGE.MD2()).setScale(0.05,0.05,0.05).setMaterial(MG.getMaterial(path+".png"));
				obj.setSrc(path+".md2");
				obj.setLoc(loc.x,loc.y,loc.z);
				var gameHash = {obj:"3d", coord:coord};
			}
			if (this.map.coord[c.x][c.y][c.z].c) {
				var obj=(new GLGE.Object()).setMesh(MG.mesh.cube);
				obj.setLoc(loc.x,loc.y,loc.z);
				var folder = "neutral";
				if (this.map.coord[c.x][c.y][c.z].team>=0) folder = "team_"+this.map.coord[c.x][c.y][c.z].team;
				var path = pathTextures(folder, id);
				MG.addMaterial(path);
				obj.setMaterial(MG.getMaterial(path));
				var gameHash = {obj:"tile", coord:coord};
			}
			obj.gameHash = gameHash;
			MG.scene.addObject(obj);
			this.map.coord[c.x][c.y][c.z].object3D = obj;
		},
		removeObj: function(c) {
			var obj = this.map.coord[c.x][c.y][c.z].object3D;
			if (obj)
				MG.scene.removeChild(obj);
			this.map.coord[c.x][c.y][c.z].object3D = undefined;
		},
		changeTeamObj: function(c, team) {
			var obj = this.map.coord[c.x][c.y][c.z].object3D;
			var path = pathTextures("team_"+team, this.map.coord[c.x][c.y][c.z].c);
			MG.addMaterial(path);
			obj.setMaterial(MG.getMaterial(path));
		}
	}
	return C;

}(MG));
