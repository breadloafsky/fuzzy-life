
<script lang="ts">
    import { input } from "../stores";
	import { type Params, type Input, Rule, FormattedParams, Settings } from "../types/types";
	import type { Scene } from "../webgl/scene.js";
	import RuleComponent from "./RuleComponent.svelte";
    import KernelProperties from "./KernelProperties.svelte";
	import KernelCanvas from "./graphs/KernelCanvas.svelte";
    import { onMount } from "svelte";
	export let scene:Scene;
	export let params:Params;
	export let settings:Settings;
	export let formattedParams:FormattedParams;

	let kc:KernelCanvas;
	let fileInput:HTMLInputElement|any;


	function formatRules(){
		formattedParams.slopes = [];
		formattedParams.thresholds = [];
		//	store values of all active rules into 2 arrays that will be passed to the shader
		for(let i = 0; i < 4; i++)
		{
			let s;
			let t;
			if(params.rules.length > i)
			{
				s = params.rules[i].slopes;
				t = params.rules[i].thresholds;
			}
			else
			{
				s = [0,0,0,0];
				t = [0,0,0,0];
			}
			formattedParams.slopes = formattedParams.slopes.concat(s);
			formattedParams.thresholds = formattedParams.thresholds.concat(t);
		}
	}



	function formatKernel(i:number){
		formattedParams.kernelTextures[i] = kc.render(params.kernels[i]);
		if(scene)
			scene.setKernel(i,formattedParams.kernelTextures[i]);
	}


	onMount(() => {
		for(let i = 0; i < params.kernels.length; i++)
		{
			formatKernel(i);	
		}
		document.body.onkeyup = (e) => {
			// if (e.key.toLowerCase() == "d")
			// 	settings.debugVal = 1 - settings.debugVal;
			if (e.key == " " || e.code == "Space")
				settings.paused = ! settings.paused;
			if (e.key.toLowerCase() == "c")
				scene.generateTexture();

			//	randomise values
			if (e.key.toLowerCase() == "r"){
				for(let i = 0; i < params.rules.length; i++) {
					for(let j = 0; j < 2; j++){
				
						const r = 0.8;
						const w = 0.2;	//width

						const centre = Math.random()*r/2+0.2;
						let vals = [centre-Math.random()*w,centre+Math.random()*w];

						vals.forEach((val,i) => {
							vals[i] = val > 1 ? 1 : val < 0 ? 0 : val;
						});
						params.rules[i].thresholds[j*2] = Math.round(vals[0]*1000)/1000;
						params.rules[i].thresholds[j*2+1] = Math.round(vals[1]*1000)/1000;

					}
				}
				formatRules();
			}
		}
	});




	function filterProperty(k:any,v:any){
		if(k == "test")
			return undefined;
		return v;
	}
	function saveScene() {
    	var file = new Blob([JSON.stringify({...params},filterProperty,"\t")], {type: "json"});
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
			params = {...params, ...JSON.parse(reader.result+"")};
		});
		reader.readAsText(file);
		return;
    } 
	alert("File error");

  }
  // e.target.blur();
</script>

<KernelCanvas bind:this={kc}/>
<div class="controls-container" style="pointer-events: {$input.brush[0] != -1 ? "none" : "all"};">


	<div>
		<KernelProperties params={params} formattedParams={formattedParams} formatKernel={formatKernel}/>
	</div>


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
				<RuleComponent label={i} bind:rule={params.rules[i]} onChange={formatRules}/>
			{/each}
			{#if params.rules.length < 4}
				<div><button on:click={() => {params.rules.push(new Rule()); params.rules = params.rules; formatRules()} }>+</button></div>
			{/if}
		</div>
	</div>
</div>




<style>
	.controls-container{
		min-width: 340px;
		max-height: 80vh;
		z-index: 1;
		display: flex;
		
		flex-direction: column;

		overflow: auto;
		resize: both;

		padding: 10px;
		background-color: var(--bg0); 

	}


	:global(#radiusSlider .slider-container){
		--color:white;
	}

	:global(#ratioSlider .slider-container){
		--color:var(--color0);
		--color_bg:var(--color1);
	}
	

	

	
	

   
</style>