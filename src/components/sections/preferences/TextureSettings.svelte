
<script lang="ts">
	import { settings, callbacks } from "../../../stores";	
	import ParameterContainer from "../../ui/ParameterContainer.svelte";
    import Switch from "../../input/Switch.svelte";
</script>

<div>
	<ParameterContainer 
		vertical 
		label="Texture Size"
		warning="Large texture and kernel size may affect performance"
	>
		<input 
			bind:value={$settings.textureSize} on:change={() => $callbacks.resizeTexture()}  
			type="range"  step="0.05" min="0.05" max="0.5" 
		/>
		<div>{$settings.textureSize}MP</div>
	</ParameterContainer>
	
	<ParameterContainer label="GL Linear Interpolation">
		<Switch 
			bind:value={$settings.textureFilter} 
			on:click={() => $callbacks.setTextureFilter()}/>
	</ParameterContainer>
	
	<ParameterContainer vertical label="Anti-Aliasing Blur">
		<input 
			bind:value={$settings.blur}  
			type="range"  step="1" min="1" max="4" 
		/>
		<div>{$settings.blur == 1 ? "off" : $settings.blur+"x"}</div>
	</ParameterContainer>
	
	<ParameterContainer label="Flickering Reduction">
		<Switch 
			bind:value={$settings.frameSmoothing}/>
	</ParameterContainer>
</div>


<style>


</style>