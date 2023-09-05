
<script lang="ts">
	import KernelCanvas from "./graphs/KernelCanvas.svelte";
    import { onMount } from "svelte";
    import SectionContainer from "./sections/SectionContainer.svelte";
    import ConvolutionProperties from "./sections/ConvolutionProperties.svelte";
    import Rules from "./sections/Rules.svelte";
	import {automaton, callbacks} from "../stores";
	let kc:KernelCanvas;
	let fileInput:HTMLInputElement|any;

	export let scene:any;
	

	$callbacks.updateKernelTextures = updateKernels;
	$callbacks.formatRules = formatRules;

	onMount(() => {
		updateKernels();
		document.body.onkeyup = (e) => {
			// if (e.key.toLowerCase() == "d")
			// 	settings.debugVal = 1 - settings.debugVal;
			if (e.key == " " || e.code == "Space")
				$automaton.settings.paused = ! $automaton.settings.paused;
			if (e.key.toLowerCase() == "c")
				scene.clear();
			
			//	randomise values
			if (e.key.toLowerCase() == "r"){
				for(let i = 0; i < $automaton.params.rules.length; i++) {
					const rule = $automaton.params.rules[i];
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
				console.log($automaton.params); //debug
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
    	var file = new Blob([JSON.stringify({...$automaton.params},filterProperty,"\t")], {type: "json"});
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
				// automaton.set({
				// 	...$automaton, params:JSON.parse(reader.result+"")
				// });

				Object.assign($automaton, { ...$automaton, params:JSON.parse(reader.result+"") });
				updateKernels();
			});
			reader.readAsText(file);
			return;
		} 
		alert("File error");
	}

	// format and put all the rules into 1d array that will be passed to the shader
	function formatRules(){
		const params = $automaton.params;
		const formattedParams = $automaton.formattedParams;
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
		const params = $automaton.params;
		const formattedParams = $automaton.formattedParams;
		formattedParams.kernelTexture = kc.renderTexture(params.kernels, params.convRadius);
		formattedParams.kernelsPreview = kc.renderPreview(params.kernels, params.convRadius);
		formatRules();
		$automaton = $automaton;	// update store
		
	}


	


</script>

<KernelCanvas bind:this={kc}/>
<div class="controls-container" style="pointer-events: {$automaton.brush[3] != 0 ? "none" : "all"};">

	<label title="load file">
		load file
		<input 
			bind:this={fileInput} 
			on:change={() => loadScene()}
			type="file" 
			accept="application/JSON"/>
	</label>
	<label title="save file">
		save file
		<button 
			title="save file"
			on:click={() => saveScene()}>save
		</button>
	</label>
	<label title="clear">
		<button on:click={(e) => {scene.clear();}}>clear scene</button>
	</label>

	<SectionContainer label="Convolution Settings">
		<ConvolutionProperties/>
	</SectionContainer>
	<SectionContainer label="Rules">
		<Rules/>
	</SectionContainer>
</div>




<style>
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