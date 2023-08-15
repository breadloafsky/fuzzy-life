
<script lang="ts">
	import { onMount } from "svelte";    
	export let inn0: number;
	export let inn1: number;
	export let out0: number;
	export let out1: number;
	export let slope_inn0: number;// slope of sigmoid
	export let slope_inn1: number;
	export let slope_out0: number;
	export let slope_out1: number;

	function s0(x:number,a:number,alpha:number) 
	{ 
		return 1.0 / ( 1.0 + Math.exp( -(x-a)*4.0/alpha ) );
	}
	function s1(x:number,a:number,b:number,alpha0:number, alpha1:number)
	{
		return s0(x,a,alpha0) 
			* ( 1.0-s0(x,b,alpha1) );
	}
	

	
	let graphPath:string[] = [];
	let width:number = 400;

	
	
	
	onMount(() => {
		repaint();
	});


	$:[inn0, inn1, slope_inn0, slope_inn1], repaint(0);
	$:[out0, out1, slope_out0, slope_out1], repaint(1);


	
	function repaint(n:number=0){
		let vals = [
			[inn0, inn1, slope_inn0, slope_inn1],
			[out0, out1, slope_out0, slope_out1]
		];
		graphPath[n] = "M -10 100 ";
		for(let i = 0; i < width; i++){
			graphPath[n]+=`L ${i} ${ Math.round((1-s1(i/width, vals[n][0], vals[n][1], vals[n][2], vals[n][3]))*1000)/1000*100} `;
		}
		graphPath[n] += `L ${width+10} 100 `;
	}

</script>
<div class="graph-container" >
	
	<svg viewBox="0 0 {width} 100">
			<circle cx="{width*inn0}" cy="50" r="4" style="fill:wheat" />
			<circle cx="{width*inn1}" cy="50" r="4" style="fill:wheat" />
			<path d={graphPath[0]} style={`--color: var(--color0);`}/>
			<!-- <circle cx="{width*out0}" cy="50" r="4" style="fill:wheat" />
			<circle cx="{width*out1}" cy="50" r="4" style="fill:wheat" /> -->
			<path d={graphPath[1]} style={`--color: var(--color1);`}/>

	  </svg>
</div>

<style>

path{

	stroke-width: 2px;
	mix-blend-mode:normal;
	stroke: var(--color);
	fill: var(--color);
	fill-opacity: 0.2;
}
.graph-container{

	background-color: black;
}

svg{
	padding: 10px;
	height: 100%;
	width: 400px;
	max-width: 100%;

}
</style>


