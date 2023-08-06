
<script >
	import { onMount } from "svelte";

	export const range = [0,1];
	export let val0;
	export let val1;

	let IsMouseDown = false;
	let component;

	onMount(() => {

	});


	function mouseDown(e){
		
		IsMouseDown = true;
		document.addEventListener("mousemove", mouseMove);
		document.addEventListener("mouseup", cleanUp);
		
	}

	// remove event listeners
	function cleanUp()
	{
		document.removeEventListener("mousemove", mouseMove);
		document.removeEventListener("mouseup", cleanUp);
		IsMouseDown = false;
	}

	function mouseMove(e) {
		let pos = 0;
		if(e.type == "mousemove")
			pos = e.clientX - component.offsetLeft;
		else if(e.type == "touchmove")
			pos = e.touches[0].clientX - component.offsetLeft;
		
		
		let val = (pos)/component.clientWidth;

		if(val > 1.0)
			val = 1.0;
		else if(val < 0.0)
			val = 0;

		val = Math.round(val*1000)/1000;

		if(Math.abs(val0-val) <= Math.abs(val1-val) )
			val0 = val;
		else
			val1 = val;

		
	}




   
</script>
<div class="slider-container" style="user-select: {IsMouseDown ? "none" : "text"};">
	<div style="display: flex; justify-content: space-between;">
		<div>{val0}</div>
		<div>{val1}</div>
	</div>
	<div 
		bind:this={component}
		on:mousedown={() => mouseDown()}
		class="slider" 
		style="--val0:{val0}; --val1:{val1};">
		<div class="bar"></div>
	</div>
</div>


<style>
	.slider-container{
		display: flex;
		flex-direction: column;
	}
	.slider{
		--val0:0.5;
		--val1:0.5;
		background-color: rgb(134, 134, 134); 
		width: 100%;
		height: 20px;
		opacity: 0.8;
		display: flex;
		flex-direction: column;
	}
	.slider:hover{
		
		opacity: 1;
	}
	.slider .bar{
		background-color: aqua;
		width: calc( ( var(--val1) - var(--val0) ) * 100% );
		margin-left: calc( var(--val0) * 100% );
		height: 100%;
	}

   
</style>