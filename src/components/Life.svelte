
<script >
 	import { onMount } from "svelte";
	import { Scene } from "../webgl/scene.js";
	import ParameterControls from "./ParameterControls.svelte";
    let canvas;
	let scene;
	let previousTime = 0;
    let fpsLimit = 80;

	let controls = [0, 0.35, 0.2, 0.25,  
	0.32, 1,0.271, 0.335];

	onMount(() => {
		scene = new Scene(canvas);
		
		//scene.drawScene();
		requestAnimationFrame(update);
		// debug
		document.querySelector("canvas").onclick = () => {
			
		};
		
  	});

	function update(time){

		requestAnimationFrame(update);
		const delta = time - previousTime;	//limit the fps
		if (fpsLimit && delta < 1000 / fpsLimit)
        	return;

		
		scene.drawScene(time * 0.001, controls);	
		previousTime = time;
		
	}

	
</script>
<div >
	<div>
		<ParameterControls bind:controls={controls}/>
		<!-- <div style="display: flex;">	
			<div  style="display: flex; flex-direction: column;">
				inner
				<input type="number" bind:value={controls[0]} min=0 max="0.999" step={step} />
				<input type="number" bind:value={controls[1]} min=0 max="0.999" step={step} />
			</div>
			
			<div  style="display: flex; flex-direction: column;">
				outer
				<input type="number" bind:value={controls[2]} min=0 max="0.999" step={step}/>
				<input type="number" bind:value={controls[3]} min=0 max="0.999" step={step} />
			</div>
		</div>
		<div style="display: flex;">	
			<div  style="display: flex; flex-direction: column;">
				inner
				<input type="number" bind:value={controls[4]} min=0 max="0.999" step={step}/>
				<input type="number" bind:value={controls[5]} min=0 max="0.999" step={step} />
			</div>
			
			<div  style="display: flex; flex-direction: column;">
				outer
				<input type="number" bind:value={controls[6]} min=0 max="0.999" step={step}/>
				<input type="number" bind:value={controls[7]} min=0 max="0.999" step={step} />
			</div>
		</div> -->
		
	</div>
</div>
<div class="canvas-container flex">
	
	<canvas
		aria-hidden="true"
		bind:this={canvas} 
	/>
	
</div>

<style>



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