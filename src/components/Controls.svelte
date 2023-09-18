
<script lang="ts">
	import KernelCanvas from "./graphs/KernelCanvas.svelte";
    import { onMount } from "svelte";
    import SectionContainer from "./sections/SectionContainer.svelte";
    import ConvolutionProperties from "./sections/ConvolutionProperties.svelte";
    import Rules from "./sections/Rules.svelte";
	import {automaton, callbacks} from "../stores";
    import ParametersSelection from "./sections/ParametersSelection.svelte";
    import TextureSettings from "./sections/TextureSettings.svelte";
	
	let kc:KernelCanvas;	// an auxiliary canvas that renders kernel textures
	let paramsHidden = false;
	let currentTab = 1;
	

	$callbacks.updateKernelTextures = ()=>updateKernels();
	$callbacks.formatRules = ()=>formatRules();

	onMount(() => {
		updateKernels();
		document.body.onkeyup = (e) => {
			switch (e.key.toLowerCase()) {
				case " ":
					$automaton.settings.paused = ! $automaton.settings.paused;
					break;
				case "c":
					$automaton.formattedParams.resetTexture = 1;
					break;
				case "x":
					$automaton.formattedParams.resetTexture = 2;
					break;
			}
			
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
				$automaton.formattedParams.resetTexture = 2;
				formatRules();
			}
		}
	});



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
<div class="controls-container">
	<div class="params-container" data-hidden={paramsHidden} style="pointer-events: {$automaton.brush[3] != 0 ? "none" : "all"};">
		<div class="params-header">
			<div class="tabs">
				<button disabled={currentTab == 0} on:click={()=> currentTab=0}>preferences</button>
				<button disabled={currentTab == 1} on:click={()=> currentTab=1}>simulation</button>
			</div>
			<button on:click={ ()=> paramsHidden = !paramsHidden}>{paramsHidden ? ">" : "<"}</button>
		</div>
		<div class="params-window">
			<div hidden={currentTab!=0}>
				<SectionContainer label="Texture Settings">
					<TextureSettings/>
				</SectionContainer>
			</div>
			<div hidden={currentTab!=1}>
				<SectionContainer label="Save / Load Parameters">
					<ParametersSelection/>
				</SectionContainer>
				<SectionContainer label="Convolution Properties">
					<ConvolutionProperties/>
				</SectionContainer>
				<SectionContainer label="Rules">
					<Rules/>
				</SectionContainer>
			</div>
			
		</div>
	</div>

</div>





<style>

	
	
	.controls-container{
		min-width: 100vw;
		max-height: 100vh;
		display: flex;
		pointer-events: none;
	} 
	.controls-container > div{
		z-index: 1;
	} 

	.params-container{
		background-color:rgba(0, 0, 0, 0.8); 
		transition: 0.4s;
		
	}

	.controls-container:hover .params-container{
		background-color: black;
		
	}
	
	

	.params-window{
		min-width: 340px;
		max-height: calc( 100vh - 40px);
		display: flex;
		flex-direction: column;
		padding-inline: 20px;
		overflow: auto;
		resize: both;	
	} 

	.params-header{
		display: flex;
		justify-content: end;
		background-color: var(--bg1); 
		border-bottom: 1px solid var(--bg3);
	}   
	.params-header > button{
		width: 40px;
		height: 40px;
		border-radius: 0;
	}  
	.params-container[data-hidden="true"] .params-window  {
		min-width: 0px !important;
		width: 0px !important;
		max-height: 0px;
		height: 0px;
		margin-top: 0px;
		visibility: hidden;
	}
	.tabs{
		border-top-right-radius: 22px;
		display: flex;
		justify-content: center;
	}
	.params-container[data-hidden="true"] .tabs  {
		visibility: hidden;
		width: 0px;
	}
	.tabs > button{
		outline: none;
		border-radius: 0;
	}
	.tabs > button:disabled{
		transform: translateY(1px);
		border-inline: 1px solid var(--bg3);
		background-color: black;
		color:wheat;
	}



</style>