
<script  lang="ts">
	import { FormattedParams, Kernel, type Params, type Rule } from "../types/types";
    import KernelGraph from "./graphs/KernelGraph.svelte";
    import KernelCanvas from "./graphs/KernelCanvas.svelte";
    import { onMount } from "svelte";
	export let params:Params;
	export let formattedParams:FormattedParams;
	export let formatKernel:any;
	let hoveredKernel:number|any = null;
	let selectedKernel:number|any = null;


</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="properties">
	<div>Kernel Image {(hoveredKernel==null && selectedKernel==null) ? "(Combined)":""}</div>
	<div style="width: 100%; height: 240px; display: flex; justify-content: center; position: relative;">
		{#if hoveredKernel !=null || selectedKernel != null}
		<!-- svelte-ignore a11y-missing-attribute -->
		<img width="240" height="240" src={formattedParams.kernelTextures[selectedKernel != null ? selectedKernel : hoveredKernel]}/>
		{:else}
			{#each params.kernels as k,i}
					<!-- svelte-ignore a11y-missing-attribute -->
					<img width="240" height="240" src={formattedParams.kernelTextures[i]} style="position: absolute; opacity: 0.5;"/>
			{/each}
		{/if}
	</div>
	<div>Kernel Radial Weights</div>
	
	<KernelGraph
		bind:kernels={params.kernels}
		hoveredKernel={hoveredKernel}
		selectedKernel={selectedKernel}
		formatKernel={formatKernel}
	/>

	<div>
		<div>Kernels</div>
		<ul>
			{#each params.kernels as k,i}
			<li on:mouseenter={()=> hoveredKernel = i} on:mouseleave={()=> hoveredKernel = null}>
				<div style="display: flex; gap: 10px;">
					<div style="color: var(--color{i});">{i}</div>
					{#if formattedParams.kernelTextures[i] != null}
						<!-- svelte-ignore a11y-missing-attribute -->
						<img width="20" height="20" src={formattedParams.kernelTextures[i]}/>
					{/if}
				
				</div>
				<div>
					{#if selectedKernel == null}
						<button>Delete</button>
						<button on:click={()=> selectedKernel = i}>Edit</button>
					{/if}
					{#if selectedKernel == i}
						<button on:click={()=> selectedKernel = null}>Stop Editing</button>
					{/if}
				</div>	
			</li>
			{/each}
			{#if params.kernels.length < 6}
				<button on:click={() => {params.kernels.push(new Kernel()); } }>Add new</button>
			{/if}
			
		</ul>
	</div>
	
	
	
</div>

<style>
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
		background-color: var(--bg1);
		padding: 10px;
		margin: 4px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}


</style>


