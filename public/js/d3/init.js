MG.D3.Init = (function(MG){

	var C = function(){
		this.LAST_TIME=0;
		this.FRAMERATEBUFFER=60;
		this.init();
	};

	C.prototype = {
		init: function() {

			MG.canvas = new MG.UI.Canvas();
			MG.renderer = new GLGE.Renderer(MG.canvas.get());

			MG.light=(new GLGE.Light()).setType(GLGE.L_DIR).setRotY(20).setLoc(0,5,0);
			MG.scene = (new GLGE.Scene()).setBackgroundColor("#161616").setAmbientColor("#fff").addChild(MG.light);

			MG.camera = new GLGE.Camera();

			MG.scene.setCamera(MG.camera);
			MG.renderer.setScene(MG.scene);

			setInterval(this.render.bind(this),15);
		},
		render: function() {
			var now=parseInt(new Date().getTime());
			var tick = now-this.LAST_TIME;
	   		this.FRAMERATEBUFFER=Math.round(((this.FRAMERATEBUFFER*9)+1000/tick)/10);
			MG.renderer.render();
			this.LAST_TIME=now;
		},
		setCamera: function() {
			MG.camera.setLoc(MG.users[MG.info.user.id].getLoc().x+MG.const.DIST_RADIUS,MG.users[MG.info.user.id].getLoc().y,MG.const.DIST_HEIGHT).setLookat(MG.users[MG.info.user.id].getModel());
		}
	};

	return C;

}(MG));
