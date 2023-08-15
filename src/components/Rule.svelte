
<script  lang="ts">
    
    import SliderDouble from "./SliderDouble.svelte";

	export let label:string|any;
	export let inn0:number;	// value of sigmoid
	export let inn1:number;
	export let out0:number;
	export let out1:number;
	export let sig_inn0:number;// slope of sigmoid
	export let sig_inn1:number;
	export let sig_out0:number;	
	export let sig_out1:number;	

</script>
<div class="rule">
	<div style="display: grid;
	grid-template-columns: repeat(2, 1fr);">
		<div class="title">{label}</div>
		<div style="display: flex;">
			Slope:
			<div style="display:flex; flex-direction: column; font-size: 16px; font-family: monospace;padding-inline: 10px;">
				<div style="display: flex; gap:4px;">
					<div style="color:var(--color0);">INN</div>
					<input bind:value={sig_inn0} type="number" step="0.1" min="0.001" max="1" />
					<input bind:value={sig_inn1} type="number" step="0.1" min="0.001" max="1" />
				</div>
				<div style="display: flex; gap:4px;">
					<div style="color:var(--color1);">OUT</div>
					<input bind:value={sig_out0} type="number" step="0.1" min="0.001" max="1" />
					<input bind:value={sig_out1} type="number" step="0.1" min="0.001" max="1" />
				</div>
			</div>
		</div>
		
	</div>
	<div>
		<SliderDouble bind:val0={inn0} bind:val1={inn1} color={"var(--color0)"}/>
		<SliderDouble bind:val0={out0} bind:val1={out1} flipY={true} color={"var(--color1)"}/>
	</div>
</div>

<style>

	input[type=number]{
		width: 60px;
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


	.rule  .title{
		padding-bottom:10px;
		font-weight:bolder;
		font-size: large;
		opacity: 0.8;
	}   
</style>


