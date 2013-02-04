MG.UI.Bar = (function(MG){

	var C = function(opt){
		var e=document.createElement("div");
		e.id=opt.name;
		e.className="statusbar";
		document.getElementById("body").appendChild(e);
		var Back=document.createElement("div");
		e.appendChild(Back);
		this.e=Back;
		this.draw(100);
	};

	C.prototype={
		draw: function(p,blockAnimation){
			if (!blockAnimation) {
				var f = parseInt(this.e.style.width) || 0;
				var browser = "webkit";
				var ua = navigator.userAgent;
				if (ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1) browser = "moz";
				document.styleSheets[document.styleSheets.length - 1].insertRule("@-"+browser+"-keyframes StatusBar_from"+f+"_to"+p+" { from { width: "+f+"%; } to {width: " + p + "%;} }", document.styleSheets[document.styleSheets.length - 1].cssRules.length);
				this.e.style.webkitAnimationName = "StatusBar_from"+f+"_to"+p;
				this.e.style.webkitAnimationDuration = (2/100*Math.abs(f-p))+"s";
				this.e.style.webkitAnimationTimingFunction = "ease-out";
				this.e.style.mozAnimationName = "StatusBar_from"+f+"_to"+p;
				this.e.style.mozAnimationDuration = (2/100*Math.abs(f-p))+"s";
				this.e.style.mozAnimationTimingFunction = "ease-out";
				this.e.style.AnimationName = "StatusBar_from"+f+"_to"+p;
				this.e.style.AnimationDuration = (2/100*Math.abs(f-p))+"s";
				this.e.style.AnimationTimingFunction = "ease-out";
			}
			this.e.style.width = p+"%";
		}
	};

	return C;

}(MG));
