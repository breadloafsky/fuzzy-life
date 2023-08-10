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

	this.quality = 1.5;
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
				inputs: {value:null},
				paintRadius:{value:null},
				paintCoord:{value:null},
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
		// if(this.initialized)
		// 	this.drawScene();
	}

	window.addEventListener("resize",() => resize());
	resize();
	
	return this;
}


// load the shaders as static files
Scene.prototype.initShaders = async function(){
	const gl = this.gl;
	let promises = [];
	for (let shaderName in this.shaders)
	{	
		const promise = new Promise((resolve, reject) => {
			const shaderFiles = ["vs","fs"].map(async (e) => {
				const response = await fetch(`shaders/${shaderName}.${e}`);
				return await response.text();
			});
			Promise.all(shaderFiles).then(data => {
				const shader = this.shaders[shaderName];
				shader.program = this.initShaderProgram( 
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
}


Scene.prototype.init = async function(){
	Promise.all(await this.initShaders()).then(()=>{
		const gl = this.gl;
		// init buffers
		this.initBuffers();	
		// create frame buffers
		for(let i = 0; i < 2; i++)
		{
			//this.textures.push(utils.loadTexture(gl, textureDims));
			const texture = gl.createTexture();
			utils.loadTexture(gl, textureDims, texture);
			this.textures.push(texture);


			let fb  = gl.createFramebuffer();
			this.fb.push(fb);
			gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures[i], 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
		// generate texture
		//this.generateTexture();
		this.initialized = true;
	});
}


// create a noise texture
Scene.prototype.generateTexture = function(){
	const gl = this.gl;
	//this.textures = [];
	this.textures.forEach((tex,i) => {
		utils.loadTexture(gl, textureDims, tex);
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
	gl.bindBuffer(gl.ARRAY_BUFFER, null);


	this.shaders.frame.attributes.aTextureCoord.value = texCoordBuffer;
	this.shaders.frame.attributes.aVertexPosition.value = positionBuffer;
	
}
  




let fbCurrent = 0;


Scene.prototype.drawScene = function (time,controls, settings, input)  {
	if(!this.initialized)
		return;
	const gl = this.gl;
	const shaders =  this.shaders;
	const fb = this.fb;

	gl.enable(gl.CULL_FACE);
	//  clear scene
	gl.clearColor(0.0, 0.0, 0.0, 0.0);  
	gl.clear(gl.COLOR_BUFFER_BIT );  


	// use the shader
	let shader = shaders.frame;
	gl.useProgram(shader.program);

	// bind the vertex position and texture coordinates
	setAttribute(gl, shader.attributes.aVertexPosition);
	setAttribute(gl, shader.attributes.aTextureCoord);
	//set the parameters

	

	
	if(!settings.paused)
	//	process the texture
	{
		fbCurrent  =  1 - fbCurrent;	//flip the framebuffer
		gl.uniform1fv(shader.uniforms.inputs.location, controls.params);
		gl.uniform1fv(shader.uniforms.uTextureDims.location, textureDims);
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, fb[fbCurrent]);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[1-fbCurrent]);
		
		gl.viewport(0, 0, textureDims[0],textureDims[1]);
		drawScreen(gl);

		
		
	}


	shader = shaders.screen;
	gl.useProgram(shader.program);
	gl.uniform1fv(shader.uniforms.uTextureDims.location, textureDims);
	

	//	render to screen
	{
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		//gl.bindTexture(gl.TEXTURE_2D, this.textures[fbCurrent]);
		gl.viewport(0, 0, screen[0],screen[1]);	 
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

