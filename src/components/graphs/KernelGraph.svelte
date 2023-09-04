
<script lang="ts">
	import { onMount } from "svelte";    
    import type { Kernel, Params } from "../../types/types";
	import {utils} from "../../utils";

	import {callbacks} from "../../stores";
    import Coordinates from "./Coordinates.svelte";
	$callbacks.updateKernelGraphs = repaint;

	export let params:Params;
	export let selectedKernel:number|any;
	export let edit:boolean;
	export let updateKernels:any;
	let svg:SVGSVGElement|HTMLElement;
	let width:number = 400;
	let height:number = 240;
	let graphPath:string[] = [];

	let selectedPoint:any = null;

	
	let kernels:Kernel[] = [];

	onMount(() => {
		repaint();
		kernels = params.kernels;
	});

	
	$:[params,width], repaint();
	
	

	function cleanUp()
	{
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", cleanUp);
		selectedPoint = null;
		updateKernels();	// update the kernel texture
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
			if(e.button == 0){
				document.addEventListener("mousemove", handleMouseMove);
				document.addEventListener("mouseup", cleanUp);
				let pos = getMousePos(e);
				// add point
				if(selectedPoint == null && kernels[selectedKernel].points.length < 16)
				{
					selectedPoint = [pos[0],1-pos[1]];
					kernels[selectedKernel].points.push(selectedPoint);
				}
				kernels = kernels;
				handleMouseMove(e);
			}
			// delete point
			else if(e.button == 2 && selectedPoint != null && kernels[selectedKernel].points.length > 1)
			{
				kernels[selectedKernel].points.splice(kernels[selectedKernel].points.findIndex(p => p == selectedPoint), 1);
				kernels = kernels;
				repaint();
				updateKernels();
				selectedPoint = null;
			}
				
		}
	}

	function handleMouseMove(e:MouseEvent){
		if(selectedKernel != null && selectedPoint != null)
		{
			let pos = getMousePos(e);
			//	replace the point coordinates
			let pid = kernels[selectedKernel].points.findIndex(p => p == selectedPoint);
			selectedPoint=[pos[0],1-pos[1]];
			kernels[selectedKernel].points[pid] = selectedPoint;
			// sort the points
			kernels[selectedKernel].points.sort((a, b) => {
				return a[0] - b[0];
			});
		}
		//formatKernel(selectedKernel);
	}



	function repaint(){
		for(let j = 0; j < kernels.length; j++)
		{
			graphPath[j] = `M ${-100} ${height} `;
			for(let i = 0; i < width; i++){
				graphPath[j]+=`L ${i} ${ (1-utils.getKernelValue(kernels[j],i/width))*height} `;
			}
			graphPath[j] += `L ${width+100} ${height} `;
		}
	}

</script>


<div class="graph-container" bind:clientWidth={width}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<svg bind:this={svg} viewBox="0 0 {width} {height}" on:mousedown={handleMouseDown} on:contextmenu|preventDefault={()=>{return false;}}>

		<Coordinates
		width={width}
		height={height}
		x={params.convRadius}
		y={1}
		xDiv={params.convRadius}
		yDiv={4}
		/>
		


		{#each kernels as k,i}
		{#if k.enabled}
		<path 
			d={graphPath[i]} 
			style={`--color: var(--color${i});`} 
			stroke-opacity={(selectedKernel == i) ? 1 : (selectedKernel== null) ? 0.5 : 0.2}/>
		{/if}
			
		{/each}
		
		{#if selectedKernel != null}
			{#each kernels[selectedKernel].points as p,i}
				<circle 
					cx={width*p[0]} 
					cy={height*(1-p[1])} 
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


