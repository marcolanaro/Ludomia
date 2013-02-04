MG.UI.Profile = (function(MG){

	var C = function(obj){
		var eProfile=document.createElement("div");
		eProfile.id="profile";
		eProfile.style.backgroundImage="url('img/users/"+obj.id+".png')";
		this.profile=eProfile;
		document.getElementById("body").appendChild(eProfile);

		this.life = new MG.UI.Bar({name:"life",max:obj.life,eff:obj.life_eff});
		this.mana = new MG.UI.Bar({name:"mana",max:obj.mana,eff:obj.mana_eff});

		setInterval(this.updateMana.bind(this),1000);
	};

	C.prototype={
		useMana: function(q){
			if (MG.info.user.mana_eff>=q)
				MG.info.user.mana_eff-=q;
			this.mana.draw(100*MG.info.user.mana_eff/MG.info.user.mana);
		},
		useLife: function(q){
			if (MG.info.user.life_eff>=q)
				MG.info.user.life_eff-=q;
			this.life.draw(100*MG.info.user.life_eff/MG.info.user.life);
		},
		updateMana: function(){
			MG.info.user.mana_eff = Math.min(MG.info.user.mana_eff+MG.info.user.mana_vel,MG.info.user.mana);
			this.mana.draw(100*MG.info.user.mana_eff/MG.info.user.mana,true);
		}
	};

	return C;

}(MG));
