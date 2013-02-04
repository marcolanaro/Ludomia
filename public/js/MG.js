var MG = MG || {
	const: {
		DIST_HEIGHT: 20,
		DIST_RADIUS: 30
	},
	// Classi
	Core: {},
	UI: {},
	D3: {},

	// Oggetti
	mesh: {},
	maps: [],
	textures: [],
	materials: [],
	users: [],
	info: {}
};



MG.Req = function(path,callback) {
	reqwest({
		url: path,
		type: 'json',
		method: 'get',
		error: function (err) { },
		success: function (resp) {
			callback(resp);
		}
	})
};


MG.Publisher = {
	subscribers: {
		any: []
	},
	on: function(type,fn,context) {
		type=type || "any";
		fn = typeof fn === "function" ? fn : context[fn];

		if (typeof this.subscribers[type] === "undefined")
			this.subscribers[type] = [];

		this.subscribers[type].push({fn:fn,context:context || this});
	},
	remove: function(type,fn,context) {
		this.visitSubscribers("unsubscribe",type,fn,context);
	},
	fire: function(type,pubblication) {
		this.visitSubscribers("publish",type,pubblication);
	},
	visitSubscribers: function(action,type,arg,context) {
		var	pubtype = type || "any",
			subscribers = this.subscribers[pubtype],
			i,
			max = subscribers ? subscribers.length : 0;

		for (i = 0;i<max;i+=1) {
			if (action==="publish")
				subscribers[i].fn.call(subscribers[i].context,arg);
			else
				if (subscribers[i].fn === arg && subscribers[i].context === context)
					subscribers.splice(i,1);
		}
	}
}