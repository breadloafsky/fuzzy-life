
<script lang="ts">
 	import { onMount } from "svelte";
	import { Scene } from "../webgl/scene.js";

    let canvas;
	let scene;
	let previousTime = 0;
    let fpsLimit = 80;

	let controls = [0,0];

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
	<div class="controls-container">
		<input type="number" bind:value={controls[0]} min=-1 max="1" />
		<input type="number" bind:value={controls[1]} min=-1 max="1" />
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
		background-color: red; 
		display: flex;
		padding: 40px;
		margin: 4px;
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