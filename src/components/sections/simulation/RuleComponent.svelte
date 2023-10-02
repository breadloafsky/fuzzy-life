
<script lang="ts">
    import SigmoidGraph from "../../graphs/SigmoidGraph.svelte";
	import NumberInput from "../../ui/NumberInput.svelte";
	import Switch from "../../input/Switch.svelte";
	import {params} from "../../../stores";
    import DoubleRange from "../../input/DoubleRange.svelte";
    
	export let ruleId:number;	

	let highlightedKernel:number|null=null;	//	highlight kernel

</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div data-enabled={$params.rules[ruleId].enabled} class="condition-container">
	<div class="header">
		<h3>Rule {ruleId}</h3>
		<Switch bind:value={$params.rules[ruleId].enabled}/>
	</div>
	{#if $params.rules[ruleId].enabled}
	<div class="body">
		<SigmoidGraph 
			highlightedKernel={highlightedKernel}
			ruleId={ruleId}
		/>
		{#each $params.kernels as r,i}
			<div
				on:mouseenter={()=>highlightedKernel = i}
				on:mouseleave={()=>highlightedKernel = null}
				class="subcondition" 
				style="border-color:var(--color{i});"
				>
				<div style="display: flex;  padding:4px;">
					<div style="color:var(--color{i});">{["A","B"][i]} {ruleId}</div>
				</div>

				<DoubleRange bind:val0={$params.rules[ruleId].conditions[i].thersholds[0]} bind:val1={$params.rules[ruleId].conditions[i].thersholds[1]} color="var(--color{i})"/>
				<div class="input_fields">
					<NumberInput 
						bind:value={$params.rules[ruleId].conditions[i].thersholds[0]}  
						step={0.001} 
						min={0.0} 
						max={$params.rules[ruleId].conditions[i].thersholds[1]}
					/>
					<hr/>
					<div style="color:var(--color{i});">thresholds</div>
					<hr/>
					<NumberInput 
						bind:value={$params.rules[ruleId].conditions[i].thersholds[1]}  
						step={0.001} 
						min={$params.rules[ruleId].conditions[i].thersholds[0]} 
						max={1.0}
					/>
				</div>
				<div class="input_fields">
					<NumberInput 
						bind:value={$params.rules[ruleId].conditions[i].slopes[0]}  
						step={0.01} 
						min={0.001} 
						max={1.0}
					/>
					<hr/>
					<div style="color:var(--color{i});">slopes</div>
					<hr/>
					<NumberInput 
						bind:value={$params.rules[ruleId].conditions[i].slopes[1]}  
						step={0.01} 
						min={0.001} 
						max={1.0}
					/>
				</div>
			</div>
		{/each}
	</div>
	{/if}
</div>

<style>
	h3{
		margin: 0;
	}
	[data-enabled="false"] h3{
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


