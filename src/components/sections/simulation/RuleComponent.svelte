
<script  lang="ts">
    import SigmoidGraph from "../../graphs/SigmoidGraph.svelte";
	import NumberInput from "../../ui/NumberInput.svelte";
	import Switch from "../../ui/Switch.svelte";
	import {params} from "../../../stores";
    import DoubleRange from "../../input/DoubleRange.svelte";
    
	export let conditionId:number;	

	let highlightedKernel:number|null=null;	//	highlight kernel

</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div data-enabled={$params.conditions[conditionId].enabled} class="condition-container">
	<div class="header">
		<h3>Condition {conditionId}</h3>
		<Switch bind:value={$params.conditions[conditionId].enabled}/>
	</div>
	{#if $params.conditions[conditionId].enabled}
	<div class="body">
		<SigmoidGraph 
			highlightedKernel={highlightedKernel}
			conditionId={conditionId}
		/>
		{#each $params.kernels as r,i}
			{#if $params.kernels[i].enabled}
				<div
					on:mouseenter={()=>highlightedKernel = i}
					on:mouseleave={()=>highlightedKernel = null}
				 	class="subcondition" 
				 	style="border-color:var(--color{i});"
				 >
					<div style="display: flex; justify-content: space-between;  padding:4px;">
						<div style="color:var(--color{i});">{["A","B","C","D"][i]} {conditionId}</div>
						<Switch bind:value={$params.conditions[conditionId].subConditions[i].enabled}/>
					</div>

					{#if $params.conditions[conditionId].subConditions[i].enabled && $params.kernels[i].enabled}
						<DoubleRange bind:val0={$params.conditions[conditionId].subConditions[i].thersholds[0]} bind:val1={$params.conditions[conditionId].subConditions[i].thersholds[1]} color="var(--color{i})"/>
						<div class="input_fields">
							<NumberInput 
								bind:value={$params.conditions[conditionId].subConditions[i].thersholds[0]}  
								step={0.001} 
								min={0.0} 
								max={$params.conditions[conditionId].subConditions[i].thersholds[1]}
							/>
							<hr/>
							<div style="color:var(--color{i});">thresholds</div>
							<hr/>
							<NumberInput 
								bind:value={$params.conditions[conditionId].subConditions[i].thersholds[1]}  
								step={0.001} 
								min={$params.conditions[conditionId].subConditions[i].thersholds[0]} 
								max={1.0}
							/>
						</div>
						<div class="input_fields">
							<NumberInput 
								bind:value={$params.conditions[conditionId].subConditions[i].slopes[0]}  
								step={0.01} 
								min={0.001} 
								max={1.0}
							/>
							<hr/>
							<div style="color:var(--color{i});">slopes</div>
							<hr/>
							<NumberInput 
								bind:value={$params.conditions[conditionId].subConditions[i].slopes[1]}  
								step={0.01} 
								min={0.001} 
								max={1.0}
							/>
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
	{/if}
</div>

<style>
	h3{
		margin: 0;
	}
	[ data-enabled="false"] h3{
		color:#636363

	}
	hr{
		width: 100%;
		margin-inline: 10px;
		border: 0;
		border-bottom: 2px dotted #636363;
	}
	
	.condition-container{

		margin-inline: 0px;

	}

	.header{
		display: flex; 
		justify-content: space-between; 
		padding: 4px;
		margin-block: 10px;
	}

	.body{
		background-color: var(--bg0);
		padding-inline: 10px;
		padding-bottom: 10px;
	}

	.subcondition{
		background-color: #303030;
		border: 1px solid;
		margin-block: 10px;
		padding-block: 8px;
		padding-inline: 10px;
	}
	.input_fields{
		display: flex; 
		justify-content: space-between; 
		padding-top: 10px;
	}

	

	
</style>


