
<script lang="ts">
    import { input } from "../stores";
	import type { Scene } from "../webgl/scene.js";
	import RuleComponent from "./sections/RuleComponent.svelte";
	import KernelCanvas from "./graphs/KernelCanvas.svelte";
    import { onMount } from "svelte";
    import type { FormattedParams, Params, Settings } from "../types/types";
    import SimulationSettings from "./sections/SimulationSettings.svelte";
    import SectionContainer from "./sections/SectionContainer.svelte";
    import ConvolutionProperties from "./sections/ConvolutionProperties.svelte";
	export let scene:Scene;
	export let params:Params;
	export let settings:Settings;
	export let formattedParams:FormattedParams;

	let kc:KernelCanvas;
	let fileInput:HTMLInputElement|any;
	

	onMount(() => {
		updateKernels();
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
					const rule = params.rules[i];
					for(let j = 0; j < rule.subRules.length; j++){
						
						const r = 1.0;
						const w = 0.4;	//width

						const centre = Math.random()*r/2+0.3;
						let vals = [centre-Math.random()*w,centre+Math.random()*w];

						vals.forEach((val,i) => {
							vals[i] = val > 1 ? 1 : val < 0 ? 0 : val;
						});

						rule.subRules[j].thersholds[0] = Math.round(vals[0]*1000)/1000;
						rule.subRules[j].thersholds[1] = Math.round(vals[1]*1000)/1000;
					}
				}
				params = params;
				console.log(params); //debug
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
				 
				Object.assign(params, {...params, ...JSON.parse(reader.result+"")});
				updateKernels();
			});
			reader.readAsText(file);
			return;
		} 
		alert("File error");
	}

	// format and put all the rules into 1d array that will be passed to the shader
	function formatRules(){
		formattedParams.rules = [];
		for(let i = 0; i < params.rules.length; i++)
		{
			let s:number[] = [];
			if(params.rules[i].enabled)
			{
				for(let j = 0; j < params.kernels.length; j++){
					if(params.kernels[j].enabled && params.rules[i].subRules[j].enabled)
					{
						s = s.concat(params.rules[i].subRules[j].thersholds)
						s = s.concat(params.rules[i].subRules[j].slopes)
					}	
					else
						s = s.concat(-0.5,1.5,0.1,0.1);
				}
			}
			else
				s = [0,0,0,0, 0,0,0,0, 0,0,0,0];
			formattedParams.rules = formattedParams.rules.concat(s);
		}
	}

  	function updateKernels(){
		formattedParams.kernelTexture = kc.renderTexture(params.kernels, params.convRadius);
		formattedParams.kernelsPreview = kc.renderPreview(params.kernels, params.convRadius);
		if(scene)
			scene.setKernels(formattedParams.kernelTexture);
		params = params;
		formatRules();
	}
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
	<div style="display: flex; flex-direction: row-reverse;">
		<button on:click={(e) => {scene.generateTexture();}}>clear</button>
	</div>

	<!-- <SectionContainer label="Settings">
		<SimulationSettings params={params}/>
	</SectionContainer> -->

	<SectionContainer label="Convolution Settings">
		<ConvolutionProperties params={params} formattedParams={formattedParams} updateKernels={updateKernels}/>
	</SectionContainer>

	<SectionContainer label="Rules">
		<div class="rules-expression"  style="color: gray;">
			{"max("}	
			{#each params.rules as r,i}
				{#if r.enabled}
					<div style="padding-left: 20px;">
						{"min("}
						{#each params.kernels as k,j}
							{#if k.enabled && params.rules[i].subRules[j].enabled}
								<span style="color:var(--color{j});">
									{["A","B","C","D"][j]+i}
								</span>
							{/if}
						{/each}
						{")"}
					</div>
				{/if}
			{/each}
			{")"}
		</div>
		{#each params.rules as r,i}
			<RuleComponent ruleId={i} bind:params={params} onChange={formatRules}/>
		{/each}
	</SectionContainer>
</div>




<style>


	.rules-expression > div:not(:last-child)::after{
		content:", "
	}
	.rules-expression > div > span:not(:last-child)::after{
		content:" , ";
		color: gray;
	}
	.controls-container{
		min-width: 340px;
		max-height: 80vh;
		z-index: 1;
		display: flex;
		padding-inline: 20px;
		background-color: var(--bg0); 
		flex-direction: column;
		overflow: auto;
		resize: both;
	}
	

   
</style>