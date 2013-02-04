exports.isEmpty = function(ob){
	for(var i in ob){return false;}
	return true;
}

exports.extend = function(destination, source){
	for(var property in source)
		if (source.hasOwnProperty(property)) {
			if (typeof source[property]==="object") {
				destination[property] = destination[property] || ((Object.prototype.toString.call(source[property])==="[object Array]") ? [] : {});
				this.extend(destination[property],source[property]);
			} else
				destination[property] = source[property];
		}
	return destination;
}