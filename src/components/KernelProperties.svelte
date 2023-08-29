
<script  lang="ts">
	import { FormattedParams, Kernel, type Params } from "../types/types";
    import KernelGraph from "./graphs/KernelGraph.svelte";
	import {callbacks} from "../stores";
	export let params:Params;
	export let formattedParams:FormattedParams;
	export let updateKernels:any;
	let hoveredKernel:number|any = null;
	let selectedKernel:number|any = null;

	let kernImg:any = "/";

	$:formattedParams, formatKernelImage();

	function formatKernelImage(){
		kernImg = formattedParams.kernelTexture
		params = params;
	}
	const hue:number[]=[50, 200, 120 ,270];
	


</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="properties" 
	style="--kern-img:url({kernImg}); 
		--kern-size:{params.convRadius*2-1};
		--bg-size:{32/((params.convRadius*2-1)/2)};
		">
	
	<div>
		<label for="convRadius">Convolution / Kernel Radius:</label><br />
		<input bind:value={params.convRadius} on:input={() => { formatKernelImage();updateKernels();}} type="range" id="temp"  name="convRadius"  step="1" min="2" max="16" />
		<div>{params.convRadius}</div>
	</div>

	

	<div>Kernel Image {(hoveredKernel==null && selectedKernel==null) ? "(Combined)":""}</div>
	<div style="width: 100%; height: 240px; display: flex; justify-content: center; position: relative;">


		<div style="height: 240px; width: 240px;">
		{#if hoveredKernel !=null || selectedKernel != null}
			<div 
				class="kern"
				style="
				--kern-index:{selectedKernel != null ? selectedKernel : hoveredKernel}; 
				--size:240px;
				filter:hue-rotate({selectedKernel != null ? `${hue[selectedKernel]}` : `${hue[hoveredKernel]}`}deg);"
			></div>	
		{:else}
			{#each params.kernels as k,i}
			<div 
				class="kern"
				style="
				position:absolute;
				--kern-index:{i}; 
				--size:240px;
				opacity: 0.2; 
				filter:grayscale(1.0);"
			></div>
			{/each}
		{/if}
	</div>
		
	</div>
	
	

	
	<div>Kernel Radial Weights</div>
	
	<KernelGraph
		bind:kernels={params.kernels}
		hoveredKernel={hoveredKernel}
		selectedKernel={selectedKernel}
		updateKernels={updateKernels}
	/>

	<div>
		<div>Kernels</div>
		<ul>
			{#each params.kernels as k,i}
			<li on:mouseenter={()=> hoveredKernel = i} on:mouseleave={()=> hoveredKernel = null}>
				<div style="display: flex; gap: 10px;">
					<div style="color: var(--color{i});">{i}</div>
					{#if formattedParams.kernelTexture != null}
						<div style="height: 20px; width: 20px;">
							<div 
							class="kern"
							style="
							--kern-index:{i}; 
							--size:20px;
							filter:hue-rotate({hue[i]}deg);"
							></div>
						</div>
					{/if}
				</div>
				<div>
					{#if selectedKernel == null}
						<button on:click={() =>{params.kernels.splice(i, 1); updateKernels();}}>Delete</button>
						<button on:click={()=> selectedKernel = i}>Edit</button>
					{/if}
					{#if selectedKernel == i}
						<button on:click={()=> selectedKernel = null}>Stop Editing</button>
					{/if}
				</div>	
			</li>
			{/each}
			{#if params.kernels.length < 4}
				<button on:click={() => {params.kernels.push(new Kernel()); updateKernels(); $callbacks.updateKernelGraphs(); } }>Add new</button>
			{/if}
			
		</ul>
	</div>
	
	
	
</div>


<style>



	.kern {
		background-image: var(--kern-img);
		background-origin: border-box;
		image-rendering: pixelated;
		--kern-index:1;
		--size:64;
		--t:calc(var(--kern-size)/64);
		
		height:var(--size);
		width:var(--size);

		background-position: calc( var(--size)   / var(--t) )  calc( -1 * var(--size)  * var(--kern-index) / var(--t) );
		background-size: calc( var(--size) * 1 / var(--t) ) calc( var(--size)  * 4 / var(--t) );
	}

	
	ul {
		padding: 0px;
		display: flex;
		flex-direction: column;
		margin: 10px;
	}
	li{
		background-color: #222;
		padding: 5px;
	}


	.properties{
		--kern-index:0;
		--kern-size:10;
		--kern-img : var("/");
		--bg-size:100;
		background-color: var(--bg1);
		padding: 10px;
		margin: 4px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}


</style>


