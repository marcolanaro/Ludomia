MG.Core.Game = (function(MG){

	var C = function(obj){
		MG.Extend(MG.info, obj);
		MG.info.user.life_eff = MG.info.user.life;
		MG.info.user.mana_eff = MG.info.user.mana;//alert(JSON.stringify(MG.info));
		this.init();
	};

	C.prototype = {
		init: function(obj) {
			this.docCube = new GLGE.Document();
			this.docCube.load("mesh/cube.xml");
			this.docCube.onLoad = this.loaded.bind(this);
		},
		loaded: function() {
			MG.mesh.cube = this.docCube.getElement("Cube");
			this.init1();
		},
		init1: function() {
			MG.d3 = new MG.D3.Init();
			MG.maps[MG.info.room.id] = new MG.Core.Map(MG.info.room);
			MG.d3.setCamera();

			MG.skills = new MG.UI.Skills(MG.info.skills);
			this.skills = MG.skills;
			MG.profile = new MG.UI.Profile(MG.info.user);

			MG.skills.on("useSkill",MG.profile.useMana,MG.profile);


			MG.chat = new MG.UI.Chat();
			new MG.UI.Options();

			MG.Socket.on('move', function (data) {
				var u = MG.users[data.id];
				if (JSON.stringify(u.getCoord()) != JSON.stringify(data.from))
					u.setCoord(data.from);
				u.setAction(data.action);
				u.setRoute(data.path);
			});
			MG.Socket.on('destroy', function (data) {
				MG.users[data.user].setAnimation("stand");
				MG.maps[MG.info.room.id].destroy(data.coord);
			});
			MG.Socket.on('conquer', function (data) {
				MG.users[data.user].setAnimation("stand");
				MG.maps[MG.info.room.id].conquer(data);
			});
		}
	};

	return C;

}(MG));
