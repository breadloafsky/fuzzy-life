
<script lang="ts">
	import { onMount } from "svelte";
	import {scene} from "../stores";
    import SectionContainer from "./ui/SectionContainer.svelte";
    import ConvolutionProperties from "./sections/simulation/ConvolutionProperties.svelte";
    import Rules from "./sections/simulation/Rules.svelte";
    import ParametersSelection from "./sections/simulation/ParametersSelection.svelte";
    import Icon from "./ui/Icon.svelte";
    import GeneralSettings from "./sections/preferences/GeneralSettings.svelte";
    import GradientSettings from "./sections/preferences/GradientSettings.svelte";
	
	export let canvas : HTMLCanvasElement;

	let paramsHidden = false;
	let currentTab = 1;
	
	const clear=(n:number)=>$scene.resetTexture = n+1;
	const pause=()=>$scene.isPaused = ! $scene.isPaused;

	onMount(() => {
		// prevent button triggering / scrolling when using spacebar
		document.body.onkeydown = (e) => {
			if(e.code == "Space")
				e.preventDefault();
		};
		// key events setup
		document.body.onkeyup = (e) => {
			switch (e.code) {
				case "Space":	// pause/play
					pause();
					break;
				case "KeyC":	// clear texture
					clear(0);
					break;
				case "KeyX":	// fill texture with pattern
					clear(1);
					break;
			}
		};
		// brush radius change
		canvas.addEventListener("wheel", (e:MouseEvent|any) => {
			let v = ($scene.brush.r-(e.deltaY/100));
			v = v > 100 ? 100 : v < 1 ? 1 : v; 
			$scene.brush.r= Math.round(v);
		});
		// brush draw
		canvas.addEventListener("mousedown", (e) => {
			if(e.button == 0)
				$scene.brush.type = 2;
			else
				$scene.brush.type = 3;
		});
		canvas.addEventListener("mouseup",  (e)=> {
			$scene.brush.type = 1;
		});	
		// brush position change
		canvas.addEventListener("mousemove",(e:MouseEvent|any)=>{
			$scene.brush.x = e.clientX/e.target.clientWidth;
			$scene.brush.y = 1 - e.clientY/e.target.clientHeight;
		});
		// show/hide brush "circle" 
		canvas.addEventListener("mouseenter",()=> $scene.brush.type = 1);
		canvas.addEventListener("mouseleave",()=> $scene.brush.type = 0);
	});

</script>


<div class="controls-container" data-hidden={paramsHidden}>
	<div class="params-container" >
		<div class="params-header">
			<a title="github repo" href="https://github.com/breadloafsky/fuzzy-life"><Icon name="github"/></a>
			<div class="tabs">
				<button disabled={currentTab == 0} on:click={()=> currentTab=0}>preferences</button>
				<button disabled={currentTab == 1} on:click={()=> currentTab=1}>simulation</button>
			</div>
		</div>
		<div class="params-body">
			<!-- preferences -->
			<div hidden={currentTab!=0}>
				<SectionContainer label="General">
					<GeneralSettings/>
				</SectionContainer>
				<SectionContainer label="Colour">
					<GradientSettings/>
				</SectionContainer>
			</div>
			<!-- parameters -->
			<div hidden={currentTab!=1}>
				<SectionContainer label="Save / Load Parameters">
					<ParametersSelection/>
				</SectionContainer>
				<SectionContainer label="Main Properties">
					<ConvolutionProperties/>
				</SectionContainer>
				<SectionContainer label="Rules">
					<Rules/>
				</SectionContainer>
			</div>
		</div>
	</div>
	<div>
		<button title="hide/show sidebar" class="toggle" on:click={ ()=> paramsHidden = !paramsHidden}>
			{paramsHidden ? ">" : "<"}
		</button>
		<div class="actions">
			<button on:click={()=>pause( )} title="{$scene.isPaused ? "activate":"pause"} the simulation (SPACEBAR)">
				<Icon name={$scene.isPaused ? "play":"pause"}/>
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
		width: 400px;
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
		justify-content: space-between;
		background-color: var(--bg1); 
		border-bottom: 1px solid var(--bg3);
		align-items: center;
	}   
	.params-header > a{
		padding-left: 20px;
		height: 20px;
		width: 20px;
		background-color: #303030;
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
	}   
	.params-header > a:hover{
		background-color: #5a5a5a;
	}   

	.toggle{
		width: 40px;
		height: 40px;
		border-radius: 0;
	}  
	
	[data-hidden="true"] .params-container  {
		display: none;
	}
	
	.tabs{
		display: flex;
		justify-content: center;
		height: 100%;
	}
	
	.tabs > button{
		outline: none;
		border-radius: 0;
		border: 1px solid var(--bg3);
		border-bottom: 0;
		font-weight: bold;
	}
	.tabs > button:disabled{
		transform: translateY(1px);
		background-color: black;
		color:wheat;
	}



</style>