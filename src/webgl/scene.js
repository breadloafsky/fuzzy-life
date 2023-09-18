
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
export function Scene(canvas, shaders, automaton) {
	this.automaton = automaton;
	this.canvas = canvas;
	this.initialized = false;
	this.fb = [];	//	frame buffers
	this.textures = [];
	this.kern = {};	//kernel texture
	this.shaders = shaders;
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

	this.resize();
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
	glUtils.loadTexture(gl, [64,64], this.kern);
	
	// create main textures
	for(let i = 0; i < 2; i++)
	{
		const texture = gl.createTexture();
		glUtils.loadTexture(gl, textureDims, texture, this.automaton.settings.textureFilter);
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

	const multiplier = Math.sqrt(1/(a*b))*Math.sqrt(this.automaton.settings.textureSize * 1000000)
	textureDims = [
		Math.round(a * multiplier),  
		Math.round(b * multiplier)
	];
	// update texture size
	this.textures.forEach((tex,i) => {
		glUtils.loadTexture(this.gl, textureDims, tex, this.automaton.settings.textureFilter);
	});
}

Scene.prototype.setTextureFilter = function(){
	const gl = this.gl;
	this.textures.forEach((tex,i) => {
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.automaton.settings.textureFilter == 0 ? gl.LINEAR : gl.NEAREST);	
	});
}



Scene.prototype.setKernels = function(url){
	glUtils.loadTexture(this.gl, [64,64], this.kern,0,url);
}



let fbCurrent = 0;

// draw
Scene.prototype.drawScene = function (time)  {
	if(!this.initialized)
		return;



	const {params, formattedParams, settings, brush} = this.automaton;



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
		
		gl.uniform1fv(shader.uniforms.brush.location, brush);

		gl.uniform1fv(shader.uniforms.uRules.location, formattedParams.rules);


		gl.uniform1i(shader.uniforms.uKernelRadius.location, params.convRadius);
		gl.uniform1f(shader.uniforms.uDelta.location, params.dt);
		gl.uniform1i(shader.uniforms.isPaused.location, settings.paused);

		gl.uniform1i(shader.uniforms.uReset.location, formattedParams.resetTexture);
		
		
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
	
	// render the result
	{
		gl.uniform1fv(shader.uniforms.uTextureDims.location, textureDims);
		gl.uniform1i(shader.uniforms.uGradient.location, settings.gradient);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[1-fbCurrent]);
		gl.viewport(0, 0, screen[0],screen[1]);	 
		drawScreen(gl);
	}
}











