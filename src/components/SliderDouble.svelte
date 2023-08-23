
<script lang="ts">
	export const range = [0,1];
	export let val0:number;
	export let val1:number;

	export let color:string = "blue";
	export let flipY:boolean = false;
	export let onChange:any;

	let component:HTMLButtonElement;
	let selectedValue:any = null;
	let vals = [val0, val1];
	

	$:{
		if(val0 > val1){
			vals = [val1, val0]
			selectedValue = 1-selectedValue;
		}
	}


	// remove event listeners
	function cleanUp()
	{
		document.removeEventListener("mousemove", mouseMove);
		document.removeEventListener("mouseup", cleanUp);
		selectedValue = null;
	}


	function mouseDown(e:MouseEvent){
		document.addEventListener("mousemove", mouseMove);
		document.addEventListener("mouseup", cleanUp);
		let val = getSliderVal(e);
		if(Math.abs(val0-val) <= Math.abs(val1-val) )
			selectedValue = 0;
		else
			selectedValue = 1;

		mouseMove(e);
	}

	
	function mouseMove(e:MouseEvent) {
		let val = getSliderVal(e);
		vals = [val0, val1];
		vals[selectedValue] = val;
		[val0, val1] = vals;
		onChange();
	}


	function getSliderVal(e:MouseEvent){
		let pos = 0;
		pos = e.clientX - component.offsetLeft;
		let val = (pos)/component.clientWidth;
		if(val > 1.0)
			val = 1.0;
		else if(val < 0.0)
			val = 0;
		return  Math.round(val*1000)/1000;
	}




   
</script>
<div class="slider-container {(flipY) ? "flipped" : ""}" style="user-select: none; ">

	<div style="padding:10px;"></div>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<button
		bind:this={component}
		on:mousedown={e => mouseDown(e)}
		class="slider" 
		style="--val0:{val0}; --val1:{val1};">
		<div class="bar" style="--color:{color};">
			<div data-selected={selectedValue == 0}><div>{val0}</div></div>
			<div data-selected={selectedValue == 1}><div>{val1}</div></div>
		</div>
	</button>
</div>


<style>

	button{
		border:0;
		padding: 0;
		margin: 0;
	}

	.slider-container{
		--color:aqua;
		display: flex;
		flex-direction: column;
		padding: 1px;
	}

	.slider-container.flipped{
		flex-direction: column-reverse !important;
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
	.slider:hover, .slider:active{
		opacity: 1;
	}
	.bar{
		display: flex;
		justify-content: space-between;
		background-color: var(--color);
		width: calc( ( var(--val1) - var(--val0) ) * 100% );
		margin-left: calc( var(--val0) * 100% );
		height: 100%;
	}
	
	
	
	.bar > div{
		position: relative;
		background-color: antiquewhite;
		color: antiquewhite;
		width: 1px;
		transform: scaleY(1.2);
		opacity: 0.2;
		transition-property: opacity;
		transition-duration: 0.1s;
	}

	.slider:hover .bar > div{
		opacity: 0.5;

	}

	.flipped .bar > div{
		transform: flip translateY(4px);
	}

	.bar > div > div{
		position: absolute;
		top: -20px;
	}
	.flipped .bar > div > div{
		position: absolute;
		top: 20px;
	}
	.bar > div:first-child > div{
		right: 0;
	}

	
	.slider:active .bar > div[data-selected="true"]{
		opacity: 1;
	}

   
</style>