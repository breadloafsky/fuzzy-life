
<script lang="ts">
	import { onMount } from "svelte";    
    import type { Kernel, Params } from "../../types/types";
	import {utils} from "../../utils";

	import {callbacks} from "../../stores";

	export let width:number = 400;
	export let height:number = 240;
	export let x = 10;
	export let y = 10;
	export let xDiv = 1;
	export let yDiv = 1;
	export let xName:any = null;
	export let yName:any = null;
</script>

<g>
	{#each Array(xDiv) as a,i}
	
		<rect 
			width="1" 
			height={height}
			x={i*width/xDiv}
		/>
		{#if i > 0}
			<text 
				x={i*width/xDiv} 
				y={height-height/yDiv/4} 
				>
				{i}
			</text>
		{/if}
		
	{/each}
	{#each Array(yDiv) as a,i}
		<rect 
			height="1" 
			width={width}
			y={height-i*height/yDiv}

		/>
		{#if i > 0}
			<text 
				x={width/xDiv}
				y={height-i*height/yDiv} 
				>
				{i*y/yDiv}
			</text>
		{/if}
	{/each}
</g>

<style>


rect{
	fill: #2e2e2e;
}
text{
	fill: #4e4e4e;
	stroke: #4e4e4e;
	text-anchor: middle;
	dominant-baseline: central;
	font-size: small;
}


</style>


