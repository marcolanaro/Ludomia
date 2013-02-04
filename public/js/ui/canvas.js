MG.UI.Canvas = (function(MG){

	var C = function(){
		this.view = false;

		var canvas = document.createElement("canvas");

		canvas.width=innerWidth;
		canvas.height=innerHeight;

		canvas.addEventListener("mousedown",this.mousedown.bindListener(this),false);
		canvas.addEventListener("mouseup",this.mouseup.bindListener(this),false);
		canvas.addEventListener("mousemove",this.mousemove.bindListener(this),false);

		this.canvas = canvas;
		document.getElementById("body").appendChild(this.canvas);
	};

	C.prototype={
		mousedown: function(e) {
			if(e.button==0){
				this.view=true;
				this.eStart=[e.clientX,e.clientY];
				this.cStart=[MG.camera.getLocX(),MG.camera.getLocY()];
			}
			e.preventDefault();
		},
		mouseup: function(e) {
			this.view=false;
			if (e.clientX==this.eStart[0] && e.clientY==this.eStart[1]) {
				var pick=MG.scene.pick(e.clientX,e.clientY);
				if (pick)
					MG.Socket.emit("click", pick.object.gameHash);
			}
		},
		mousemove: function(e) {
			if(this.view){
				var move=(this.eStart[0]-e.clientX)/this.canvas.width*20;
				var c=MG.users[MG.info.user.id].getLoc();
				var posX_relative=(this.cStart[0]-c.x)/MG.const.DIST_RADIUS;
				var posY_relative=(this.cStart[1]-c.y)/MG.const.DIST_RADIUS;
				var angle_X=Math.acos(posX_relative);
				var angle_Y=Math.asin(posY_relative);
				if (isNaN(angle_X)) angle_X=angle_Y;
				if (isNaN(angle_Y)) angle_Y=angle_X;
				if (posY_relative>0)
					var angle=angle_X;
				else {
					if (posX_relative>0)
						var angle=angle_Y;
					else
						var angle=2*Math.PI-angle_X;
				}
				var posX=c.x+MG.const.DIST_RADIUS*Math.cos(move+angle);
				var posY=c.y+MG.const.DIST_RADIUS*Math.sin(move+angle);
				var posZ=MG.const.DIST_HEIGHT;
				MG.camera.setLoc(posX,posY,posZ);
			}
		},
		get: function() {
			return this.canvas;
		}
	};

	MG.Extend(C.prototype,MG.Publisher);

	return C;

}(MG));
