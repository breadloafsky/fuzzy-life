
<script lang="ts">
	export let width:number = 400;
	export let height:number = 240;
	export let x = 10;
	export let y = 10;
	export let xDiv = 1; 
	export let yDiv = 1;
	export let xSub = 1;
	export let ySub = 1;
	export let xName:string = "";
	export let yName:string = "";

</script>

<g>
	<!-- X axis -->
	{#each Array(xDiv+1) as a,i}
		<rect 
			width="1" 
			height={height}
			x={i*width/xDiv}
		/>
		<text 
			x={i*width/xDiv} 
			y={height+10} 
			>
			{i*x/xDiv}
		</text>
	{/each}
	<!-- Y axis -->
	{#each Array(yDiv+1) as a,i}
		<rect 
			height="1" 
			width={width}
			y={height-i*height/yDiv}
		/>
		<text 
			transform="translate(20, {(height / 2)} ) rotate(-90)"
			x={i*height/yDiv - height/2} 
			y={-28}
			>
			{i*y/yDiv}
		</text>
	
	{/each}

	<text 
		x={width/2} 
		y={-10} 
		>
		{xName}
	</text>

	<text 
		transform="translate(20, {(height / 2)} ) rotate(90)"
		x={0} 
		y={12-width} 
		>
		{yName}
	</text>
</g>

<style>


rect{
	fill: #2e2e2e;
}
text{
	fill: #797979;
	stroke: #797979;
	text-anchor: middle;
	dominant-baseline: central;
	font-size: small;
}


</style>


