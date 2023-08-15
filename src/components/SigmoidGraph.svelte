
<script lang="ts">
	import { onMount } from "svelte";    
    import type { Rule } from "../types/types";
	export let rule:Rule;

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

	
	$:[rule,width], repaint();

	
	function repaint(){
		for(let j = 0; j < 2; j++)
		{
			graphPath[j] = "M -10 100 ";
			for(let i = 0; i < width; i++){
				graphPath[j]+=`L ${i} ${ Math.round((1-s1(i/width, rule.thresholds[j*2+0], rule.thresholds[j*2+1],  rule.slopes[j*2+0], rule.slopes[j*2+1]))*1000)/1000*100} `;
			}
			graphPath[j] += `L ${width+10} 100 `;
		}
		
	}

</script>
<div class="graph-container" bind:clientWidth={width} >
	<svg viewBox="0 0 {width} 100">
		<path d={graphPath[0]} style={`--color: var(--color${0});`}/>
		<path d={graphPath[1]} style={`--color: var(--color${1});`}/>
			

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

}

svg{
	padding: 10px;
	height: 100%;
	max-width: 100%;
	
	background-color: black;

}
</style>


