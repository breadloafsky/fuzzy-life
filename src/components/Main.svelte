<script lang="ts">
	import { onMount } from "svelte";
   	import { Scene } from "../webgl/scene.js";
	import { params, callbacks, settings, tempParams } from "../stores"
    import Controls from "../components/Controls.svelte";
	export let shaders:any;
	let canvas : HTMLCanvasElement; 
	let scene : Scene;
	let previousTime = 0;

	$callbacks.resizeTexture = () => resize();
	$callbacks.setTextureFilter = () => scene.setTextureFilter();

	// save settings in the local storage
	// $:$settings,(()=>{
	// 	if(localStorage && $settings.saveSettings)
	// 		localStorage.setItem("settings",JSON.stringify($settings));
	// })()

	onMount(() => {
		scene = new Scene(canvas, shaders, $params, $tempParams, $settings);	//init scene
		window.addEventListener("resize",resize);
		resize();
		requestAnimationFrame(update);
	});

	// reset the textures to the new size
	function resize(){
		scene.resize();
		setTimeout(function() {
			$tempParams.resetTexture = 2;	// gradient fill
		}, 1);
	}

	// main loop
	function update(time:number){
		requestAnimationFrame(update);
		const delta = time - previousTime;
		// update kernel texture
		if($tempParams.kernelTexture)
		{
			//	update kernel and set the callback for kernel radius update to avoid texture "drift" (when the kernel radius changed before the texture)
			scene.setKernels($tempParams.kernelTexture, () => $tempParams.convRadius = $params.convRadius);
			$tempParams.kernelTexture = null; //remove temporary kernel texture		
		}
		// limit fps
		const process = (delta > 1000 / $settings.fpsLimit);
		scene.drawScene(process);	
		if (!process)
			return;
		$tempParams.resetTexture = 0;
		previousTime = time;
   }

</script>

<div style="display: flex; overflow: hidden;">
	{#if canvas}
		<Controls bind:canvas/>
	{/if}
   	<!-- svelte-ignore a11y-no-static-element-interactions -->
   	<div class="canvas-container flex"  
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