
<script >
// @ts-nocheck

 	import { onMount } from "svelte";
	import { Scene } from "../webgl/scene.js";
	import ParameterControls from "./ParameterControls.svelte";
    let canvas;
	let scene;
	let previousTime = 0;
    let fpsLimit = 60*2;
	let fileInput;


	let controls = {
		params:[
			0.0, 0.35, 0.2, 0.25,	//A  
			0.32, 1,0.271, 0.335,	//B
			0.0, 0.0, 0.0, 0.0,		//C  
			0.0, 0.0, 0.0, 0.0,		//D
		],
		radius:12,
		radiusRatio:1/3,
	}

	let settings = {
		paused:0,
		debugVal:0,
		quality:2,
		
	}

	let input = {
		paint:{
			active:false,
			x:0,
			y:0,
			r:1,
		}
	}

	onMount( async() => {
		scene = new Scene(canvas);	//init the scene

		document.querySelector("canvas").onclick = () => {	
		};
		document.body.onkeyup = (e) => {
			if (e.key.toLowerCase() == "d")
				settings.debugVal = 1 - settings.debugVal;
			if (e.key == " " || e.code == "Space")
				settings.paused = 1 - settings.paused;
			if (e.key.toLowerCase() == "c")
				scene.generateTexture();

			//	randomise values
			if (e.key.toLowerCase() == "r"){
				for(let i = 0; i < controls.params.length/2; i++) {
					const r = 0.5;
					const w = 0.2;	//width

					const centre = Math.random()*r;
					let vals = [centre-Math.random()*w,centre+Math.random()*w];

					vals.forEach((val,i) => {
						vals[i] = val > 1 ? 1 : val < 0 ? 0 : val;
					});


					controls.params[i*2] = Math.round(vals[0]*1000)/1000;
					controls.params[i*2+1] = Math.round(vals[1]*1000)/1000;
				}
				scene.generateTexture();
			}
		}

		await scene.init();
		requestAnimationFrame(update);
		


  	});

	function update(time){

		requestAnimationFrame(update);
		const delta = time - previousTime;
		// limit the fps
		if (fpsLimit && delta < 1000 / fpsLimit)
        	return;

		scene.drawScene(time * 0.001, controls, settings, input);	
		previousTime = time;
		
	}
	// ToDo - rename controls -> params and params -> *
	function saveScene() {
    	var file = new Blob([JSON.stringify({...controls},null,"\t")], {type: "json"});
		var a = document.createElement("a"),
				url = URL.createObjectURL(file);
		a.href = url;
		a.download = "params.json";
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}

	function loadScene() {
    const file = fileInput.files[0];
    if (file) {
		const reader = new FileReader();
		reader.addEventListener("load", function () {
			controls = {...JSON.parse(reader.result+"")};

			// Remove Later
			while(controls.params.length < 16)
			{
				controls.params.push(0);
			}
		});
		reader.readAsText(file);
		return;
    } 
	alert("File error");

  }

	
</script>
<div >
	<div>
		<div class="controls-container">
			<div style="display: flex; flex-direction: row-reverse;">
				<button on:click={(e) => {scene.generateTexture(); e.target.blur();}}>repaint</button>
			</div>
			<div >
				<div >load file</div>
				<label title="load file">
					<input bind:this={fileInput} on:change={() => loadScene()} type="file" accept="application/JSON"/>
				</label>
			</div>
			<div>
				<div>save file</div>
				<button 
				title="save file"
				on:click={() => saveScene()}
				>
				save
				</button>
			</div>
			<ParameterControls bind:controls={controls}/>
		</div>
	</div>
</div>
<div class="canvas-container flex">
	
	<canvas
		aria-hidden="true"
		bind:this={canvas} 
	/>
	
</div>

<style>

	.controls-container{
		min-width: 200px;
		background-color: rgba(0, 0, 0, 0.863); 
		display: flex;
		flex-direction: column;
		padding: 10px;
		resize: both;
		overflow: auto;
	}

	.canvas-container {
		display: flex;
		justify-content: center;
		background-color: rgb(240, 240, 240);
        min-height: 100%;
        width: 100%;
        z-index: -1;
        overflow: hidden;
        position: fixed;
    }

	canvas{
		width: 100%;
		height: 100%;
	}
</style>