MG.UI.Options = (function(MG){

	var C = function(obj){
		var eOptions=document.createElement("div");
		eOptions.style.position="absolute";
		eOptions.style.right="2px";
		eOptions.style.top="2px";
		eOptions.style.padding="10px";
		eOptions.style.cursor="pointer";
		eOptions.className = "front";
		eOptions.innerHTML = MG.i18n.Options;
		document.getElementById("body").appendChild(eOptions);
		eOptions.addEventListener("click",this.select.bind(this),false);
		this.e = eOptions;

		var eLabel=document.createElement("div");
		eLabel.style.position="absolute";
		eLabel.style.right="2px";
		eLabel.style.top="2px";
		eLabel.style.paddingTop="5px";
		eLabel.style.paddingBottom="5px";
		eLabel.style.width="200px";
		eLabel.style.display="none";
		eLabel.className = "front";
		document.getElementById("body").appendChild(eLabel);
		this.l = eLabel;

		var eUL=document.createElement("ul");
		eUL.style.listStyleType="none";
		eUL.style.margin="0px";
		eUL.style.padding="0px";
		eLabel.appendChild(eUL);
		this.eUL=eUL;

		this.btn(MG.i18n.Delete, function(){this.l.style.display="none";});
		this.btn(MG.i18n.ExitGame, this.exit, true);
		this.btn(MG.i18n.Logout, this.logout);
	};

	C.prototype={
		select: function() {
			this.l.style.display = "inline";
		},
		btn: function(str, callback, border) {
			var eLI=document.createElement("li");
			if (border)
				eLI.style.borderTop="thin dotted #555555";
			this.eUL.appendChild(eLI);
			var eA=document.createElement("a");
			eA.innerHTML=str;
			eA.style.cursor="pointer";
			eA.style.display="block";
			eA.style.width="180px";
			eA.style.padding="10px";
			eA.style.textAlign="center";
			eA.addEventListener("mouseover",this.over.bind(this,eA),false);
			eA.addEventListener("mouseout",this.out.bind(this,eA),false);
			eA.addEventListener("click",callback.bind(this),false);
			eLI.appendChild(eA);
		},
		over: function(e) {
			e.style.backgroundColor="#555555";
			e.style.color="#ffffff";
		},
		out: function(e) {
			e.style.backgroundColor="transparent";
			e.style.color="#000000";
		},
		exit: function() {
			if (confirm(MG.i18n.ExitAlert))
				document.location.href="game/exit";
		},
		logout: function() {
			if (confirm(MG.i18n.ExitAlert))
				document.location.href="logout";
		}
	};

	return C;

}(MG));
