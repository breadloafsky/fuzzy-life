
<script lang="ts">
    import { onMount } from "svelte";
	import { settings, callbacks, scene } from "../../stores";	
    import GradientCanvas from "../misc/GradientCanvas.svelte";
    import { GradientPoint } from "../../types/ui";
    import Icon from "../ui/Icon.svelte";

	export let gradient:GradientPoint[]=[];

	let cvs:GradientCanvas;
	let active:number|null = null;
	let selected:GradientPoint|any;
	let container:HTMLDivElement;
	let width = 0;
	let gradientCSS = "";
	let timer:any = 0;
	

	// sort gradient and create gradient CSS string
	$:gradient,(()=>{
		gradient.sort((a, b) => {
			return a.pos - b.pos;
		});
		gradientCSS = "";
		gradient.forEach(v=>{
			gradientCSS+=", "+v.color+" "+v.pos*100+"%"
		});
		// update gradient texture
		if(cvs){
			clearTimeout(timer);
			timer = setTimeout(() => {
				const texture = cvs.renderGradient(gradient);
				$scene.setGradient(texture);
			}, 10)
		}
	})();
	
	function getMousePos(e:MouseEvent){
		let pos = (e.pageX - container.offsetLeft)/width;
		pos = Math.min(1,Math.max(0,pos));
		pos = Math.round(pos*1000)/1000;
		return  pos;
	}
	
	function handleMouseDown(e:MouseEvent){
		
			//add/move slider
			if(e.button == 0){
				document.addEventListener("mousemove", handleMouseMove);
				const cleanUp = ()=>{
					document.removeEventListener("mousemove", handleMouseMove);
					document.removeEventListener("mouseup", cleanUp);
					selected = null;
				}
				document.addEventListener("mouseup", cleanUp);
				let pos = getMousePos(e);
				// add slider
				if(selected == null)
				{
					selected = {...new GradientPoint(), pos:pos};
					gradient.push(selected);
				}
		
				handleMouseMove(e);
			}
			// delete point
			else if(e.button == 2 && selected != null && gradient.length > 1)
			{
				gradient.splice(gradient.findIndex((p:GradientPoint) => p == selected), 1);
				gradient = gradient;
				selected = null;
			}
				
		
	}
	function handleMouseMove(e:MouseEvent){
		if(selected)
		{
			let pos = getMousePos(e);
			//	replace the point coordinates
			let pid = gradient.findIndex(p => p == selected);
			selected.pos = pos;
			gradient[pid] = selected;
		}
	}
    
</script>

<GradientCanvas  bind:this={cvs}/>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="picker-container"
	on:mouseleave={()=> selected ? ()=>{} : active = null}
>
	<div
		bind:this={container} 
		bind:clientWidth={width} 
		on:mousedown={handleMouseDown} 
		on:contextmenu|preventDefault={()=>{return false;}}
		>
		<div 
			class="gradient"
			style="background-image: linear-gradient(90deg{gradientCSS});"
		/>
		{#if container}
			{#each gradient as v, i}
				<button
				data-active={active == i}
				class="slider" 
				style="
					left: {-5+v.pos*width}px;
					--color:{v.color};
					"
				on:mouseenter={()=>active = i}
				on:mousedown={()=> selected = v}
				>
					<div>
						{Math.round(v.pos*100)}
					</div>
					<div>
						<Icon name="palette" absolute/>
						<input type="color" bind:value={v.color}>
					</div>
				</button>
				
			{/each}
		{/if}
		
	</div>
</div>

<style>
.picker-container{
	display: flex;
	/* justify-content: center; */
	height: 100px;
	flex-direction: column;
	margin-inline: 40px;
	margin-top: 40px;
}
.picker-container > div:first-child{
	position: relative;
	height: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor:cell;
}

.picker-container > :nth-child(2){
	padding-top: 40px;
}
.gradient{
	background-color: aquamarine;
	height: 100%;
	width: 100%;
}
.slider{
	position: absolute;
	background-color: var(--color);
	width: 10px;
	height: 110%;
	border-radius: 4px;
	border:1px solid #bebebe;
	justify-items: center;
	z-index: 2;
	cursor:ew-resize;
}

.slider[data-active="true"]{
	z-index: 3;
}

input[type="color"]{
	padding: 0;
	margin: 0;
	width: 21px;
	height: 21px;
	border: none;
	opacity: 0;
	cursor: pointer;
}

.slider > div:first-child{
	position: absolute;
	top: -24px;
	left: -5px;
	width: 10px;
	padding: 1px;
	text-align: center;
	min-width: 16px;
	background-color: transparent;
	border-radius: 4px;
	overflow: hidden;
	visibility: hidden;
}
.slider > div:nth-child(2){
	background-color: transparent;
	position: absolute;
	bottom: -24px;
	left: -6px;
	padding: 0px;
	width: 21px;
	height: 21px;
	visibility: hidden;
		

}

.slider[data-active="true"] > div:nth-child(2){
	visibility: visible;

}


.slider[data-active="true"] > div:first-child{
	visibility: visible;
}


</style>