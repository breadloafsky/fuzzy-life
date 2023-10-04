
<script lang="ts">
    import RuleComponent from "./RuleComponent.svelte";
	import {params} from "../../../stores";
</script>

<div>
	Rules Expression
	<div class="rules-expression"  style="color: gray;">
		{"max("}	
		{#each  $params.rules as r,i}
			{#if r.enabled}
				<div style="padding-left: 20px;">
					{"min("}
					{#each $params.kernels as k,j}
						<span style="color:var(--color{j});">
							{["A","B","C","D"][j]+i}
						</span>
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