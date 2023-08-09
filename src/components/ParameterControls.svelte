
<script >
	import Slider from "./Slider.svelte";
	import SliderDouble from "./SliderDouble.svelte";
	import CircleParams from "./CircleParams.svelte";
	import { onMount } from "svelte";
    
	export let controls;
	

	onMount(() => {
		
	});
</script>
<div class="params-container" >
	<div>
		<h2>Rules</h2>
		<div class="rule">
			<div class="title">A</div>
			<div>
				<SliderDouble bind:val0={controls.params[0]} bind:val1={controls.params[1]} />
				<SliderDouble bind:val0={controls.params[2]} bind:val1={controls.params[3]} flipY={true}/>
			</div>
		</div>
		<div class="rule">
			<div class="title">B</div>
			<div>
				<SliderDouble bind:val0={controls.params[4]} bind:val1={controls.params[5]}/>
				<SliderDouble bind:val0={controls.params[6]} bind:val1={controls.params[7]} flipY={true}/>
			</div>
		</div>
	</div>

	<!-- <div class="section">
		<h2>Area Radius</h2>
		<div >
			<div id="radiusSlider">
				Overall Radius
				<Slider bind:val={controls.radius} range={[0,12]} flipY={true}/> 
			</div>
			<div id="ratioSlider" style="padding-top: 10px;">
				Inner/Outer R Ratio 
				<Slider bind:val={controls.radiusRatio} range={[0,1]} flipY={true}/>		
			</div>
			<CircleParams bind:rr={controls.radiusRatio}/>
		</div>
	</div> -->
</div>

<style>


	:global(.rule .slider-container:nth-child(odd) .bar){
		--color:var(--color0);
	}
	:global(.rule .slider-container:nth-child(even) .bar){
		--color:var(--color1);
	}

	:global(#radiusSlider .slider-container){
		--color:white;
	}

	:global(#ratioSlider .slider-container){
		--color:var(--color0);
		--color_bg:var(--color1);
	}
	
	.rule{
		background-color: rgb(43, 43, 43);
		padding: 10px;
		margin: 4px;
	}

	.rule > .title{
		padding-bottom:10px;
		font-weight:bolder;
		font-size: large;
		opacity: 0.8;
	}
	.params-container{
	
	}
	
	

	
	

   
</style>