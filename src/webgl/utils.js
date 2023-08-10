// plane vertices
const screenData ={
	coords:[
		-1.0,-1.0, 
		1.0,-1.0,
		1.0, 1.0, 
		1.0, 1.0,
		-1.0, -1.0, 
		-1.0, 1.0,  
	],
	texCoords:[
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0, 
		1.0, 1.0, 
	
		0.0, 0.0,
		0.0, 1.0,
	]
}


export const utils = {
	// Load Shader
	loadShader: function(gl, type, source)  {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(
			"err: " + gl.getShaderInfoLog(shader)
		);
		gl.deleteShader(shader);
		return null;
		}
	
		return shader;
	},	
	// Initialize shader program
	initShaderProgram: function(gl,vsSource, fsSource) {
		const vertexShader = utils.loadShader(gl, gl.VERTEX_SHADER, vsSource);
		const fragmentShader = utils.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert("Shader Error: " + gl.getProgramInfoLog(shaderProgram));
			return null;
		}
		return shaderProgram;
	},
	// load the shaders as static files
	initShaders: async function(gl, shaders){
		let promises = [];
		for (let shaderName in shaders)
		{	
			const promise = new Promise((resolve, reject) => {
				const shaderFiles = ["vs","fs"].map(async (e) => {
					const response = await fetch(`shaders/${shaderName}.${e}`);
					return await response.text();
				});
				Promise.all(shaderFiles).then(data => {
					const shader = shaders[shaderName];
					shader.program = utils.initShaderProgram(
						gl,
						data[0], 
						data[1], 
					);
					for(let attributeName in shader.attributes){
						shader.attributes[attributeName].location = gl.getAttribLocation(shader.program, attributeName);
					}
					for(let uniformName in shader.uniforms){
						shader.uniforms[uniformName].location = gl.getUniformLocation(shader.program, uniformName);
					}
					resolve();
				});
			});
			promises.push(promise);	
		};
		return promises;
	},
	initAttributes : function(gl, shaders){
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenData.coords), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		const texCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenData.texCoords), gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		shaders.frame.attributes.aTextureCoord.value = texCoordBuffer;
		shaders.frame.attributes.aVertexPosition.value = positionBuffer;
	},	
	loadTexture: function(gl, dims, textureP) {
		gl.bindTexture(gl.TEXTURE_2D, textureP);
		const level = 0;
		const internalFormat = gl.RGB;
		const width = dims[0];
		const height = dims[1];
		const border = 0;
		const srcFormat = gl.RGB;
		const srcType = gl.UNSIGNED_BYTE;
		
		let arr = [];

		for(let j = 0; j < height; j++)
		{
			for(let i = 0; i < width; i++)
			{
				const a = Math.sin(((j-height/2)/height)*((i-width/2)/width)*40*Math.PI)*255;
				[a,a,a].forEach((e) => arr.push(e));
			}
		}
		const pixel = new Uint8Array(arr);
		gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
		gl.texImage2D(
			gl.TEXTURE_2D,
			level,
			internalFormat,
			width,
			height,
			border,
			srcFormat,
			srcType,
			pixel,
		);
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		// gl.LINEAR gl.NEAREST
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);	

	},
};
