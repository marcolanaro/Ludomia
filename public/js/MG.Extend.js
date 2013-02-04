MG.Extend = function(destination,source){
	for(var property in source)
		if (source.hasOwnProperty(property)) {
			if (typeof source[property]==="object") {
				destination[property] = destination[property] || ((Object.prototype.toString.call(source[property])==="[object Array]") ? [] : {});
				MG.Extend(destination[property],source[property]);
			} else
				destination[property] = source[property];
		}
	return destination;
};

MG.Extend(Function.prototype,{
	bind: function(THIS) {
		var __method = this, args=Array.prototype.slice.call(arguments, 1);
		return function() {
			return __method.apply(THIS, args);
		}
	},
	bindListener: function(THIS) {
		var __method = this, args=Array.prototype.slice.call(arguments, 1);
		return function(listen) {
			args = args.reverse();
			args[args.length] = listen;
			args = args.reverse();
			return __method.apply(THIS, args);
		}
	}
});