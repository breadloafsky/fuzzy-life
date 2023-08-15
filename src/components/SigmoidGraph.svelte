
<script lang="ts">
	import { onMount } from "svelte";    
	export let val0: number;
	export let val1: number;
	export let sig_val0: number;// slope of sigmoid
	export let sig_val1: number;
	export let color: string;
	
	let graphPath:string = "";
	let width:number = 0;


	$:if(width){
		graphPath += "M 0 0 "
		for(let i = 0; i < width; i++){
			graphPath+=`L ${i} ${20} `;
		}
	}

	
	onMount(() => {
		
		

	});
</script>
<div class="graph-container"  bind:clientWidth={width}>
	<svg viewBox="0 0 {width} 40" >
	
			<rect x="0" y="0" width={width} height="100" style="fill:grey" />
			<circle cx="{width*val0}" cy="20" r="8" style="fill:wheat" />
			<circle cx="{width*val1}" cy="20" r="8" style="fill:wheat" />
			<path d={graphPath} stroke={`var(--color0)`}/>

	  </svg>
</div>

<style>

path{
	fill: none;
	stroke-width: 1px;
}
.graph-container{
	height: 40px;
	overflow: auto;
}

svg{
	height: 40px;
	width: 100%;
	max-width: 100%;
}
</style>


