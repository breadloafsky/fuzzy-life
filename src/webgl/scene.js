
import { get } from 'svelte/store';
import { utils } from './utils';

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
				uDebug:{value:null},
				isPaused:{value:null},
				sigmoids: {value:null},
				slopes:{value:null},	//sigmoid slopes
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
	Promise.all(await utils.initShaders(this.gl, this.shaders)).then(()=>{
		// init attributes
		utils.initAttributes(this.gl,this.shaders);	
		// create frame buffers
		for(let i = 0; i < 2; i++)
		{
			const texture = gl.createTexture();
			utils.loadTexture(gl, textureDims, texture);
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
	const gl = this.gl;
	this.textures.forEach((tex,i) => {
		utils.loadTexture(gl, textureDims, tex);
	});
}
  

let fbCurrent = 0;

// draw
Scene.prototype.drawScene = function (time, params, settings, input)  {
	if(!this.initialized)
		return;

	

	const gl = this.gl;
	const shaders =  this.shaders;
	const fb = this.fb;

	gl.enable(gl.CULL_FACE);
	//  clear scene
	gl.clearColor(0.0, 0.0, 0.0, 0.0);  
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
		gl.uniform1fv(shader.uniforms.sigmoids.location, params.sigmoids);
		gl.uniform1fv(shader.uniforms.slopes.location, params.slopes);
		gl.uniform1i(shader.uniforms.isPaused.location, settings.paused);
		gl.uniform1f(shader.uniforms.uDebug.location, settings.debugVal);
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb[fbCurrent]);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[1-fbCurrent]);
		
		gl.viewport(0, 0, textureDims[0],textureDims[1]);
		drawScreen(gl);
	}


	shader = shaders.screen;
	gl.useProgram(shader.program);
	
	

	//	render to screen
	if(fbCurrent == 0)
	{
		gl.uniform1fv(shader.uniforms.uTextureDims.location, textureDims);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
		gl.viewport(0, 0, screen[0],screen[1]);	 
		drawScreen(gl);
	}
}











