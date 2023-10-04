
<script lang="ts">
    import RuleComponent from "./RuleComponent.svelte";
	import {kernels, rules} from "../../../stores";
</script>

<div>
	<div>
		Rules Expression
		<div class="rules-expression">
			<div>
				{"max("}	
				{#each  $rules as r,i}
					{#if r.enabled}
						<div style="padding-left: 20px;">
							{"min("}
							{#each $kernels as k,j}
								<span style="color:var(--color{j});">
									{["A","B"][j]+i}
								</span>
							{/each}
							{")"}
						</div>
					{/if}
				{/each}
				{")"}
			</div>
		</div>
		
	</div>
	
	{#each $rules as r,i}
		<RuleComponent ruleId={i}/>
	{/each}
</div>



<style>
	.rules-expression{
		padding-top:20px;
		display: flex;
		justify-content: center;
		
	}
	.rules-expression > div{
		color: gray;
		width:max-content;
	}
	.rules-expression > div > div:not(:last-child)::after{
		content:", ";
		
	}
	.rules-expression > div >  div >  span:not(:last-child)::after{
		content:" , ";
		color: gray;
	}
</style>