
<script >
	import Slider from "./Slider.svelte";
	import { onMount } from "svelte";
	export let controls;

	onMount(() => {
		
	});
</script>
<div class="params-container" >

	<!-- <div class="diagram">
		<div class="d_outer">
			<div class="d_control">
				<div class="d_inner">
				</div>
			</div>
		</div>
		<div style="display: flex; flex-direction: column;">
			<div>Radius</div>
		</div>
	</div> -->
	<div>
		<h2>
			Rules:
		</h2>
		<div class="rule">
			<div class="title">A</div>
			<div>
				<Slider bind:val0={controls.params[0]} bind:val1={controls.params[1]}/>
				<Slider bind:val0={controls.params[2]} bind:val1={controls.params[3]}/>
			</div>
		</div>
		<div class="rule">
			<div class="title">B</div>
			<div>
				<Slider bind:val0={controls.params[4]} bind:val1={controls.params[5]}/>
				<Slider bind:val0={controls.params[6]} bind:val1={controls.params[7]}/>
			</div>
		</div>
	</div>

</div>

<style>
	:global(.slider-container:nth-child(even) .bar){
		background-color: rgb(179, 255, 0) !important;
	}
	:global(.slider-container:nth-child(even)){
		flex-direction: column-reverse !important;
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
	
	.diagram {
		display: flex;
	}

	.d_outer{
		width: 40%;
		height: 100%;
		border-radius: 50%;
		background-color: aqua;
	} 

	

   
</style>