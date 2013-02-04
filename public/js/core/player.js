MG.Core.Player = (function(MG){
	
	var C = function(options) {
		this.velocity = options.velocity;
		this.team = options.team;
		this.mana = 100;
		this.life = 100;


		this.id=options.id;
		this.idModel = options.idModel;
		this.locTo=MG.Core.Coord2Loc(options.coord,{z:this.OFFSET_Z});
		this.rotTo=this.rotFrom=0;

		this.myModel = this.createModel(options.idModel,this.rotTo);
		this.myModel.skill=true;

		this.setCoord(options.coord);
		this.addModel(this.myModel);
		this.setRoute(options.path);
	};

	C.prototype = {
		getModel: function() {
			return this.myModel;
		},
		getLoc: function() {
			return this.getModelLoc(this.myModel);
		},
		setLoc: function(c) {
			this.setModelLoc(this.myModel, c);
			return this;
		},
		setRot: function(r) {
			if (this.getRot()!=r)
				this.setModelRot(this.myModel, r);
		},
		getRot: function(r) {
			return this.getModelRot(this.myModel);
		},
		setRoute: function(path) {
			if (path.length>0) {
				if (this.locTo.x==this.getLoc().x && this.locTo.y==this.getLoc().y && this.locTo.z==this.getLoc().z) {
					this.route = path;
					this.setAnimation("run");
					this.initAnimation();
					this.interval = setInterval(this.updateAnimation.bind(this),15);
				} else {
					this.route = new Array(this.route[0]);
					this.route = this.route.concat(path);
				}
			} else this.setActionAnimation();
		},
		setCoord: function(c,onlyCoord) {
			if (MG.maps[MG.mapId] && this.coord)
				MG.maps[MG.mapId].removeObstacle(this.coord);
			this.coord = c;
			if (MG.maps[MG.mapId])
				MG.maps[MG.mapId].addObstacle(this.coord);
			if (!onlyCoord)
				this.setLoc(MG.Core.Coord2Loc(c,{z:this.OFFSET_Z}));
		},
		getCoord: function() {
			return this.coord;
		},
		getAngleRotation: function(from, to) {
			var posX_relative=(to.x-from.x)/Math.sqrt(Math.pow((to.x-from.x),2)+Math.pow((to.y-from.y),2));
			var posY_relative=(to.y-from.y)/Math.sqrt(Math.pow((to.x-from.x),2)+Math.pow((to.y-from.y),2));
			var angle_X=Math.acos(posX_relative);
			var angle_Y=Math.asin(posY_relative);
			if (posY_relative>0)
				var angle=angle_X;
			else {
				if (posX_relative>0)
					var angle=angle_Y;
			else
				var angle=-angle_X;
			}
			return angle;
		},
		setAnimation: function(a) {
			this.setModelAnimation(this.myModel,a);
		},
		initAnimation: function(time_offset) {
			if (this.route.length>0) {
				this.locTo = MG.Core.Coord2Loc(this.route[0],{z:this.OFFSET_Z});
				this.locFrom = MG.Core.Coord2Loc(this.getCoord(),{z:this.OFFSET_Z});
				this.distTo = Math.sqrt(Math.pow(this.locTo.x-this.locFrom.x,2)+Math.pow(this.locTo.y-this.locFrom.y,2)+Math.pow(this.locTo.z-this.locFrom.z,2));
				this.timeInitAnimation=new Date().getTime()-(time_offset || 0);
				this.setRot(this.getAngleRotation(this.locFrom, this.locTo));
			}
		},
		updateAnimation: function() {
			var now=new Date().getTime();
			var distUpdate = this.velocity*(now-this.timeInitAnimation)/1000;
			var percent = (distUpdate/this.distTo);
			if (percent>=0.5)
			this.setCoord(this.route[0],true);
			if (percent>=1) {
				var r = this.route[0];
				this.route.shift();
				if (this.route.length>0)
					this.initAnimation(1000*(distUpdate-this.distTo)/this.velocity);
				else {
					clearInterval(this.interval);
					this.setCoord(r);
					this.setActionAnimation();
				}
			} else {
				var x = (this.locTo.x-this.locFrom.x)*percent;
				var y = (this.locTo.y-this.locFrom.y)*percent;
				var z = (this.locTo.z-this.locFrom.z)*percent;
				this.setLoc({x:this.locFrom.x+x,y:this.locFrom.y+y,z:this.locFrom.z+z},{z:this.OFFSET_Z});
			}
		},
		minusMana: function(mana) {
			this.mana-=mana;
		},
		minusLife: function(life) {
			this.life-=life;
		},
		setAction: function(ac) {
			this.action = ac;
		},
		setActionAnimation: function(ac) {
			if (this.action && this.action.animation) {
				this.setAnimation(this.action.animation);
				if (this.action.type!="conquer")
					this.setRot(this.getAngleRotation(this.getLoc(), MG.Core.Coord2Loc(this.action.coord,{z:this.OFFSET_Z})));
			} else
				this.setAnimation("stand");
		}
	};

	MG.Extend(C.prototype, MG.D3.Player);

	return C;

}(MG));