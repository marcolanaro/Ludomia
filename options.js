exports.get = function(){

	return {
		IO:		{PORT: 3001},
		STATIC:		{PATH: '/public'},
		APP:		{PORT: 3000},
		SESSION:	{SECRET:"stringa"},
		RESOURCES:	{PATH: '/resources'},
		languages:	["en", "it"]
	}

};
