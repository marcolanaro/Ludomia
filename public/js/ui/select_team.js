MG.UI.Select_Team = (function(MG){

	MG.Socket.on('userJoinGroup', function(data) {
		MG.info.room.users[data.user_id].group = data.group_id;
		MG.select_team.remove(data.user_id);
		MG.select_team.insert(MG.info.room.users[data.user_id]);
	});
	MG.Socket.on('startGame', function(data) {
		location.reload(true);

		//document.getElementById("body").innerHTML="";
		//new MG.Core.Game(data);
	});
	MG.Socket.on('userAcceptedInit', function(data) {
		MG.info.room.users[data.user_id].AcceptedInit = true;
		if (data.user_id == MG.info.user.id)
			document.getElementById("btnAcceptInit").parentNode.removeChild(document.getElementById("btnAcceptInit"));
		document.getElementById("user_"+data.user_id).innerHTML+="Ok!";
		MG.select_team.checkIfStart();
	});

	var C = function(users){
		for (var i = 0; i < users.length; i += 1)
			if (users[i] != false)
				this.insert(users[i]);
		this.checkIfStart();
	};

	C.prototype={
		user: function(user){
			if (user.group === 0)
				var color = "99ff99";
			else {
				if (user.group === 1)
					var color = "9999ff";
				else
					var color = "ff9999";
			}
			var html = '<div class="row"><div id="user_'+user.id+'" class="span6" style="background-color:#'+color+';border: thin solid #000;"><img src="./img/users/'+user.id+'.png"><div style="float:right;">';
			if (MG.info.room.users[user.id].AcceptedInit!=true && user.group !== 0 && (MG.info.user.id == 0 || MG.info.user.id == user.id))
				html += '<a class="btn btn-small" href="javascript:MG.select_team.moveInGroup(0,'+user.id+');"><i class="icon-chevron-left"></i></a>';
			html += ' ';
			if (MG.info.room.users[user.id].AcceptedInit!=true && user.group !== 1 && (MG.info.user.id == 0 || MG.info.user.id == user.id))
				html +='<a class="btn btn-small" href="javascript:MG.select_team.moveInGroup(1,'+user.id+');"><i class="icon-chevron-right"></i></a>';
			html += '<br>'+user.name+'</div>';
			if (MG.info.room.users[user.id].AcceptedInit==true)
				html+="Ok!";
			html += '</div></div>';
			return html;
		},
		insert: function(user){
			if (typeof user.group == "number") {
				var el = "group"+user.group;
				if (MG.info.room.users[MG.info.user.id].AcceptedInit == true) {
					var e = document.getElementById("btnAcceptInit");
					if (e) e.parentNode.removeChild(e);
				} else if (MG.info.user.id == user.id)
					document.getElementById("btnAcceptInit").className="btn btn-large btn-success";
			} else
				var el = "users";
			document.getElementById(el).innerHTML += this.user(user);
		},
		remove: function(id){
			var elem = document.getElementById("user_"+id);
			elem.parentNode.removeChild(elem);
		},
		moveInGroup: function(group, id){
			if (MG.info.user.id == 0 || MG.info.user.id == id)
				MG.Socket.emit("userJoinGroup",{ user_id: id, group_id: group });
		},
		start: function() {
			if (MG.info.user.id == 0)
				MG.Socket.emit("startGame");
		},
		checkIfStart: function() {
			if (MG.info.user.id == 0) {
				var check = true;
				var u = MG.info.room.users;
				for (var i=0; i<u.length; i+=1) {
					if (u[i].AcceptedInit!=true)
						check = false;
				}
				if (check==true)
					document.getElementById("controls").innerHTML = '<input type="button" class="btn btn-primary btn-large" value="Start" onClick="MG.select_team.start();">' + document.getElementById("controls").innerHTML;
			}
		},
		acceptedInit: function() {
			MG.Socket.emit("userAcceptedInit");
		}
	};

	return C;

}(MG));
