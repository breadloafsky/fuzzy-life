
<script lang="ts">
	import { settings, callbacks } from "../../../stores";	
	import ParameterContainer from "../../ui/ParameterContainer.svelte";
    import Switch from "../../ui/Switch.svelte";
</script>

<div>
	<ParameterContainer 
		vertical 
		label="Texture Size"
		warning="Large texture size can affect the performance"
	>
		<input 
			bind:value={$settings.textureSize} on:change={() => $callbacks.resizeTexture()}  
			type="range"  step="0.1" min="0.1" max="1" 
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
			bind:value={$settings.aa}  
			type="range"  step="1" min="1" max="4" 
		/>
		<div>{$settings.aa == 1 ? "off" : $settings.aa+"x"}</div>
	</ParameterContainer>
	
	<ParameterContainer label="Flickering Reduction">
		<Switch 
			bind:value={$settings.frameSmoothing}/>
	</ParameterContainer>
	
	<ParameterContainer label="Colour Gradient">
		<select bind:value={$settings.gradient}>
			<option value={0}>RGB</option>
			<option value={1}>B&W</option>
		</select>	  
	</ParameterContainer>
</div>


<style>


</style>