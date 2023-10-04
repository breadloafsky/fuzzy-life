
<script lang="ts">
	import {  fpsLimit, scene } from "../../../stores";	
    import { Settings } from "../../../types/settings";
    import Icon from "../../ui/Icon.svelte";
	import ParameterContainer from "../../ui/ParameterContainer.svelte";
    import Switch from "../../input/Switch.svelte";
	
	function resetSettings(){
		const settings = new Settings();
		$scene.textureSize = settings.textureSize;
		$scene.textureFilter = settings.textureFilter;
		$scene.blur	= settings.blur;
		$scene.frameSmoothing = settings.frameSmoothing;
		$fpsLimit=80;
		$scene.resize();
		$scene.setTextureFilter()
	}
</script>

<div>
	<ParameterContainer label="Reset Settings">
		<button 
			style="display: flex; justify-content: space-between; width: 140px;"
			title="save file"
			on:click={()=>resetSettings()}>Reset
			<div style="padding-left: 4px; width: 20px;">
				<Icon name="reset"/>
			</div>
		</button>
	</ParameterContainer>
	<ParameterContainer label="FPS Limit" vertical>
		<input 
			bind:value={$fpsLimit}
			type="range"  step="1" min="10" max="100" 
		/>
		<div>{$fpsLimit}</div>
	</ParameterContainer>
	<ParameterContainer 
		vertical 
		label="Texture Size"
		warning="Large texture and kernel size may affect performance"
	>
		<input 
			bind:value={$scene.textureSize} on:change={() => $scene.resize()}  
			type="range"  step="0.05" min="0.05" max="0.5" 
		/>
		<div>{$scene.textureSize}MP</div>
	</ParameterContainer>
	
	<ParameterContainer label="GL Linear Interpolation">
		<Switch 
			bind:value={$scene.textureFilter} 
			on:click={() => $scene.setTextureFilter()}/>
	</ParameterContainer>
	
	<ParameterContainer vertical label="Anti-Aliasing Blur">
		<input 
			bind:value={$scene.blur}  
			type="range"  step="1" min="1" max="4" 
		/>
		<div>{$scene.blur == 1 ? "off" : $scene.blur+"x"}</div>
	</ParameterContainer>
	
	<ParameterContainer label="Flickering Reduction">
		<Switch 
			bind:value={$scene.frameSmoothing}/>
	</ParameterContainer>
	
</div>


<style>



</style>