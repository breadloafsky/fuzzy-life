
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
export function Scene(canvas, shaders, params, tempParams, settings) {
	this.params = params;
	this.tempParams = tempParams;
	this.settings = settings;
	this.canvas = canvas;
	this.initialized = false;
	this.fb = [];	//	frame buffers
	this.textures = [];
	this.kern = {};	//kernel texture
	this.gradient = {} // colour gradient texture
	this.shaders = shaders;
	const glParams = {
		premultipliedAlpha: false, 
		antialias: true,
		depth:true,
	};
	this.gl =
		canvas.getContext("webgl",glParams) || canvas.getContext("experimental-webgl",glParams);
	if (!this.gl) {
		alert("WebGL ERROR.");
		return;
	}


	this.init();
	return this;
}



// initialize the scene
Scene.prototype.init = function(){
	const gl = this.gl;
	// init shaders
	glUtils.initShaders(this.gl, this.shaders)
	// init attributes
	glUtils.initAttributes(this.gl,this.shaders);	

	// create kernel textures

	this.kern = gl.createTexture();
	glUtils.resetTexture(gl, [64,64], this.kern);

	this.gradient = gl.createTexture();
	glUtils.resetTexture(gl, [16,16], this.gradient);
	
	// create main textures and framebuffers
	for(let i = 0; i < 2; i++)
	{
		const texture = gl.createTexture();
		glUtils.resetTexture(gl, textureDims, texture, this.settings.textureFilter);
		this.textures.push(texture);
		const fb  = gl.createFramebuffer();
		this.fb.push(fb);
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures[i], 0);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}
	this.initialized = true
}


// resize
Scene.prototype.resize = function(){
	screen = [
		window.innerWidth,
		window.innerHeight,
	];
	const [a,b] = screen
	this.canvas.setAttribute("width", a);
	this.canvas.setAttribute("height", b);
	this.gl.viewport( 0, 0, a, b );

	const multiplier = Math.sqrt(1/(a*b))*Math.sqrt(this.settings.textureSize * 1000000)
	textureDims = [
		Math.round(a * multiplier),  
		Math.round(b * multiplier)
	];
	// update texture size
	this.textures.forEach((tex,i) => {
		glUtils.resetTexture(this.gl, textureDims, tex, this.settings.textureFilter);
	});
}

Scene.prototype.setTextureFilter = function(){
	const gl = this.gl;
	this.textures.forEach((tex,i) => {
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.settings.textureFilter == 0 ? gl.NEAREST : gl.LINEAR);	
	});
}



Scene.prototype.setKernels = function(url, callback){
	glUtils.loadTexture(this.gl, [64,64], this.kern,url, callback);
}
Scene.prototype.setGradient = function(url){
	glUtils.loadTexture(this.gl, [64,64], this.gradient,url);
}

let fbCurrent = 0;

// draw
Scene.prototype.drawScene = function (process)  {
	if(!this.initialized)
		return;

	const brush = [this.tempParams.brush.x,this.tempParams.brush.y,this.tempParams.brush.r,this.tempParams.brush.type];
	const gl = this.gl;
	const shaders =  this.shaders;
	const fb = this.fb;

	gl.enable(gl.CULL_FACE);

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
		gl.uniform1fv(shader.uniforms.uBrush.location, brush);
		gl.uniform1i(shader.uniforms.uKernelRadius.location, this.tempParams.convRadius);
		gl.uniform1f(shader.uniforms.uDelta.location, this.params.dt);
		gl.uniform1fv(shader.uniforms.uRules.location, this.tempParams.rules);
		gl.uniform1i(shader.uniforms.isPaused.location, this.tempParams.paused || !process);
		gl.uniform1i(shader.uniforms.uReset.location, this.tempParams.resetTexture);		
		
		

		gl.bindFramebuffer(gl.FRAMEBUFFER, fb[fbCurrent]);

		//set texture units
		gl.uniform1i(shader.uniforms.uSampler.location, 0);  
		gl.uniform1i(shader.uniforms.uKern.location, 1);  

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.kern); // bind kernel texture
		gl.viewport(0, 0, 64,64);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[1-fbCurrent]);	// bind main texture
		gl.viewport(0, 0, textureDims[0],textureDims[1]);
		
		drawScreen(gl);
	}


	// render the result
	shader = shaders.screen;
	gl.useProgram(shader.program);
	{
		gl.uniform1fv(shader.uniforms.uTextureDims.location, textureDims);
		gl.uniform1iv(shader.uniforms.uPostProcessing.location, [this.settings.blur, this.settings.frameSmoothing]);
		gl.uniform1fv(shader.uniforms.uBrush.location, brush);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		//set texture units
		gl.uniform1i(shader.uniforms.uSampler.location, 0);  
		gl.uniform1i(shader.uniforms.uGradient.location, 1);  

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.gradient); // bind gradient texture
		gl.viewport(0, 0, 64,64);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[1-fbCurrent]);
		gl.viewport(0, 0, screen[0],screen[1]);	 
		drawScreen(gl);
	}
}











