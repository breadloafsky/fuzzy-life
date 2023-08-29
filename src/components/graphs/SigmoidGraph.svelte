
<script lang="ts">
	import { onMount } from "svelte";    
    import type { Params } from "../../types/types";
	export let params:Params;
	export let ruleId:number;


	let graphPath:string[] = [];
	let width:number = 400;



	function s0(x:number,a:number,alpha:number) 
	{ 
		return 1.0 / ( 1.0 + Math.exp( -(x-a)*4.0/alpha ) );
	}
	function getY(x:number,a:number,b:number,alpha0:number, alpha1:number)
	{
		return Math.round((1-(s0(x,a,alpha0) 
			* ( 1.0-s0(x,b,alpha1) )))*1000)/1000;
	}
	
	

	onMount(() => {
		repaint();
	});

	
	$:[params,width], repaint();

	
	function repaint(){
		graphPath = [];
		for(let i = 0; i < params.kernels.length; i++)
		{
			const kern = params.kernels[i];
			graphPath[i] = "M -10 100 ";
			for(let j = 0; j < width; j++){
				graphPath[i]+=`L ${j} ${ 
					getY(
						j/	width,
						kern.rules[ruleId][0], 
						kern.rules[ruleId][1], 
						kern.rules[ruleId][2], 
						kern.rules[ruleId][3], 
						)*100} `;
			}
			graphPath[i] += `L ${width+10} 100 `;
		}
		
	}

</script>
<div class="graph-container" bind:clientWidth={width} >
	<svg viewBox="0 0 {width} 100">
		{#each graphPath as g,i}
			<path d={g} style={`--color: var(--color${i});`}/>
			<path d={g} style={`--color: var(--color${i});`}/>
		{/each}
		
			

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

	height: 100%;
	max-width: 100%;
	
	background-color: black;

}
</style>


