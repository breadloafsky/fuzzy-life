
<script lang="ts">
	import { onMount } from "svelte";
	import KernelCanvas from "./misc/KernelCanvas.svelte";
    import SectionContainer from "./ui/SectionContainer.svelte";
    import ConvolutionProperties from "./sections/ConvolutionProperties.svelte";
    import Rules from "./sections/Rules.svelte";
	import {params, tempParams, callbacks} from "../stores";
    import ParametersSelection from "./sections/ParametersSelection.svelte";
    import TextureSettings from "./sections/TextureSettings.svelte";
    import { utils } from "../utils";
    import Icon from "./ui/Icon.svelte";
	
	export let canvas : HTMLCanvasElement;
	let kc:KernelCanvas;	// an auxiliary canvas that renders kernel textures
	let paramsHidden = false;
	let currentTab = 1;
	

	const formatRules=()=>utils.formatRules($params, $tempParams);
	const updateKernels=()=>{utils.updateKernels($params,$tempParams,kc); formatRules()};

	const clear=(n:number)=>$tempParams.resetTexture = n+1;
	const pause=()=>$tempParams.paused = ! $tempParams.paused;
	
	$callbacks.updateKernelTextures = updateKernels;
	$:$params, formatRules();

	onMount(() => {
		updateKernels();
		// prevent button triggering when using spacebar
		document.body.onkeydown = (e) => {
			if((document.activeElement as any).nodeName == "BUTTON")
				e.preventDefault();
		};
		// key events setup
		document.body.onkeyup = (e) => {
			switch (e.key.toLowerCase()) {
				case " ":	// pause/play
					pause();
					break;
				case "c":	// clear the texture
					clear(0);
					break;
				case "x":	// fill the texture with gradient
					clear(1);
					break;
			}
			
			//	randomise values
			if (e.key.toLowerCase() == "r"){
				for(let i = 0; i < $params.rules.length; i++) {
					const rule = $params.rules[i];
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
				console.log($params); //debug
				$tempParams.resetTexture = 2;
				formatRules();
			}
		};
		// brush radius change
		canvas.addEventListener("wheel", (e:MouseEvent|any) => {
			let v = ($tempParams.brush.r-(e.deltaY/100));
			v = v > 100 ? 100 : v < 1 ? 1 : v; 
			$tempParams.brush.r= Math.round(v);
		});
		// brush draw
		canvas.addEventListener("mousedown", (e) => {
			if(e.button == 0)
				$tempParams.brush.type = 2;
			else
				$tempParams.brush.type = 3;
		});
		canvas.addEventListener("mouseup",  (e)=> {
			$tempParams.brush.type = 1;
		});	
		// brush position change
		canvas.addEventListener("mousemove",(e:MouseEvent|any)=>{
			$tempParams.brush.x = e.clientX/e.target.clientWidth;
			$tempParams.brush.y = 1 - e.clientY/e.target.clientHeight;
		});
		// show/hide brush "circle" 
		canvas.addEventListener("mouseenter",()=> $tempParams.brush.type = 1);
		canvas.addEventListener("mouseleave",()=> $tempParams.brush.type = 0);
	});
</script>

<KernelCanvas bind:this={kc}/>
<div class="controls-container" data-hidden={paramsHidden}>
	<div class="params-container" >
		<div class="params-header">
			<div class="tabs">
				<button disabled={currentTab == 0} on:click={()=> currentTab=0}>preferences</button>
				<button disabled={currentTab == 1} on:click={()=> currentTab=1}>simulation</button>
			</div>
		</div>
		<div class="params-body">
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
	<div>
		<button title="collapse" class="toggle" on:click={ ()=> paramsHidden = !paramsHidden}>
			{paramsHidden ? ">" : "<"}
		</button>
		<div class="actions">
			<button on:click={()=>pause( )} title="{$tempParams.paused ? "activate":"pause"} the simulation (SPACEBAR)">
				<Icon name={$tempParams.paused ? "play":"pause"}/>
			</button>
			<button on:click={()=>clear(1)} title="pattern fill (X)">
				<Icon name="gradient"/>
			</button>
			<button on:click={()=>clear(0)} title="clear (C)">
				<Icon name="clear"/>
			</button>
		</div>
	</div>
</div>



<style>	

	.actions{
		width: 30px;
		gap: 20px;
		padding-inline: 5px;
		padding-top: 15px;
		background-color: rgba(0, 0, 0, 0.8); 
		border-bottom-right-radius: 6px;
	}
	.actions > button{
		width: 30px;
		height: 30px;
		margin-block: 5px;
	}
	.controls-container{
		min-width: 100vw;
		max-height: 100vh;
		display: flex;
	} 
	.controls-container > div{
		z-index: 1;
	} 
	.params-container{
		background-color:rgba(0, 0, 0, 0.8); 
	}
	.controls-container:hover .params-container{
		background-color: black;	
	}	
	.params-body{
		min-width: 340px;
		width: 340px;
		min-height: 200px;
		max-height: calc( 100vh - 40px);
		
		display: flex;
		flex-direction: column;
		padding-inline: 5px;
		padding-left: 20px;
		overflow-y:scroll;
		resize: both;	
	} 
	.params-header{
		height: 40px;
		display: flex;
		justify-content: end;
		background-color: var(--bg1); 
		border-bottom: 1px solid var(--bg3);
	}   
	.toggle{
		width: 40px;
		height: 40px;
		border-radius: 0;
	}  
	
	[data-hidden="true"] .params-body  {
		display: none;
	}
	
	.tabs{
		border-top-right-radius: 22px;
		display: flex;
		justify-content: center;
	}
	[data-hidden="true"] .tabs  {
		display: none;
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