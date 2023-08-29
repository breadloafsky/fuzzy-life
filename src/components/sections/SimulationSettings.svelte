
<script  lang="ts">

	import {callbacks} from "../../stores";
    import type { Params } from "../../types/types";
	export let params:Params;
	let hoveredKernel:number|any = null;
	let selectedKernel:number|any = null;
	
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="settings-container"> 
	<h2>Simulation Settings</h2>
	<div style="display: flex; justify-content: space-between;">
		simulation speed:
		<input bind:value={params.dt}  type="range"  name="dt"  step="0.01" min="0.1" max="1" />
		<div style="width: 40px;">{params.dt}</div>
	</div>
	
		
</div>
	
	

	
	
	
	
	



<style>

.settings-container{

	background-color: var(--bg1);
	padding: 10px;
	margin: 4px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}


</style>


