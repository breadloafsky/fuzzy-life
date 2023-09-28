
<script lang="ts">
	export let width:number = 400;
	export let height:number = 240;
	export let x = 10;
	export let y = 10;
	export let xDiv = 1; 
	export let yDiv = 1;
	export let xName:string = "";
	export let yName:string = "";
	let xLabelSkip:number = 1;	// skip label
	
	$:[width, xDiv], (()=>{
		xLabelSkip = Math.ceil(28/(width/xDiv));
	})();
</script>

<g>
	<!-- X axis -->
	{#each Array(xDiv+1) as a,i}
		<line 
			x1={i*width/xDiv}
			x2={i*width/xDiv} 
			y1={0} 
			y2={height} 
			/>
		{#if i%xLabelSkip == 0}
		<text 
			x={i*width/xDiv} 
			y={height+10} 
			>
			{i*x/xDiv}
		</text>
		{/if}
	{/each}
	<!-- Y axis -->
	{#each Array(yDiv+1) as a,i}
		<line 
			x1={0}
			x2={width} 
			y1={height-i*height/yDiv}
			y2={height-i*height/yDiv}
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
		y={12-width}>
		{yName}
	</text>
</g>

<style>


line{
	stroke: #2e2e2e;
	stroke-width: 2;
}
text{
	fill: #aaaaaa;
	stroke: #aaaaaa;
	text-anchor: middle;
	dominant-baseline: central;
	font-size: small;
	font-family:Arial, Helvetica, sans-serif;
	letter-spacing: 1px;
}


</style>


