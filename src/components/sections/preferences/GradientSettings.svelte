
<script lang="ts">
    import { onMount } from "svelte";
	import { gradient } from "../../../stores";	
	import type { GradientPoint } from "../../../types/ui";
	import ParameterContainer from "../../ui/ParameterContainer.svelte";
    import GradientPicker from "../../input/GradientPicker.svelte";
    import Dropdown from "../../ui/Dropdown.svelte";
    
  
	let presets:GradientPoint[][] = [];

	
	onMount( async ()=>{
		presets = await( await fetch("gradients.json") ).json();
	});

</script>

<div>
	
	<div style="display: flex; justify-content: space-between;">
		Presets
		<Dropdown title="select">
			{#each presets as p,i}
				<button
					class="option"
					style="background-image: 
						linear-gradient(90deg ,{p.map((v)=>
							" "+v.color+" "+v.pos*100+"%").join()
					});"
					on:click={()=>{$gradient = structuredClone(p)}}
					>
				</button>
			{/each}
		</Dropdown>	  
	</div>

	<div>
		<div>Gradient Editor</div>
		<GradientPicker bind:gradient={$gradient}/>
		<p>LMB - move / add colour, RMB - delete colour</p>
	</div>
	
	
</div>


<style>

	.option{
		height: 20px;
		filter: brightness(0.8);
	}
	.option:hover{
		filter: brightness(1.0);
	}

</style>