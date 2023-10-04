
<script  lang="ts">
    import KernelGraph from "../../graphs/KernelGraph.svelte";
	import ParameterContainer from "../../ui/ParameterContainer.svelte";
	import {kernRadius, kernels, scene} from "../../../stores";
    import KernelPreview from "../../ui/KernelPreview.svelte";
    import KernelCanvas from "../../misc/KernelCanvas.svelte";
    import { onMount } from "svelte";
	
	let edit:boolean = false;
	let selectedKernel:number|any = null;
	let kc:KernelCanvas;	// a canvas that renders kernel textures
	let timer:any = 0;	// timer for kernel reset
	
	let kernelTexture:any;
	let kernelsPreview:any;
	
	onMount(() => {
		updateKernels();
	});


	$:$kernels,kc && updateKernels();

	const updateKernels=()=>{

		// update kernel texture
		kernelTexture = kc.renderTexture($kernels, $kernRadius);
		kernelsPreview = kc.renderPreview($kernels, $kernRadius);

		// set kernel texture with a small delay
		clearTimeout(timer);
		timer = setTimeout(() => { $scene.setKernels(kernelTexture, () => {
					$scene.convRadius = $kernRadius;	// update kernel radius
		});}, 10)
	};

</script>
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<KernelCanvas bind:this={kc}/>
{#if kernelsPreview}
<div class="properties" 
	style="--kern-size:{$kernRadius*2-1};">
	
	<ParameterContainer vertical label="dt" labelStyle="font-style: italic;">
		<input bind:value={$scene.dt}  type="range"  name="dt"  step="0.01" min="0.01" max="1" />
		<div>{$scene.dt}</div>
	</ParameterContainer>

	<ParameterContainer vertical 
		label="Kernel Radius"
		warning="Large kernel and texture size may affect performance"
	>
		<input bind:value={$kernRadius} on:input={updateKernels} type="range"  name="convRadius"  step="1" min="2" max="32" />
		<div>{$kernRadius}px</div>
	</ParameterContainer>

	<div>
		<div>Kernel Preview ({selectedKernel==null ? "Combined":"Kernel "+["A","B"][selectedKernel]})</div>
		<div class="preview">
			{#if selectedKernel != null}
			<KernelPreview
				kernel={kernelsPreview[selectedKernel]}
				i={selectedKernel}
				size={240}
			/>
			{:else}
				{#each $kernels as k,i}
				<KernelPreview
					kernel={kernelsPreview[i]}
					i={i}
					size={240}
					absolute
					off
				/>
				{/each}
			{/if}
		</div>
	</div>
	<div>
		<div>Kernel Editor</div>
		<p>Kernel cross-section:</p>
		<KernelGraph edit={edit}
			selectedKernel={selectedKernel}/>
		<p>
			{#if edit}
			{"LMB - add/move point, RMB - remove point"}
			{:else}
			{"Select a kernel to edit:"}
			{/if}
		</p>
		<ul class="kern-list">
			{#each $kernels as k,i}
			{#if !edit || (edit && selectedKernel==i)}
			<li on:mouseenter={()=> !edit && (selectedKernel = i)} 
				on:mouseleave={()=> !edit && (selectedKernel = null)}>
				<div>
					<div style="color: var(--color${i});">Kernel {["A","B"][i]}</div>
					{#if kernelsPreview != null}
					<KernelPreview
						kernel={kernelsPreview[i]}
						i={i}
						size={20}/>
					{/if}
				</div>
				<div style="display: flex; gap:20px;">
				{#if edit}
					<button on:click={()=> edit = false}>Stop Editing</button>
				{:else}
					<button on:click={()=> {edit = true; selectedKernel=i}}>Edit</button>	
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

	li:hover{
		background-color:  var(--bg2);
	}

	li > div:first-child{
		display: flex; 
		gap: 10px;
		align-items: center;
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


