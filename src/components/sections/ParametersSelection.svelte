
<script lang="ts">
    import { onMount } from "svelte";
	import { params, callbacks } from "../../stores";	
	import ParameterContainer from "../ui/ParameterContainer.svelte";
    import Icon from "../ui/Icon.svelte";
    import type { Params } from "../../types/params";

	let fileInput:HTMLInputElement|any;
	let presets:any[] = [];
	let expanded = false;

	onMount( async() => {
		presets = await( await fetch("presets.json") ).json();
		setScene(presets[0]);
	});
	
	// remove unnecessary properties
	function filterProperty(k:any,v:any){
		if(k == "name")
			return undefined;
		return v;
	}
	
	// save scene parameters to file
	function saveScene() {
    	var file = new Blob([JSON.stringify({...$params},filterProperty,"\t")], {type: "json"});
		var a = document.createElement("a"),
				url = URL.createObjectURL(file);
		a.href = url;
		a.download = "params.json";
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}

	// load scene parameters from file
	function loadScene() {
		const file = fileInput.files[0];
		if (file) {
			const reader = new FileReader();
			reader.addEventListener("load", function () {
				const result =JSON.parse(reader.result+"");
				setScene(result);
			});
			reader.readAsText(file);
			return;
		} 
		alert("File error");
	}

	// set the current scene parameters
	function setScene(params:Params|any) {
		Object.assign($params, structuredClone(params));
		$callbacks.updateKernelTextures();
		$params = $params;
	}



</script>

<ParameterContainer label="Save">
	<button
		style="display: flex; justify-content: space-between; width: 140px;"
		title="save file"
		on:click={() => saveScene()}>
		Save as JSON
		<div style="padding-left: 4px; width: 20px;">
			<Icon name="save"/>
		</div>
	
	</button>

</ParameterContainer>
<ParameterContainer label="Load">
	<label for="upload" class="upload" title="load file">
		<button
			style="display: flex; justify-content: space-between; pointer-events: none;"
			>
			Upload from file
			<div style="padding-left: 4px; width: 20px;">
				<Icon name="file"/>
			</div>
		</button>	
		<input 
			id="upload"
			hidden
			bind:this={fileInput} 
			on:change={() => loadScene()}
			type="file" 
			accept="application/JSON"/>
	</label>
</ParameterContainer>

<div style="color:grey;">OR</div>
<div  style="flex-direction: column;">
	Select from presets:
	<div class="presets" data-expanded={expanded}>
		<div class="list">
			{#each presets as p,i}
				<button on:click={()=>{setScene(p);}}>
					<div style="color:dimgray; width: 10px;">{i}</div>
					<div>{p.name}</div>
				</button>
			{/each}
		</div>
		<button on:click={() => expanded = !expanded}>{expanded ? "collapse" : "expand"}</button>
	</div>
</div>


<style>

.upload{
	width: 140px;
	cursor: pointer;
	background-color:#2b2b2b;
}
.upload:hover{
	background-color:#383838;
}
.upload > button{
	background-color: transparent;
	width: 100%;
}
.presets{
	border:1px solid var(--bg2);
	margin-top: 10px;
}
.presets > button{
	width: 100%;
}
.presets > .list{
	border:1px solid var(--bg2);
	padding: 10px;
	gap:4px;
	display: flex;
	flex-direction: column;
	max-height: 100px;
	overflow: auto;
	background-color: var(--bg0);
}

.presets[data-expanded="true"] > .list{
	max-height: none;
}

.presets > .list > button{
	display: flex;
	flex-direction: row;
	gap: 20px;
	height: 25px;
	padding: 10px;
	
}

/* .preset-list > div{
	background-color: var(--bg2);
} */

label{
	display: flex;
	justify-content: space-between;
}
</style>