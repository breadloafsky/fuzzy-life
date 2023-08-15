
<script lang="ts">
    import { input } from "../stores";
    import type { Params, Input } from "../types/types";
	import type { Scene } from "../webgl/scene.js";
	import Rule from "./Rule.svelte";
    import SigmoidGraph from "./SigmoidGraph.svelte";
	export let params:Params;
	export let scene:Scene;
	let fileInput:HTMLInputElement|any;
	let selectedRule = 0;


	function saveScene() {
    	var file = new Blob([JSON.stringify({...params},null,"\t")], {type: "json"});
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
			params = {...JSON.parse(reader.result+"")};

			// Remove Later
			while(params.sigmoids.length < 16)
			{
				params.sigmoids.push(0);
			}
			if(params.slopes == undefined)
				params.slopes = [];
			while(params.slopes.length < 16)
			{
				params.slopes.push(0.1);
			}
		});
		reader.readAsText(file);
		return;
    } 
	alert("File error");

  }
  // e.target.blur();
</script>


<div class="controls-container" >
	<div style="display: flex; flex-direction: row-reverse;">
		<button on:click={(e) => {scene.generateTexture();}}>repaint</button>
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
	<div>
		<h2>Rules</h2>
		<div class="rules">
			{#each "0123" as s,i}
			<Rule 
				label={s} 
				bind:inn0={params.sigmoids[i*4]} 
				bind:inn1={params.sigmoids[i*4+1]} 
				bind:out0={params.sigmoids[i*4+2]} 
				bind:out1={params.sigmoids[i*4+3]}
	
				bind:sig_inn0={params.slopes[i*4]} 
				bind:sig_inn1={params.slopes[i*4+1]} 
				bind:sig_out0={params.slopes[i*4+2]} 
				bind:sig_out1={params.slopes[i*4+3]}
				/>
			{/each}
		</div>
		
	</div>
	<!-- {#if selectedRule != null}
		<SigmoidGraph 
		val0={params.sigmoids[selectedRule*4]} 
		val1={params.sigmoids[selectedRule*4+1]} 
		sig_val0={params.slopes[selectedRule*4]} 
		sig_val1={params.slopes[selectedRule*4+1]} 
		color={"var(--color1)"}/>
	{/if} -->
	


	<!-- <div class="section">
		<h2>Area Radius</h2>
		<div >
			<div id="radiusSlider">
				Overall Radius
				<Slider bind:val={controls.radius} range={[0,12]} flipY={true}/> 
			</div>
			<div id="ratioSlider" style="padding-top: 10px;">
				Inner/Outer R Ratio 
				<Slider bind:val={controls.radiusRatio} range={[0,1]} flipY={true}/>		
			</div>
			<CircleParams bind:rr={controls.radiusRatio}/>
		</div>
	</div> -->
</div>

<style>
	.controls-container{
		min-width: 200px;
		background-color: rgba(0, 0, 0, 0.863); 
		display: flex;
		flex-direction: column;
		padding: 10px;
		overflow: visible;
		z-index: 1;
	}


	:global(#radiusSlider .slider-container){
		--color:white;
	}

	:global(#ratioSlider .slider-container){
		--color:var(--color0);
		--color_bg:var(--color1);
	}
	
	.rules{
		min-width: 200px;
		background-color: rgba(0, 0, 0, 0.863); 
		display: flex;
		flex-direction: column;
		resize: both;
		overflow: auto;
		z-index: 1;
	}
	
	

	
	

   
</style>