import { shaders } from '../shaders/shaders';
import {vec3, mat4, mat3} from 'gl-matrix';
import { get } from 'svelte/store';
import { utils } from './utils';

var screen = [100,100];
var textureDims = [10,10];



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




// initialize the scene
export function Scene(canvas) {

	this.quality = 2;

	this.initialized = false;

	this.fb = [];	//	frame buffer

	this.textures = [];

	this.shaders ={
		basic:{
			program: {},
			attributes: {
				aTextureCoord: {value:null},
				aVertexPosition: {value:null},
				
			},
			uniforms: {
				uSampler: {value:null},
				uProcessVal: {value:null},
				uTextureDims:{value:null},
				inputs: {value:null},
			},
		}
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
		if(this.initialized)
			this.drawScene();
	}

	window.addEventListener("resize",() => resize());
	resize();

	
	this.init();

	this.initialized = true;

	return this;
}


Scene.prototype.init = function(){
	const gl = this.gl;
	// load the shaders
	for (let shaderName in this.shaders)
	{
		const shader = this.shaders[shaderName];
		shader.program = this.initShaderProgram( 
			shaders[shaderName+"Vs"], 
			shaders[shaderName+"Fs"], 
		);
		for(let attributeName in shader.attributes){
			shader.attributes[attributeName].location = gl.getAttribLocation(shader.program, attributeName);
		}
		for(let uniformName in shader.uniforms){
			shader.uniforms[uniformName].location = gl.getUniformLocation(shader.program, uniformName);
		}
	};

	
	// init buffers
	this.initBuffers();
	
	// create frame buffers
	for(let i = 0; i < 2; i++)
	{
		let fb  = gl.createFramebuffer();
		this.fb.push(fb);
	}
	// generate random noise texture
	this.generateTexture();
}


// create a noise texture
Scene.prototype.generateTexture = function(){
	const gl = this.gl;
	this.textures = [];
	this.fb.forEach((fb,i) => {
		this.textures.push(utils.loadTexture(gl, textureDims));
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures[i], 0);
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	});
}


Scene.prototype.initBuffers = function(){
	const gl = this.gl;

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenData.coords), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	const texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenData.texCoords), gl.DYNAMIC_DRAW);
	//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenData.texCoords), gl.DYNAMIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);


	this.shaders.basic.attributes.aTextureCoord.value = texCoordBuffer;
	this.shaders.basic.attributes.aVertexPosition.value = positionBuffer;
	
}
  




let fbCurrent = 0;


Scene.prototype.drawScene = function (time,controls)  {
	const gl = this.gl;
	const shaders =  this.shaders;
	const fb = this.fb;

	gl.enable(gl.CULL_FACE);

	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

	//  clear scene
	gl.clearColor(0.0, 0.0, 0.0, 0.0);  
	//gl.clear(gl.COLOR_BUFFER_BIT );  

	// use the shader
	gl.useProgram(shaders.basic.program);



	// bind the vertex position and texture coordinates
	setAttribute(gl, shaders.basic.attributes.aVertexPosition);
	setAttribute(gl, shaders.basic.attributes.aTextureCoord);

	//set the parameters
	gl.uniform1fv(shaders.basic.uniforms.inputs.location, controls.params);
	gl.uniform1fv(shaders.basic.uniforms.uTextureDims.location, textureDims);

	fbCurrent  =  1 - fbCurrent;	//flip the framebuffer

	
	//	process the texture
	{
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb[fbCurrent]);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[1-fbCurrent]);
		gl.viewport(0, 0, textureDims[0],textureDims[1]);
		gl.uniform1i(shaders.basic.uniforms.uProcessVal.location, 1.0);
		drawScreen(gl);
	}

	//	render to screen
	{
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
		gl.viewport(0, 0, screen[0],screen[1]);	 
		gl.uniform1i(shaders.basic.uniforms.uProcessVal.location, 0); 
		drawScreen(gl);
	}
	


}


function drawScreen(gl, vertexCount = 6) {
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
}




function setAttribute(gl, attrib, num=2, type=null, normalize=false, stride=0, offset=0)
{
	type ??=gl.FLOAT;

	gl.bindBuffer(gl.ARRAY_BUFFER, attrib.value);
	gl.vertexAttribPointer(
		attrib.location,
		num,
		type,
		normalize,
		stride,
		offset
	);
	gl.enableVertexAttribArray(attrib.location);

};



// Initialize shader program
Scene.prototype.initShaderProgram =function(vsSource, fsSource) {

	const gl = this.gl;
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
}

