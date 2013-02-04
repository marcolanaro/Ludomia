MG.UI.Chat = (function(MG){

	MG.Socket.on('chat', function (data) {
		MG.chat.write(data);
	});

	var C = function(opt){
		var e=document.createElement("div");
		var e_content=document.createElement("div");
		var e_content_dl=document.createElement("dl");
		var e_form=document.createElement("form");
		var e_input=document.createElement("input");
		e.id="chat_wrapper";
		e_content.id="chat";
		e_form.method="post";
		e_form.action="/game/chat";
		e_form.addEventListener("submit", this.submit.bindListener(this), false);
		e_input.type="text";
		document.getElementById("body").appendChild(e);
		e.appendChild(e_content);
		e.appendChild(e_form);
		e_form.appendChild(e_input);
		e_content.appendChild(e_content_dl);

		this.e_input = e_input;
		this.e_content = e_content;
		this.e_content_dl = e_content_dl;
		this.lastuser="";
	};

	C.prototype={
		submit: function(e){
			MG.Socket.emit("chat",{ message: this.e_input.value });
			this.write({message: this.e_input.value, userName: MG.info.room.users[MG.info.user.id].name});
			this.e_input.value="";
			e.preventDefault();
		},
		write: function(data){
			if (this.lastuser!=data.userName)
				this.e_content_dl.innerHTML += "<dt>"+data.userName+"</dt>";
			this.e_content_dl.innerHTML += "<dd>"+data.message+"</dd>";
			this.e_content.scrollTop = this.e_content.scrollHeight;
			this.lastuser = data.userName;
		}
	};

	return C;

}(MG));
