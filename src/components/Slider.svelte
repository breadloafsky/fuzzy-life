
<script >
	export let range = [0,1];
	export let val;
	export const color = 0;
	export let flipY = false;
	

	let sliderVal = actualToRelative(val);
	let component;
	let isMouseDown = false;

	$:{
		val = relativeToActual(sliderVal);
	}

	function relativeToActual(v){
		return Math.round(v * (Math.abs(range[0]-range[1]) + range[0]) * 1000)/1000;		
	}

	function actualToRelative(v){
		return (v-range[0])/(Math.abs(range[0]-range[1]));
	}

	// remove event listeners
	function cleanUp()
	{
		document.removeEventListener("mousemove", mouseMove);
		document.removeEventListener("mouseup", cleanUp);
		isMouseDown = false;
	}


	function mouseDown(e){
		isMouseDown = true;
		document.addEventListener("mousemove", mouseMove);
		document.addEventListener("mouseup", cleanUp);
		mouseMove(e);
	}

	
	function mouseMove(e) {
		sliderVal = getSliderVal(e);
	}


	function getSliderVal(e){
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
<div class="slider-container {(flipY) ? "flipped" : ""}" style="user-select: none;">

	<div style="padding:10px;"></div>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<button
		bind:this={component}
		on:mousedown={e => mouseDown(e)}
		class="slider" 
		style="--sliderVal:{sliderVal};">
		<div class="bar">
			<div data-selected={isMouseDown}><div>{val}</div></div>
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
		--color_bg:rgb(134, 134, 134); 
		display: flex;
		flex-direction: column;
	}

	.slider-container.flipped{
		flex-direction: column-reverse !important;
	}
	.slider{
		--sliderVal:0.5;
		background-color: var(--color_bg); 
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
		justify-content:end;
		background-color: var(--color);
		width: calc( ( var(--sliderVal) ) * 100% );
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