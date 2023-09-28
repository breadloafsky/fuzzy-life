
<script lang="ts">
    import RuleComponent from "./RuleComponent.svelte";
	import {params} from "../../../stores";
	const boolAsNum = (e:any):number => e;
</script>

<div>
	Rules Expression
	<div class="rules-expression"  style="color: gray;">
		{"max("}	
		{#each  $params.rules as r,i}
			{#if r.enabled && Math.max(...r.conditions.map((r,j) => boolAsNum(r.enabled && $params.kernels[j].enabled)))}
				<div style="padding-left: 20px;">
					{"min("}
					{#each $params.kernels as k,j}
						{#if k.enabled && $params.rules[i].conditions[j].enabled}
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
	{#each $params.rules as r,i}
		<RuleComponent ruleId={i}/>
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