
<script  lang="ts">
	import type { Rule } from "../types/types";
    import SigmoidGraph from "./SigmoidGraph.svelte";

    
    import SliderDouble from "./SliderDouble.svelte";
	export let label:string|any;	
	export let rule:Rule;


</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="rule">

	<div style="display: flex; justify-content: space-between;">
		<div>{label}</div><button>x</button>
	</div>
	
	<div>
		<SigmoidGraph 
			rule={rule}
		/>
		<SliderDouble bind:val0={rule.thresholds[0]} bind:val1={rule.thresholds[1]} color={"var(--color0)"}/>
		<SliderDouble bind:val0={rule.thresholds[2]} bind:val1={rule.thresholds[3]} flipY={true} color={"var(--color1)"}/>
		<div style="display: flex; justify-content: space-between;">
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
		</div>
	</div>
	
	
</div>

<style>



	.rule{
		background-color: rgb(43, 43, 43);
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


