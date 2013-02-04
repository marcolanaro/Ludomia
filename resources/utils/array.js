exports.without = function(a, o){
	var b = new Array();
	if (typeof a.length == "number") {
		for (var i = 0; i < a.length; i += 1)
			if (a[i] != o)
				b[b.length] = a[i];
		return b;
	} else return a;
}

exports.position = function(a, o){
	for (var i = 0; i < a.length; i += 1)
		if (JSON.stringify(a[i]) == JSON.stringify(o))
			return i;
	return -1;
}

exports.join = function(a, o){	
	if (typeof o == "number")
		a.push(o);
	else {
		if (typeof o != "boolean") {
			for (var i = o.length - 1; i >= 0; i -= 1) {
				a.push(o[i]);
			}
		}
	}
}