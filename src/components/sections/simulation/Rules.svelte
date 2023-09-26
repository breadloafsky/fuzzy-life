
<script lang="ts">
    import RuleComponent from "./RuleComponent.svelte";
	import {params} from "../../../stores";

	const boolAsNum = (e:any) => e as number;
</script>




<div>
	Rule Expression
	<div class="rules-expression"  style="color: gray;">
		{"max("}	
		{#each  $params.conditions as r,i}
			{#if r.enabled && Math.max(...r.subConditions.map((r,j) => boolAsNum(r.enabled && $params.kernels[j].enabled)))}
				<div style="padding-left: 20px;">
					{"min("}
					{#each $params.kernels as k,j}
						{#if k.enabled && $params.conditions[i].subConditions[j].enabled}
							<span style="color:var(--color{j});">
								{["A","B","C","D"][j]+i}
							</span>
						{/if}
					{/each}
					{")"}
				</div>
			{/if}
		{/each}
		{")"}
	</div>
	
	{#each $params.conditions as r,i}
		<RuleComponent conditionId={i}/>
	{/each}
</div>






<style>
	.rules-expression > div:not(:last-child)::after{
		content:", "
	}
	.rules-expression > div > span:not(:last-child)::after{
		content:" , ";
		color: gray;
	}
</style>