
<script lang="ts">
	import { onMount } from "svelte";    
    import type { Kernel, Params, Rule } from "../../types/types";
	import {utils} from "../../utils";
	export let kernels:Kernel[];
	export let selectedKernel:number|any;
	export let hoveredKernel:number|any;
	export let formatKernel:any;
	let svg:SVGSVGElement|HTMLElement;
	let width:number = 400;
	let height:number = 240;
	let graphPath:string[] = [];

	let selectedPoint:any = null;

	


	onMount(() => {
		repaint();
	});

	
	$:[kernels,width], repaint();
	
	

	function cleanUp()
	{
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", cleanUp);
		selectedPoint = null;
		formatKernel(selectedKernel);	// update the kernel texture
	}

	function getMousePos(e:MouseEvent){
		let pos = [0,0];

		let rect = svg.getBoundingClientRect();
		pos[0] = (e.pageX - rect.left)/svg.clientWidth;
		pos[1] = (e.pageY - rect.top)/svg.clientHeight;

		pos.forEach((v,i) => {
			if(v > 1.0)
				v = 1.0;
			else if(v < 0.0)
				v = 0;
			pos[i] = Math.round(v*1000)/1000;
		});
		return  pos;
	}

	function handleMouseDown(e:MouseEvent){
		if(selectedKernel != null)
		{
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", cleanUp);
			let pos = getMousePos(e);
			if(selectedPoint == null && kernels[selectedKernel].points.length < 16)
			{
				selectedPoint = {x:pos[0],y:pos[1]};
				kernels[selectedKernel].points.push(selectedPoint);
			}
			kernels = kernels;
			handleMouseMove(e);
		}
	}

	function handleMouseMove(e:MouseEvent){
		if(selectedKernel != null && selectedPoint != null)
		{
			let pos = getMousePos(e);
			let pid = kernels[selectedKernel].points.findIndex(p => p == selectedPoint);
			selectedPoint=({x:pos[0],y:pos[1]});
			kernels[selectedKernel].points[pid] = selectedPoint;
			// sort the points
			kernels[selectedKernel].points.sort((a, b) => {
				return a.x - b.x;
			});
		}
	
	}


	

	function repaint(){
		for(let j = 0; j < kernels.length; j++)
		{
			const points = kernels[j].points;
			graphPath[j] = `M ${-100} ${height} `;
			for(let i = 0; i < width; i++){
				graphPath[j]+=`L ${i} ${ (1-utils.getKernelValue(kernels[j],i/width))*height} `;
			}
			graphPath[j] += `L ${width+100} ${height} `;
		}
	}

</script>


<div class="graph-container" bind:clientWidth={width} >
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<svg bind:this={svg} viewBox="0 0 {width} {height}" on:mousedown={handleMouseDown}>
		{#each kernels as k,i}
			<path 
			d={graphPath[i]} 
			style={`--color: var(--color${i});`} 
			stroke-opacity={(selectedKernel == i || hoveredKernel == i) ? 1 : (selectedKernel && hoveredKernel)== null ? 0.5 : 0.2}/>
		{/each}
		
		{#if selectedKernel != null}
			{#each kernels[selectedKernel].points as p,i}
				<circle 
					cx={width*p.x} 
					cy={height*p.y} 
					r="5" 	
					style={`--color: var(--color${selectedKernel});`} 
					on:mousedown={()=>{selectedPoint = p;}}
				/>
			{/each}
		{/if}
	  </svg>
</div>

<style>

circle{
	cursor: pointer;
	stroke-width: 2px;
	mix-blend-mode:normal;
	stroke: var(--color);
	fill: var(--color);
	stroke-opacity: 0.5;
	fill-opacity: 0.2;
}

path{
	stroke-width: 2px;
	mix-blend-mode:normal;
	stroke: var(--color);
	fill: var(--color);
	fill-opacity: 0.1;
}
svg{

	height: 100%;
	max-width: 100%;
	background-color: black;

}
</style>


