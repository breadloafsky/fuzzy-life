<script lang="ts">
	import { onMount } from "svelte";
   	import { Scene } from "../webgl/scene.js";
	import { automaton } from "../stores"
    import Controls from "../components/Controls.svelte";
	let canvas : HTMLCanvasElement;
	let scene : Scene;
	let previousTime = 0;
	let fpsLimit = 80; 

	export let shaders:any;



	onMount( async() => {
		
		scene = new Scene(canvas, shaders, $automaton);	//init scene
		scene.init();
		requestAnimationFrame(update);

		canvas.addEventListener("wheel", (e) => {
			let v = ($automaton.brush[2]-(e.deltaY/100));
			v = v > 100 ? 100 : v < 0 ? 0 : v; 
			$automaton.brush[2]= Math.round(v);
		});
		canvas.addEventListener("mousedown", (e) => {
			if(e.button == 0)
				$automaton.brush[3] = 1;
			else
				$automaton.brush[3] = 2;
		});
		canvas.addEventListener("mouseup",  (e)=> {
			$automaton.brush[3] = 0;
		});	
		canvas.addEventListener("mousemove",moveBrush);

	});


	function update(time:number){
		requestAnimationFrame(update);
		const delta = time - previousTime;
		// limit fps
		if (fpsLimit && delta < 1000 / fpsLimit)
			return;

		// set new kernel texture(s)
		if(scene.initialized && $automaton.formattedParams.kernelTexture)
		{
			scene.setKernels($automaton.formattedParams.kernelTexture);
			$automaton.formattedParams.kernelTexture = null;
		}
		scene.drawScene(time * 0.001);	
		previousTime = time;	
   }


   function moveBrush(e:MouseEvent|any){
		$automaton.brush = [e.clientX/e.target.clientWidth, 1 - e.clientY/e.target.clientHeight, $automaton.brush[2], $automaton.brush[3]];
   }



</script>

<div style="display: flex; overflow: hidden;">
	
	<Controls bind:scene/>

   <!-- svelte-ignore a11y-no-static-element-interactions -->
   <div class="canvas-container flex"  on:contextmenu|preventDefault={()=>{return false;}}>
	   <canvas
		   aria-hidden="true"
		   bind:this={canvas} 
	   />
   </div>
</div>
<style>

	:global(body){
		
		color: aliceblue;
		
	}

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