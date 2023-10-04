
<script lang="ts">
	import { kernRadius, kernels, presets, rules, scene } from "../../../stores";	
	import ParameterContainer from "../../ui/ParameterContainer.svelte";
    import Icon from "../../ui/Icon.svelte";
    import type { Params } from "../../../types/params";
    import { onMount } from "svelte";

	let fileInput:HTMLInputElement|any;
	let expanded = false;


	onMount(()=>{
		setScene($presets[0]);
	});

	// remove unnecessary properties
	function filterProperty(k:any,v:any){
		if(k == "name")
			return undefined;
		return v;
	}

	// save scene parameters to file
	function saveScene() {
    	var file = new Blob([JSON.stringify(
			{
				kernels:$kernels,
				rules:$rules,
				kernRadius:$kernRadius,
				dt:$scene.dt,
			}
		,filterProperty,"\t")], {type: "json"});
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
				const result = JSON.parse(reader.result+"");
				setScene(result);
			});
			reader.readAsText(file);
			return;
		} 
		alert("File error");
	}

	// set the current scene parameters
	function setScene(params:Params|any) {
		const p = structuredClone(params);
		Object.assign($kernels,p.kernels);
		Object.assign($rules,p.rules);
		$kernels = $kernels;
		$rules = $rules;
		$scene.dt = p.dt;
		$kernRadius = p.kernRadius;
		setTimeout(() => $scene.resetTexture = 2, 10);	//	pattern fill
	}

</script>
<div>
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
	<div style="line-height: 2em;">
		<ParameterContainer label="Load">
			<label for="upload" class="upload" title="load file">
				<button
					style="display: flex; justify-content: space-between; pointer-events: none;"
					>
					Load file
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
		
		<div style="color:gray; padding-top: 2px;">OR</div>
		<div  style="flex-direction: column;">
			Select from example presets:
			<div class="presets" data-expanded={expanded}>
				<div class="list">
					{#each $presets as p,i}
						<button class="btn1" on:click={()=>{setScene(p);}}>
							<div style="color:dimgray; width: 10px;">{i}</div>
							<div>{p.name}</div>
						</button>
					{/each}
				</div>
				<button on:click={() => expanded = !expanded}>{expanded ? "collapse" : "expand"}</button>
			</div>
		</div>
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
	padding-block: 8px !important;
	outline:none !important;
	color: #c0c0c0;
}
.list{
	border:1px solid var(--bg2);
	display: flex;
	flex-direction: column;
	max-height: 200px;
	overflow: auto;
	background-color: var(--bg0);
}

.presets[data-expanded="true"] > .list{
	max-height: none;
}

.list > button{
	display: flex;
	flex-direction: row;
	gap: 20px;
	min-height: 30px;
	padding: 10px;	
	align-items: center;
}

label{
	display: flex;
	justify-content: space-between;
}
</style>