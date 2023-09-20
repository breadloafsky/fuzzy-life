
<script  lang="ts">
    import KernelGraph from "../graphs/KernelGraph.svelte";
	import ParameterContainer from "../ui/ParameterContainer.svelte";
	import Switch from "../ui/Switch.svelte";
	import {params ,callbacks, tempParams} from "../../stores";
    import { onMount } from "svelte";
	
	let edit:boolean = false;
	let selectedKernel:number|any = null;
	const hue:number[]=[50, 200, 270];

	$:kernImg = $tempParams.kernelsPreview;
	$:kernels = $params.kernels;
	$:convRadius = $params.convRadius;
</script>
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if kernImg}
<div class="properties" 
	style="
		--kern-size:{convRadius*2-1};

		">
	<ParameterContainer label="Δt multiplier">
		<input bind:value={$params.dt}  type="range"  name="dt"  step="0.01" min="0.01" max="1" />
		<div style="width: 40px; text-align: center;">{$params.dt}</div>
	</ParameterContainer>
	<ParameterContainer label="Kernel radius">
		<input bind:value={$params.convRadius} on:input={() => $callbacks.updateKernelTextures()} type="range"  name="convRadius"  step="1" min="2" max="16" />
		<div style="width: 40px; text-align: center;">{convRadius}px</div>
	</ParameterContainer>
	<div>Kernel Preview {selectedKernel==null ? "(Combined)":""}</div>
	<div style="width: 100%; height: 240px; display: flex; justify-content: center; position: relative;">
		{#if $tempParams.kernelsPreview != null}
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
					{#each kernels as k,i}
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
	
	<div>Kernel Value ( with respect to the radius )</div>
	
	<KernelGraph
		edit={edit}
		selectedKernel={selectedKernel}
	/>
	<div>
		<div>Kernels</div>
		<ul class="kern-list">
			{#each $params.kernels as k,i}
			<li
				on:mouseenter={()=> !edit && (selectedKernel = k.enabled ? i : null)} 
				on:mouseleave={()=> !edit && (selectedKernel = null)}
				data-enabled={k.enabled}
			>
				<div style="display: flex; gap: 10px;">
					<div style="color: var(--color{i}); {!k.enabled && 'filter:grayscale(1);'} ">Kernel {["A","B","C","D"][i]}</div>
					{#if kernImg != null}
						<div>
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
				<div style="display: flex; gap:20px;">
				{#if edit}
					
					{#if selectedKernel == i}
						<button on:click={()=> edit = false}>Stop Editing</button>
					{/if}

				{:else}
					<Switch 
						bind:value={k.enabled} 
						on:click={() => selectedKernel=null}
					/>
					<button disabled={!k.enabled} on:click={()=> {edit = true; selectedKernel=i}}>Edit</button>
					
				{/if}
					
				</div>	
			</li>
			{/each}
		</ul>
	</div>
</div>
{/if}



<style>


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


