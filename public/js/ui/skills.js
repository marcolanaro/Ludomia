MG.UI.Skills = (function(MG){

	function setClassUsing(using,id,el) {
		el.style.webkitAnimationName = "none";
		el.style.mozAnimationName = "none";
		el.style.AnimationName = "none";

		if (using == id)
			el.style.boxShadow = "inset 0 0 32px white";
		else
			el.style.boxShadow = "inset 0 0 32px black";
	}

	var C = function(obj){
		this.skills = obj;
		this.ref = [];
		this.using = this.skills[0].id;

		var eSkills=document.createElement("div");
		eSkills.id="skills";
		document.getElementById("body").appendChild(eSkills);

		for (var i=0;i<this.skills.length;i++)
			this.create(this.skills[i],i);
	};

	C.prototype={
		create: function(obj,i){
			var i = i || this.ref.length;
			this.ref[obj.id] = i;
			if (!this.skills[i])
				this.skills[i]=obj;
			this.skills[i].reloading=false;
			
			var eSkill=document.createElement("a");
			eSkill.id="skill_" + obj.id;
			eSkill.i=i;
			eSkill.style.position="absolute";
			eSkill.style.right=i*(64+5)+"px";
			eSkill.className = "skill";
			setClassUsing(this.using,obj.id,eSkill);
			eSkill.href="#";
			eSkill.style.backgroundImage="url('img/skills/"+obj.id+".jpg')";
			eSkill.addEventListener("click",this.select.bind(this,obj.id),false);
			document.getElementById("skills").appendChild(eSkill);

			var tSkill=document.createElement("span");
			tSkill.innerHTML = obj.name+"<br>Livello: 1";
			eSkill.appendChild(tSkill);			

			this.skills[i].el=eSkill;
		},
		select: function(id) {
			var s = this.skills[this.ref[this.using]];
			if (!s.reloading)
				s.el.style.boxShadow = "inset 0 0 32px black";
			this.using = id;
			this.skills[this.ref[id]].el.style.boxShadow = "inset 0 0 32px white";
		},
		use: function(){
			var	id = this.using;
				i = this.ref[id],
				el = this.skills[i].el,
				t = this.skills[i].time;

			if (!this.skills[i].reloading && MG.user.mana_eff>=this.skills[i].cost) {
				this.fire("useSkill",this.skills[i].cost);
				this.skills[i].reloading=true;

				el.style.cursor = "default";
				el.style.webkitAnimationName = "slidein";
				el.style.mozAnimationName = "slidein";
				el.style.AnimationName = "slidein";

				el.style.webkitAnimationDuration = t+"s";
				el.style.mozAnimationDuration = t+"s";
				el.style.AnimationDuration = t+"s";
				setTimeout(this.reloaded.bind(this,id),t*1000);
			}
		},
		reloaded: function(id){
			this.skills[this.ref[id]].reloading=false;
			setClassUsing(this.using,id,this.skills[this.ref[id]].el);
		}
	};

	MG.Extend(C.prototype,MG.Publisher);

	return C;

}(MG));