
<script  lang="ts">
    import SigmoidGraph from "../graphs/SigmoidGraph.svelte";
    import SliderDouble from "../SliderDouble.svelte";
	import Switch from "../ui/Switch.svelte";
	import {params, callbacks} from "../../stores";
	export let ruleId:number;	
	let ruleContainer:HTMLDivElement;


</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={ruleContainer} class="rule-container">

	<div class="header">
		<div>Rule {ruleId}</div>
		<Switch bind:value={$params.rules[ruleId].enabled}/>
	</div>
	
	{#if $params.rules[ruleId].enabled}
	<div class="body">
		<div style="padding-top: 10px;">
			<SigmoidGraph 
				ruleId={ruleId}
			/>
		</div>
		{#each $params.kernels as r,i}
			{#if $params.kernels[i].enabled}
				<div class="subrule" style="border-color:var(--color{i});">
					<div style="display: flex; justify-content: space-between;  padding-block:4px;">
						<div style="color:var(--color{i});">{["A","B","C","D"][i]} {ruleId}</div>
						<Switch bind:value={$params.rules[ruleId].subRules[i].enabled}/>
					</div>

					{#if $params.rules[ruleId].subRules[i].enabled && $params.kernels[i].enabled}
						<SliderDouble bind:val0={$params.rules[ruleId].subRules[i].thersholds[0]} bind:val1={$params.rules[ruleId].subRules[i].thersholds[1]} color="var(--color{i})"/>
						<div style="display: flex; justify-content: space-between; padding-top: 10px;">
							<input bind:value={$params.rules[ruleId].subRules[i].thersholds[0]}  type="number" step="0.01" min="0.0" max="1" />
							<div style="color:var(--color{i});">thresholds</div>
							<input bind:value={$params.rules[ruleId].subRules[i].thersholds[1]}  type="number" step="0.01" min="0.0" max="1" />
						</div>
						<div style="display: flex; justify-content: space-between; padding-bottom: 20px; padding-top: 4px;">
							<input bind:value={$params.rules[ruleId].subRules[i].slopes[0]}  type="number" step="0.01" min="0.001" max="1" />
							<div style="color:var(--color{i});">slopes</div>
							<input bind:value={$params.rules[ruleId].subRules[i].slopes[1]}  type="number" step="0.01" min="0.001" max="1" />
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
	{/if}
	
	
	
	
</div>

<style>

	

	.rule-container{
		border: 4px solid var(--bg2);
		background-color: var(--bg2);
		margin-inline: 0px;
		margin-block: 10px;

	}

	.header{
		display: flex; 
		justify-content: space-between; 
		padding: 4px;
		

	}

	.body{
		background-color: var(--bg1);
		padding-inline: 14px;
		padding-bottom: 10px;
	}

	.subrule{
		
		background-color: var(--bg2);
		border: 1px solid;
		margin-block: 10px;
		padding: 4px;

	}

	input[type=number]{
		width: 60px;
	}

	
</style>


