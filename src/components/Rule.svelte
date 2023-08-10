
<script >
	import { onMount } from "svelte";    
    import SliderDouble from "./SliderDouble.svelte";
	export let label;
	export let inn0;
	export let inn1;
	export let out0;
	export let out1;

	onMount(() => {
		
	});
</script>
<div class="rule">
	<div class="title">{label}</div>
	<div>
		<SliderDouble bind:val0={inn0} bind:val1={inn1} />
		<SliderDouble bind:val0={out0} bind:val1={out1} flipY={true}/>
	</div>
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
</style>