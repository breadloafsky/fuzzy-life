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

  
  
	loadTexture: function(gl, dims) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		

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
				//const a = (Math.sin(((i/width)*((j*4/height)))*Math.PI*4))*255;
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
		
		
		return texture;
	}

	
	
	
};

function isPowerOf2(value) {
	return (value & (value - 1)) === 0;
  }