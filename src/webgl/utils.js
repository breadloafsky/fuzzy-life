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

  
  
	loadTexture: function(gl, resolution) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		

		const level = 0;
		const internalFormat = gl.RGB;
		const width = resolution;
		const height = resolution;
		const border = 0;
		const srcFormat = gl.RGB;
		const srcType = gl.UNSIGNED_BYTE;
		
		let arr = [];
		for(let i = 0; i < width*height; i++)
		{
			let a = Math.random();

			// debug
			// if(i/width > height/5 && i%width > width/2)
			// 	a = 0

			a = a *255;
			[a,a,a].forEach((e) => arr.push(e));
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
		

		// check if the resolution value is a powOf2
		if (isPowerOf2(width) && isPowerOf2(height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} 
		else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		// gl.LINEAR gl.NEAREST
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);	
		
		
		return texture;
	}
	
	
};

function isPowerOf2(value) {
	return (value & (value - 1)) === 0;
  }