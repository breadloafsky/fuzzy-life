export const shaders ={
	screen:{
		program: {},
		attributes: {
			aTextureCoord: {value:null},
			aVertexPosition: {value:null},
		},
		uniforms: {
			uSampler: {value:null},
			uTextureDims:{value:null},
			uGradient:{value:null},	// colouring
			uBrush:{value:null},	// paint brush
			uPostProcessing:{value:null},	// post-processing values
		},
	},
	
	frame:{
		program: {},
		attributes: {
			aTextureCoord: {value:null},
			aVertexPosition: {value:null},
			
		},
		uniforms: {
			uSampler: {value:null},	
			uTextureDims:{value:null},
			uKernelRadius:{value:null},
			uKern:{value:null},	// kernel texture
			uRules:{value:null},
			uDelta: {value:null},	// dt of integration
			uReset: {value:null},	// reset the texture
			uDebug:{value:null},	// DEBUG
			isPaused:{value:null},
			uBrush:{value:null},	// paint brush
		},
	},
};