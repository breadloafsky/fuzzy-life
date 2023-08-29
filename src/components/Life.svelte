
<script lang="ts">
	
 	import { onMount } from "svelte";
	import { Scene } from "../webgl/scene.js";
	import ParameterControls from "./ParameterControls.svelte";
    import { FormattedParams, Input, Params, Settings } from "../types/types.js";
    let canvas : HTMLCanvasElement;
	let scene : Scene;
	let previousTime = 0;
    let fpsLimit = 60*2;

	let params = new Params();
	let input = new Input();
	let settings = new Settings();
	let formattedParams:FormattedParams = new FormattedParams();

	
	
	onMount( async() => {
		scene = new Scene(canvas);	//init the scene
		

		canvas.addEventListener("wheel", (e) => {
			let v = (input.brush[2]+(e.deltaY/100));
			v = v > 100 ? 100 : v < 0 ? 0 : v; 
			input.brush[2]= Math.round(v);
		});

		canvas.addEventListener("mousedown", (e) => {
			startDrawing(e);
		});
		
		await scene.init();
		requestAnimationFrame(update);
		
  	});

	  function update(time:number){
		requestAnimationFrame(update);
		const delta = time - previousTime;
		// limit the fps
		if (fpsLimit && delta < 1000 / fpsLimit)
        	return;
		scene.drawScene(time * 0.001, params, formattedParams, settings, input);	
		previousTime = time;	
	}


	function startDrawing(e:MouseEvent){
		moveBrush(e);
		canvas.addEventListener("mousemove",moveBrush);
		canvas.addEventListener("mouseup",  (e)=> {
			canvas.removeEventListener("mousemove" , moveBrush);
			input.brush[0] = -1;
		});	
	}

	function moveBrush(e:MouseEvent|any){
		input.brush = [e.clientX/e.target.clientWidth, 1 - e.clientY/e.target.clientHeight, input.brush[2]];
	}



</script>

<div style="display: flex; overflow: hidden;">
	<ParameterControls settings={settings} params={params} formattedParams={formattedParams} bind:scene/>
	
	<!-- <div style="color: white; width: 100px; z-index: 200;">{"test"}</div> -->
	<div class="canvas-container flex">
		<canvas
			aria-hidden="true"
			bind:this={canvas} 
		/>
		
	</div>
</div>
<style>
	.canvas-container {
		display: flex;
		justify-content: center;
		background-color: #000000;
        min-height: 100%;
        width: 100%;
        overflow: hidden;
        position: fixed;
    }

	canvas{
		width: 100%;
		height: 100%;
	
	}
</style>