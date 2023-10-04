
<script lang="ts">
	import { callbacks, settings } from "../../../stores";	
    import { Settings } from "../../../types/settings";
    import Icon from "../../ui/Icon.svelte";
	import ParameterContainer from "../../ui/ParameterContainer.svelte";
	
	function resetSettings(){
		Object.assign($settings, new Settings()); 
		$settings = $settings;
		$callbacks.resizeTexture();
		$callbacks.setTextureFilter()
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
			bind:value={$settings.fpsLimit}
			type="range"  step="1" min="10" max="100" 
		/>
		<div>{$settings.fpsLimit}</div>
	</ParameterContainer>
	
</div>


<style>



</style>