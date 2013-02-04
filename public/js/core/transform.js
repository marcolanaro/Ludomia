MG.Core.Coord2Loc = function(coord,offset) {
	if (offset==undefined) offset = {x:0,y:0,z:0};
	return {
		x: 2*coord.x + (offset.x || 0),
		y: 2*coord.y + (offset.y || 0),
		z: 2*coord.z + (offset.z || 0)
	}
}

MG.Core.Vec2Coord = function(n,Ld) {
	return {
		x: (n % Ld),
		y: Math.floor(n / Ld)
	}		
}

MG.Core.Coord2Vec = function(coord,Ld,Lw) {
	return coord.x + coord.y*Ld + coord.z*Lw*Ld;			
}

MG.Core.OffsetDepth = function(Ld) {
	return Math.floor(Ld/2);
}

MG.Core.OffsetWeight = function(Lw) {
	return Math.floor(Lw/2);
}

MG.Core.toLateralCoord = function(coord,Ld,Lw) {
	return {
		x: coord.x + MG.Core.OffsetDepth(Ld),
		y: coord.y + MG.Core.OffsetDepth(Lw),
		z: coord.z
	}
}

MG.Core.toCentralCoord = function(coord,Ld,Lw) {
	return {
		x: coord.x - MG.Core.OffsetDepth(Ld),
		y: coord.y - MG.Core.OffsetDepth(Lw),
		z: coord.z
	}
			
}