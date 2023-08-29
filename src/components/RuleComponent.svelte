
<script  lang="ts">
	import type { Params } from "../types/types";
    import SigmoidGraph from "./graphs/SigmoidGraph.svelte";
    import SliderDouble from "./SliderDouble.svelte";
	export let ruleId:number;	
	export let params:Params;
	export let onChange:any;

	
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="rule">

	<div style="display: flex; justify-content: space-between;">
		<div>{ruleId}</div>
		{#if params.numberOfRules > 1 && params.numberOfRules-1 == ruleId}
			<button on:click={() => {params.numberOfRules--; onChange();}}>x</button>
		{/if}
	</div>
	
	<div style="padding-top: 10px;">
		<SigmoidGraph 
			ruleId={ruleId} params={params}
		/>
		{#each params.kernels as r,i}
			<SliderDouble bind:val0={params.kernels[i].rules[ruleId][0]} bind:val1={params.kernels[i].rules[ruleId][1]} onChange={onChange} color="var(--color{i})"/>
			<div style="display: flex; justify-content: space-between; padding-bottom: 20px; padding-top: 10px;">
				<input bind:value={params.kernels[i].rules[ruleId][2]} type="number" step="0.01" min="0.001" max="1" />
				<div style="color:var(--color{i});">slopes</div>
				<input bind:value={params.kernels[i].rules[ruleId][3]} type="number" step="0.01" min="0.001" max="1" />
			</div>
		{/each}
		


		<!-- <div style="display: flex; justify-content: space-between;">
			<div style="display: flex; gap:4px;">
				<div style="color:var(--color0);">Slope First</div>
				<input bind:value={rule.slopes[0]} type="number" step="0.01" min="0.001" max="1" />
			</div>
			<div style="display: flex; gap:4px;">
				<div style="color:var(--color0);">Slope Last</div>
				<input bind:value={rule.slopes[1]} type="number" step="0.01" min="0.001" max="1" />
			</div>	
		</div>
		
		<div style="display: flex; justify-content: space-between;">
			<div style="display: flex; gap:4px;">
				<div style="color:var(--color1);">Slope First</div>
				<input bind:value={rule.slopes[2]} type="number" step="0.01" min="0.001" max="1" />
			</div>
			<div style="display: flex; gap:4px;">
				<div style="color:var(--color1);">Slope Last</div>
				<input bind:value={rule.slopes[3]} type="number" step="0.01" min="0.001" max="1" />
			</div>
		</div> -->
	</div>
	
	
</div>

<style>



	.rule{
		background-color: var(--bg1);
		padding: 10px;
		margin: 4px;
	}

	input[type=number]{
		width: 60px;
	}

	.rule  .title{
		padding-bottom:10px;
		font-weight:bolder;
		font-size: large;
		opacity: 0.8;
	}   
</style>


