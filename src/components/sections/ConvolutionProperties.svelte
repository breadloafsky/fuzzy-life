
<script  lang="ts">
	import type { FormattedParams,  Params } from "../../types/types";
    import KernelGraph from "../graphs/KernelGraph.svelte";
	import {callbacks} from "../../stores";
	export let params:Params;
	export let formattedParams:FormattedParams;
	export let updateKernels:any;
	let edit:boolean = false;
	let selectedKernel:number|any = null;

	let kernImg:any = null;

	$:formattedParams, formatKernelImage();

	function formatKernelImage(){
		kernImg = formattedParams.kernelsPreview;
		params = params;
	}
	const hue:number[]=[50, 200, 120 ,270];
	


</script>

<!-- svelte-ignore a11y-missing-attribute -->


<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="properties" 
	style="--kern-img:url({kernImg}); 
		--kern-size:{params.convRadius*2-1};
		--bg-size:{32/((params.convRadius*2-1)/2)};
		">
	<div>
		<label for="dt">Δt multiplier:</label><br />
		<div style="display: flex;">
			<input bind:value={params.dt}  type="range"  name="dt"  step="0.01" min="0.01" max="1" />
			<div style="padding-left: 20px;">{params.dt}</div>
		</div>
		
	</div>
	<div>
		<label for="convRadius">kernel radius:</label><br />
		<div style="display: flex;">
			<input bind:value={params.convRadius} on:input={() => { formatKernelImage(); updateKernels();}} type="range"  name="convRadius"  step="1" min="2" max="16" />
			<div style="padding-left: 20px;">{params.convRadius}</div>
		</div>
		
	</div>
	

	

	<div>Kernel Preview {selectedKernel==null ? "(Combined)":""}</div>
	<div style="width: 100%; height: 240px; display: flex; justify-content: center; position: relative;">

		{#if kernImg != null}
			<div style="height: 240px; width: 240px;">
				{#if selectedKernel != null}
					<div 
						class="kern-img"
						style="
							--kern-img:url({kernImg[selectedKernel]}); 
							--size:240px;
							filter:hue-rotate({hue[selectedKernel]}deg);"
					/>
				{:else}
					{#each params.kernels as k,i}
					{#if k.enabled}
					<div 
						class="kern-img"
						style="
							--kern-img:url({kernImg[i]}); 
							position:absolute;
							--size:240px;
							opacity: 0.2; 
							filter:grayscale(1.0);"
					/>
					{/if}
					
					{/each}
				{/if}
			</div>
		{/if}
		

	</div>
	
	<div>Kernel Radial Weights</div>
	
	<KernelGraph
		bind:params={params}
		edit={edit}
		selectedKernel={selectedKernel}
		updateKernels={updateKernels}
	/>

	<div>
		<div>Kernels</div>
		<ul class="kern-list">
			{#each params.kernels as k,i}
			<li
				on:mouseenter={()=> !edit && (selectedKernel = k.enabled ? i : null)} 
				on:mouseleave={()=> !edit && (selectedKernel = null)}
				data-enabled={k.enabled}
			>
				<div style="display: flex; gap: 10px;">
					<div style="color: var(--color{i}); {!k.enabled && 'filter:grayscale(1);'} ">Kernel {["A","B","C","D"][i]}</div>
					{#if kernImg != null}
						<div style="height: 20px; width: 20px;">
							<div 
							class="kern-img"
							style="
							--kern-img:url({kernImg[i]}); 
							--size:20px;
							filter:hue-rotate({hue[i]}deg);"
							></div>
						</div>
					{/if}
				</div>
				<div>
				{#if edit}
					
					{#if selectedKernel == i}
						<button on:click={()=> edit = false}>Stop Editing</button>
					{/if}

				{:else}
					<button disabled={!k.enabled} on:click={()=> {edit = true; selectedKernel=i}}>Edit</button>
					<button on:click={() =>{k.enabled =! k.enabled; selectedKernel=null; updateKernels();}}>{k.enabled ? "disable": "enable" }</button>
		
				{/if}
					
				</div>	
			</li>
			{/each}
		</ul>
	</div>
</div>


<style>

	.kern-list{
		
	}

	.kern-list > li{
		background-color: var(--bg1);
		margin: 2px;
	}
	.kern-list > li[data-enabled="true"]:hover{
		background-color:  var(--bg2);
	}

	.kern-list > li[data-enabled="false"]{
		background-color: transparent;
	}

	.kern-list > li[data-enabled="false"] .kern-img{
		filter: grayscale(1) !important;
	}

	.kern-img {
		background-image: var(--kern-img);
		background-origin: border-box;
		image-rendering: pixelated;
		--size:64;
		--t:calc(var(--kern-size)/64);
		
		height:var(--size);
		width:var(--size);
		background-position: calc( var(--size)   / var(--t) )  calc( -1 * var(--size) / var(--t) );
		background-size: calc( var(--size) * 1 / var(--t) ) calc( var(--size)   / var(--t) );
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
		margin: 4px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}


</style>


