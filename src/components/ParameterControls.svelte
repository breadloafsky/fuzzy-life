
<script lang="ts">
    import { input } from "../stores";
	import type { Scene } from "../webgl/scene.js";
	import RuleComponent from "./RuleComponent.svelte";
    import KernelProperties from "./KernelProperties.svelte";
	import KernelCanvas from "./graphs/KernelCanvas.svelte";
    import { onMount } from "svelte";
    import type { FormattedParams, Params, Settings } from "../types/types";
    import SimulationSettings from "./sections/SimulationSettings.svelte";
	export let scene:Scene;
	export let params:Params;
	export let settings:Settings;
	export let formattedParams:FormattedParams;

	let kc:KernelCanvas;
	let fileInput:HTMLInputElement|any;


	



	


	onMount(() => {
		for(let i = 0; i < params.kernels.length; i++)
		{
			updateKernels();	
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
				for(let i = 0; i < params.kernels.length; i++) {
					const kern = params.kernels[i];
					for(let j = 0; j < kern.rules.length; j++){
						
						const r = 1.0;
						const w = 0.4;	//width

						const centre = Math.random()*r/2+0.3;
						let vals = [centre-Math.random()*w,centre+Math.random()*w];

						vals.forEach((val,i) => {
							vals[i] = val > 1 ? 1 : val < 0 ? 0 : val;
						});
						kern.rules[j][0] = Math.round(vals[0]*1000)/1000;
						kern.rules[j][1] = Math.round(vals[1]*1000)/1000;
					}
				}
				params = params;
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
				updateKernels();
			});
			reader.readAsText(file);
			return;
		} 
		alert("File error");
	}

	// format and put all the rules into 1d array that will be passed to the shader
	function formatRules(){

		// update kernel rules
		for(let i =0 ; i < params.kernels.length; i++){
			const kern = params.kernels[i];
			while(kern.rules.length < params.numberOfRules){
				kern.rules.push([0.4,0.6, 0.001, 0.001]);
			}
			while(kern.rules.length > params.numberOfRules){
				kern.rules.pop();
			}
		}

		formattedParams.rules = [];
		for(let i = 0; i < 4; i++)
		{
			let s:number[] = [];
			if(params.numberOfRules > i)
			{
				for(let j = 0; j < 4; j++){
					if(params.kernels.length > j)
						s = s.concat(params.kernels[j].rules[i]);
					else
						s = s.concat(-0.5,1.5,0.1,0.1);
				}
			}
			else
				s = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
			formattedParams.rules = formattedParams.rules.concat(s);
		}


	}

  	function updateKernels(){
		formattedParams.kernelTexture = kc.render(params.kernels, params.convRadius);
		
		
		if(scene)
			scene.setKernels(formattedParams.kernelTexture);

		params = params;

		formatRules();
	}
  // e.target.blur();
</script>

<KernelCanvas bind:this={kc}/>
<div class="controls-container" style="pointer-events: {$input.brush[0] != -1 ? "none" : "all"};">
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
		<SimulationSettings params={params}/>
	</div>

	<div>
		<KernelProperties params={params} formattedParams={formattedParams} updateKernels={updateKernels}/>
	</div>


	<div style="display: flex; flex-direction: row-reverse;">
		<button on:click={(e) => {scene.generateTexture();}}>repaint</button>
	</div>
	
	<div>
		<h2>Rules</h2>
		<div class="rules">
			{#each new Array(params.numberOfRules) as r,i}
				<RuleComponent ruleId={i} bind:params={params} onChange={formatRules}/>
			{/each}
			{#if params.numberOfRules < 4}
				<div><button on:click={() => {params.numberOfRules++; updateKernels(); } }>+</button></div>
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