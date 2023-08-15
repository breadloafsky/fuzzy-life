
<script lang="ts">
    import { input } from "../stores";
	import type { Params, Input } from "../types/types";
	import type { Scene } from "../webgl/scene.js";
	import RuleComponent from "./RuleComponent.svelte";
	import { Rule } from "../types/types";
    import SigmoidGraph from "./SigmoidGraph.svelte";
	export let params:Params;
	export let scene:Scene;
	let fileInput:HTMLInputElement|any;
	let selectedRule:number|any = null;


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
		});
		reader.readAsText(file);
		return;
    } 
	alert("File error");

  }
  // e.target.blur();
</script>


	<div class="controls-container" style="pointer-events: {$input.brush[0] != -1 ? "none" : "all"};">
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
				{#each params.rules as r,i}
					<RuleComponent label={i} bind:rule={params.rules[i]}/>
				{/each}
				{#if params.rules.length < 4}
					<div><button on:click={() => {params.rules.push(new Rule()); params = params} }>+</button></div>
				{/if}
			</div>
		</div>
		<!-- <div class="section">
			<h2>Area Radius</h2>
			<div >
				<div id="radiusSlider">
					Overall Radius
					<Slider bind:val={controls.radius} range={[0,12]} flipY={true}/> 
				</div>j
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
		min-width: 340px;
		max-height: 100vh;
		display: flex;
		z-index: 1;
		overflow: auto;

		display: flex;
		flex-direction: column;
		resize: both;
		overflow: auto;
		z-index: 1;
		padding: 10px;
		background-color: rgba(0, 0, 0, 0.863); 

	}


	:global(#radiusSlider .slider-container){
		--color:white;
	}

	:global(#ratioSlider .slider-container){
		--color:var(--color0);
		--color_bg:var(--color1);
	}
	

	

	
	

   
</style>