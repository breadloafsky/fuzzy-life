<script lang="ts">
	import { onMount } from "svelte";
   	import { Scene } from "../webgl/scene.js";
	import { automaton, callbacks } from "../stores"
    import Controls from "../components/Controls.svelte";
	

	export let shaders:any;
	let canvas : HTMLCanvasElement;
	let scene : Scene;
	let previousTime = 0;
	let fpsLimit = 80; 
	let brushElement = [0,0,0];// the visual brush element
	let showBrush = false;

	$callbacks.resizeTexture = () => resize();

	onMount( async() => {
		scene = new Scene(canvas, shaders, $automaton);	//init scene
		scene.init();

		
		$callbacks.setTextureFilter = () => scene.setTextureFilter();


		window.addEventListener("resize",resize);

		requestAnimationFrame(update);

		canvas.addEventListener("wheel", (e:MouseEvent|any) => {
			let v = ($automaton.brush[2]-(e.deltaY/100));
			v = v > 100 ? 100 : v < 0 ? 0 : v; 
			$automaton.brush[2]= Math.round(v);

			
			updateBrushElement(e);
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

		canvas.addEventListener("mouseenter",()=> showBrush = true);
		canvas.addEventListener("mouseleave",()=> showBrush = false);
	});


	function resize(){
		scene.resize();
			setTimeout(function() {
				$automaton.formattedParams.resetTexture = 2;
			}, 1);
	}


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
		$automaton.formattedParams.resetTexture = 0;
		previousTime = time;	
   }


   function moveBrush(e:MouseEvent|any){
		
		$automaton.brush = [e.clientX/e.target.clientWidth, 1 - e.clientY/e.target.clientHeight, $automaton.brush[2], $automaton.brush[3]];
		updateBrushElement(e);
   }

   function updateBrushElement(e:MouseEvent|any){
		brushElement = [
			e.clientX,
			e.clientY,
			$automaton.brush[2] * Math.sqrt(e.target.clientWidth * e.target.clientHeight)*2 / Math.sqrt($automaton.settings.textureSize*1000000)
		];
   }


</script>

<div style="display: flex; overflow: hidden;">
	<Controls />
   	<!-- svelte-ignore a11y-no-static-element-interactions -->
   	<div class="canvas-container flex"  on:contextmenu|preventDefault={()=>{return false;}}>
		{#if showBrush}
		<div 
			class="brush" 
			style="left: {brushElement[0] - brushElement[2]/2+1}px; 
				top: {brushElement[1]- brushElement[2]/2}px; 
				width:{brushElement[2]}px; 
				height:{brushElement[2]}px;" 
		/>
		{/if}
	
	   	<canvas
		   aria-hidden="true"
		   bind:this={canvas} 
		/>
  	 </div>
</div>
<style>

	.brush{
		
		position: absolute;
		pointer-events: none;
		outline: solid white 4px;
		border-radius: 100%;
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