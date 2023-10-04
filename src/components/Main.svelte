<script lang="ts">
	import { onMount } from "svelte";
   	import { Scene } from "../webgl/scene.js";
	import { scene, fpsLimit } from "../stores"
    import Controls from "../components/Controls.svelte";
    import ToolTip from "./ui/ToolTip.svelte";
	export let shaders:any;
	let canvas : HTMLCanvasElement; 
	let previousTime = 0;


	onMount(() => {
		$scene = new Scene(canvas, shaders);	//init scene
		window.addEventListener("resize",()=>$scene.resize());	
		$scene.resize();
		requestAnimationFrame(update);
	});

	
	// main loop
	function update(time:number){
		requestAnimationFrame(update);
		const delta = time - previousTime;
		// limit fps
		const process = (delta > 1000 / $fpsLimit);
		$scene.drawScene(process);
		if (!process)
			return;
		previousTime = time;
   	}

</script>

<ToolTip/>
<div style="display: flex; overflow: hidden;">
	{#if canvas && $scene}
		<Controls bind:canvas/>
	{/if}
   	<!-- svelte-ignore a11y-no-static-element-interactions -->
   	<div class="canvas-container"  
		on:contextmenu|preventDefault={()=>{return false;}}>
	   	<canvas
		   aria-hidden="true" bind:this={canvas} />
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