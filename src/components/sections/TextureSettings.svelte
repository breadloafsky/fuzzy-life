
<script lang="ts">
	import { automaton, callbacks } from "../../stores";	
	import ParameterContainer from "../ui/ParameterContainer.svelte";
</script>


<ParameterContainer label="Texture Size">
	<input 
		bind:value={$automaton.settings.textureSize} on:change={() => $callbacks.resizeTexture()}  
		type="range"  name="textureSize"  step="0.1" min="0.1" max="1" 
	/>
	<div style="width: 60px; text-align: center;">{$automaton.settings.textureSize}MP</div>
</ParameterContainer>
<ParameterContainer label="Texture Filtering">
	<select name="filter select" bind:value={$automaton.settings.textureFilter} on:change={() => $callbacks.setTextureFilter()}>
		<option value={0}>Linear</option>
		<option value={1}>Nearest</option>
	</select>	  
</ParameterContainer>
<ParameterContainer label="Colour Gradient">
	<select name="gradient select" bind:value={$automaton.settings.gradient}>
		<option value={0}>RGB</option>
		<option value={1}>B&W</option>
	</select>	  
</ParameterContainer>

<style>




</style>