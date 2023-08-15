
<script lang="ts">
	import { params, input, settings } from "../stores.js";
 	import { onMount } from "svelte";
	import { Scene } from "../webgl/scene.js";
	import ParameterControls from "./ParameterControls.svelte";
    let canvas : HTMLCanvasElement;
	let scene : Scene;
	let previousTime = 0;
    let fpsLimit = 60*2;



	onMount( async() => {
		scene = new Scene(canvas);	//init the scene

		canvas.addEventListener("wheel", (e) => {
			let v = ($input.brush[2]+(e.deltaY/100));
			v = v > 100 ? 100 : v < 0 ? 0 : v; 
			$input.brush[2]= Math.round(v);
		});

		canvas.addEventListener("mousedown", (e) => {
			startDrawing(e);
		});
		document.body.onkeyup = (e) => {
			if (e.key.toLowerCase() == "d")
				$settings.debugVal = 1 - $settings.debugVal;
			if (e.key == " " || e.code == "Space")
				$settings.paused = ! $settings.paused;
			if (e.key.toLowerCase() == "c")
				scene.generateTexture();

			//	randomise values
			if (e.key.toLowerCase() == "r"){
				for(let i = 0; i < $params.sigmoids.length/2; i++) {
					if($params.sigmoids[i*2] == 0 && $params.sigmoids[i*2+1] == 0)
						continue;
					const r = 0.5;
					const w = 0.2;	//width

					const centre = Math.random()*r;
					let vals = [centre-Math.random()*w,centre+Math.random()*w];

					vals.forEach((val,i) => {
						vals[i] = val > 1 ? 1 : val < 0 ? 0 : val;
					});
					$params.sigmoids[i*2] = Math.round(vals[0]*1000)/1000;
					$params.sigmoids[i*2+1] = Math.round(vals[1]*1000)/1000;
				}
			}
		}
		await scene.init();
		requestAnimationFrame(update);
		
  	});

	  function update(time:number){
		requestAnimationFrame(update);
		const delta = time - previousTime;
		// limit the fps
		if (fpsLimit && delta < 1000 / fpsLimit)
        	return;
		scene.drawScene(time * 0.001, $params, $settings, $input);	
		previousTime = time;	
	}


	function startDrawing(e:MouseEvent){
		moveBrush(e);
		canvas.addEventListener("mousemove",moveBrush);
		canvas.addEventListener("mouseup",  (e)=> {
			canvas.removeEventListener("mousemove" , moveBrush);
			$input.brush[0] = -1;
		});	
	}

	function moveBrush(e:MouseEvent|any){
		$input.brush = [e.clientX/e.target.clientWidth, 1 - e.clientY/e.target.clientHeight, $input.brush[2]];
	}



</script>
<div style="display: flex;">
	<ParameterControls bind:params={$params} bind:scene/>
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
		background-color: rgb(240, 240, 240);
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