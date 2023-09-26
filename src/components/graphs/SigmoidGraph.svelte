
<script lang="ts">
	import { params } from "../../stores";
    import Coordinates from "./Coordinates.svelte";
	export let ruleId:number;
	export let highlightedKernel:any;
	let graphPath:string[] = [];
	let containerWidth:any;
	let width:number = 400;
	let height:number = 140;
	let repaintTimer:any = 0;
	


	// sigmoid function
	function s0(x:number,a:number,alpha:number) 
	{ 
		return 1.0 / ( 1.0 + Math.exp( -(x-a)*4.0/alpha ) );
	}
	function getY(x:number,a:number,b:number,alpha0:number, alpha1:number)
	{
		return Math.round((
				1-(s0(x,a,alpha0) * ( 1.0-s0(x,b,alpha1) ))
			)*1000)/1000;
	}
	
	
	$:$params, repaint();
	$:containerWidth, (()=>{
		clearTimeout(repaintTimer);
		repaintTimer = setTimeout(() => {width = containerWidth;repaint();}, 100)
	})();

	
	function repaint(){
		graphPath = [];
		for(let i = 0; i < $params.kernels.length; i++)
		{
			if($params.kernels[i].enabled){
				graphPath[i] = `M -10 ${height} `;
				for(let j = 0; j < width; j++){
					graphPath[i]+=`L ${j} ${ 
						getY(	
							j/width,
								$params.rules[ruleId].subRules[i].thersholds[0], 
								$params.rules[ruleId].subRules[i].thersholds[1],
								$params.rules[ruleId].subRules[i].slopes[0],
								$params.rules[ruleId].subRules[i].slopes[1], 
							)
						*height} `;
				}
				graphPath[i] += `L ${width+10} ${height} `;
			}
			else
				graphPath[i] = "";
		}
	}

</script>
<div class="graph-container" bind:clientWidth={containerWidth} style="height: {height}px;" >
	<svg viewBox="0 0 {width} {height}">
		<Coordinates
			width={width}
			height={height}
			x={1}
			y={1}
			xDiv={10}
			yDiv={2}
			xName="input"
			yName="output"
		/>

		<svg class="main" viewBox="0 0 {width} {height}" >
			{#each graphPath as g,i}
			{#if $params.rules[ruleId].subRules[i].enabled}
			<path 
				d={g} 
				style={`--color: var(--color${i});`} 
				stroke-opacity={(highlightedKernel == i) ? 1 :  0.5 }
			/>
			{/if}
				
			{/each}
		</svg>
	  </svg>
</div>

<style>

.graph-container{
	padding-block: 10px;
	padding-top: 20px;
	padding-inline: 10px;
}

path{
	stroke-width: 2px;
	mix-blend-mode:normal;
	stroke: var(--color);
	fill: var(--color);
	fill-opacity: 0.1;
}


svg{
	height: 98%;
	max-width: 100%;
	background-color: black;
	overflow:visible;
}

svg.main{
	overflow:hidden;
}
</style>


