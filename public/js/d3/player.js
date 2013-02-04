MG.D3.Player = (function(MG){
	
	var C = {
		OFFSET_Z: 1,
		setModelAnimation: function(model, a) {
			model.setMD2Animation(a);
		},
		getModelRot: function(model) {
			return model.getRotZ();
		},
		setModelRot: function(model, r) {
			model.setRotZ(r);
		},
		getModelLoc: function(model) {
			return {
				x: model.getLocX(),
				y: model.getLocY(),
				z: model.getLocZ()
			}
		},
		setModelLoc: function(model, c) {
			model.setLoc(c.x,c.y,c.z);
		},
		createModel: function(id, rot) {
			var path = "mesh/models/"+id+"/team/"+this.team+".jpg";
			MG.addMaterial(path);
			var model = (new GLGE.MD2()).setScale(0.04,0.04,0.04).setRotZ(rot).setMaterial(MG.getMaterial(path)).setMD2Animation("stand");
			model.setSrc("mesh/models/"+id+"/model.md2");
			model.gameHash = {obj:"player", id:this.id};
			return model;
		},
		addModel: function(model) {
			MG.scene.addObject(model);
		}
	}
	return C;

}(MG));
