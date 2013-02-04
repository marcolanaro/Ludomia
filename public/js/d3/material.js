MG.addMaterial = function(path) {
	if (!MG.materials[path]) MG.materials[path] = new MG.D3.Material(path);
}

MG.getMaterial = function(path) {
	return MG.materials[path].get();
}

MG.D3.Material = (function(MG){
	
	var C = function(path){
		this.path=path;

		if (!MG.textures[path]) MG.textures[path] = (new GLGE.Texture()).setSrc( path );

		var materialLayer = (new GLGE.MaterialLayer()).setTexture( MG.textures[path] ).setMapinput( GLGE.UV1 ).setMapto( GLGE.M_COLOR );
		
		this.mat = (new GLGE.Material()).addTexture( MG.textures[path] ).addMaterialLayer( materialLayer ).setSpecular(0);
	};

	C.prototype={
		get: function() {
			return this.mat;
		}
	};

	return C;

}(MG));
