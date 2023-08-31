
import { get } from 'svelte/store';
import { glUtils } from './glUtils';

var screen = [100,100];
var textureDims = [10,10];





function drawScreen(gl, vertexCount = 6) {
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
}
function setAttribute(gl, attrib, num=2, type=null, normalize=false, stride=0, offset=0)
{
	type ??=gl.FLOAT;
	gl.bindBuffer(gl.ARRAY_BUFFER, attrib.value);
	gl.vertexAttribPointer(attrib.location,num,type,normalize,stride,offset);
	gl.enableVertexAttribArray(attrib.location);
};




// create scene
export function Scene(canvas) {
	
	this.quality = 2;
	this.initialized = false;
	this.fb = [];	//	frame buffers
	this.textures = [];
	this.kern = {};	//kernel texture
	this.shaders ={
		screen:{
			program: {},
			attributes: {
				aTextureCoord: {value:null},
				aVertexPosition: {value:null},
			},
			uniforms: {
				uSampler: {value:null},
				uTextureDims:{value:null},
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
				uKern:{value:null},
				
				uRules:{value:null},

				uDelta: {value:null},

				uNumberOfRules:{value:null},
				uNumberOfKernels:{value:null},

				uDebug:{value:null},	// DEBUG
				isPaused:{value:null},
				brush:{value:null},	// paint brush
			},
		},
		
	};
	const params = {
		premultipliedAlpha: false, 
		antialias: true,
		depth:true,
	};
	this.gl =
		canvas.getContext("webgl",params) || canvas.getContext("experimental-webgl",params);
	if (!this.gl) {
		alert("WebGL ERROR.");
		return;
	}
	const resize = () =>{
		screen = [
			window.innerWidth,
			window.innerHeight,
		];
		canvas.setAttribute("width", screen[0]);
		canvas.setAttribute("height", screen[1]);
		this.gl.viewport( 0, 0, screen[0], screen[1] );
		textureDims = [
			(screen[0]/this.quality),  
			(screen[1]/this.quality)
		];
		this.generateTexture();
	}
	window.addEventListener("resize",() => resize());
	resize();
	return this;
}


// initialize the scene
Scene.prototype.init = async function(){
	const gl = this.gl;
	Promise.all(await glUtils.initShaders(this.gl, this.shaders)).then(()=>{
		// init attributes
		glUtils.initAttributes(this.gl,this.shaders);	

		// create kernel textures

		this.kern = gl.createTexture();
		glUtils.loadTexture(gl, [64,64], this.kern,"canvas.png");
		
		// create main textures
		for(let i = 0; i < 2; i++)
		{
			const texture = gl.createTexture();
			glUtils.loadTexture(gl, textureDims, texture);
			this.textures.push(texture);

			let fb  = gl.createFramebuffer();
			this.fb.push(fb);
			gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures[i], 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
		this.initialized = true;
	});
}


// create a texture
Scene.prototype.generateTexture = function(){
	this.textures.forEach((tex,i) => {
		glUtils.loadTexture(this.gl, textureDims, tex);
	});
}


Scene.prototype.setKernels = function(url){
	glUtils.loadTexture(this.gl, [64,64], this.kern,url);
}



let fbCurrent = 0;

// draw
Scene.prototype.drawScene = function (time, params, formattedParams, settings, input)  {
	if(!this.initialized)
		return;

	

	const gl = this.gl;
	const shaders =  this.shaders;
	const fb = this.fb;

	gl.enable(gl.CULL_FACE);
	//  clear scene
	//gl.clearColor(0.0, 0.0, 0.0, 0.0);  
	//gl.clear(gl.COLOR_BUFFER_BIT );  


	// use the shader
	let shader = shaders.frame;
	gl.useProgram(shader.program);

	// bind the vertex position and texture coordinates
	setAttribute(gl, shader.attributes.aVertexPosition);
	setAttribute(gl, shader.attributes.aTextureCoord);
	
	fbCurrent  =  1 - fbCurrent;	//flip the current framebuffer index
	//	process the texture
	{
		//set the parameters
		gl.uniform1fv(shader.uniforms.uTextureDims.location, textureDims);
		
																		// this is confusing. ToDo: swap the var names between.
		gl.uniform1fv(shader.uniforms.brush.location, input.brush);

		gl.uniform1fv(shader.uniforms.uRules.location, formattedParams.rules);

		gl.uniform1i(shader.uniforms.uNumberOfRules.location, params.numberOfRules);
		gl.uniform1i(shader.uniforms.uNumberOfKernels.location, params.kernels.length);

		gl.uniform1i(shader.uniforms.uKernelRadius.location, params.convRadius);

		
		gl.uniform1f(shader.uniforms.uDelta.location, params.dt);
		gl.uniform1i(shader.uniforms.isPaused.location, settings.paused);
		

		
		gl.uniform1i(shader.uniforms.uSampler.location, 0);  // texture unit 0
		gl.uniform1i(shader.uniforms.uKern.location, 1);  // texture unit 0



		gl.bindFramebuffer(gl.FRAMEBUFFER, fb[fbCurrent]);


		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.kern); // bind kernel texture
		gl.viewport(0, 0, 64,64);


		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[1-fbCurrent]);	// bind main texture
		gl.viewport(0, 0, textureDims[0],textureDims[1]);

		
		
		
		
		drawScreen(gl);
	}


	shader = shaders.screen;
	gl.useProgram(shader.program);
	
	

	//	render to screen
	//if(fbCurrent == 0)
	{
		gl.uniform1fv(shader.uniforms.uTextureDims.location, textureDims);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[1-fbCurrent]);
		gl.viewport(0, 0, screen[0],screen[1]);	 
		drawScreen(gl);
	}
}











