
<script  lang="ts">
    import KernelGraph from "../../graphs/KernelGraph.svelte";
	import ParameterContainer from "../../ui/ParameterContainer.svelte";
	import Switch from "../../input/Switch.svelte";
	import {params ,callbacks, tempParams} from "../../../stores";
    import KernelPreview from "../../ui/KernelPreview.svelte";
	
	let edit:boolean = false;
	let selectedKernel:number|any = null;
	const kernLetters=["A","B","C","D"]

	$:kernImg = $tempParams.kernelsPreview;
	$:kernels = $params.kernels;
	$:convRadius = $params.convRadius;

	//	ToDo: clean this mess

</script>
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if kernImg}
<div class="properties" 
	style="--kern-size:{convRadius*2-1};">
	
	<ParameterContainer vertical label="dt" labelStyle="font-style: italic;">
		<input bind:value={$params.dt}  type="range"  name="dt"  step="0.01" min="0.01" max="1" />
		<div>{$params.dt}</div>
	</ParameterContainer>

	<ParameterContainer vertical 
		label="Kernel Radius"
		warning="Large kernel size and texture size can affect performance"
	>
		<input bind:value={$params.convRadius} on:input={$callbacks.updateKernelTextures} type="range"  name="convRadius"  step="1" min="2" max="32" />
		<div>{convRadius}px</div>
	</ParameterContainer>

	<div>
		<div>Kernel Preview ({selectedKernel==null ? "Combined":"Kernel "+kernLetters[selectedKernel]})</div>
		<div class="preview">
		
				{#if selectedKernel != null}
				<KernelPreview
					selectedKernel={selectedKernel}
					size={240}
				/>
				{:else}
					{#each kernels as k,i}
						{#if k.enabled}
						<KernelPreview
							selectedKernel={i}
							size={240}
							absolute
							off
						/>
						{/if}
					{/each}
				{/if}
			
		</div>
	</div>
	<div>
		<div>Kernel Editor</div>
			<KernelGraph
				edit={edit}
				selectedKernel={selectedKernel}
			/>
			
			<p style="color: #b6b6b6; text-align: center;">
				{#if edit}
				{"LMB - add/move point, RMB - remove point"}
				{:else}
				{"Select a kernel to edit:"}
				{/if}
			</p>
		
		<ul class="kern-list">
			{#each $params.kernels as k,i}
			{#if !edit || (edit && selectedKernel==i)}
			<li
				on:mouseenter={()=> !edit && (selectedKernel = k.enabled ? i : null)} 
				on:mouseleave={()=> !edit && (selectedKernel = null)}
				data-enabled={k.enabled}
			>
				<div>
					<div style="{k.enabled ? `color: var(--color${i}); `: "filter:grayscale(1);"} ">Kernel {kernLetters[i]}</div>
					{#if kernImg != null}

					<KernelPreview
						selectedKernel={i}
						size={20}
						off={!k.enabled}
					/>
					{/if}
				</div>
				<div style="display: flex; gap:20px;">
				{#if edit}
					<button on:click={()=> edit = false}>Stop Editing</button>
				{:else}
					<Switch 
						bind:value={k.enabled} 
						on:click={() => selectedKernel=null}
					/>
					<button disabled={!k.enabled} on:click={()=> {edit = true; selectedKernel=i}}>Edit</button>	
				 {/if}
				</div>	
			</li>
			{/if}
			{/each}
		</ul>
		
		
	</div>
</div>
{/if}



<style>

	
	.preview{
		width: 100%; 
		height: 240px; 
		display: flex; 
		justify-content: center; 
		position: relative; 
		padding-top: 30px;
	}

	ul {
		padding: 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	li{
		border: solid 1px #383838;
		background-color: var(--bg1);
		padding: 5px;
		margin: 0;
		width: 100%;
		max-width: 400px;
		
	}
	li > div:first-child{
		display: flex; 
		gap: 10px;
		align-items: center;
	}
	li[data-enabled="true"]:hover{
		background-color:  var(--bg2);
	}

	li[data-enabled="false"]{
		background-color: var(--bg3);
	}

	li[data-enabled="false"] .kern-img{
		filter: grayscale(1) !important;
	}


	.properties{
		--kern-index:0;
		--kern-size:10;
		--kern-img : var("/");
		--bg-size:100;
		margin: 4px;
		display: flex;
		flex-direction: column;
	}


</style>


