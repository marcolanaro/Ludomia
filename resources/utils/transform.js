exports.Central2Lateral = function(c, Lx, Ly) {
	return {
		x: c.x + this.OffsetX(Lx),
		y: c.y + this.OffsetY(Ly),
		z: c.z
	}
}

exports.Lateral2Central = function(c, Lx, Ly) {
	return {
		x: c.x - this.OffsetX(Lx),
		y: c.y - this.OffsetY(Ly),
		z: c.z
	}		
}

exports.OffsetX = function(Lx) {
	return Math.floor(Lx/2);
}

exports.OffsetY = function(Ly) {
	return Math.floor(Ly/2);
}
