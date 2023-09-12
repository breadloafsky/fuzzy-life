
<script lang="ts">
    import { onMount } from "svelte";
	import { automaton, callbacks } from "../../stores";	
    import type { Params } from "../../types/types";
	let fileInput:HTMLInputElement|any;
	
	let presets:any[] = [];

	let expanded = false;


	onMount( async() => {
		presets = await( await fetch("presets.json") ).json();
	});
	

	function filterProperty(k:any,v:any){
		if(k == "name")
			return undefined;
		return v;
	}

	function saveScene() {
    	var file = new Blob([JSON.stringify({...$automaton.params},filterProperty,"\t")], {type: "json"});
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


	function setScene(params:Params|any) {
		Object.assign($automaton, { ...$automaton, params:structuredClone(params) });
		$callbacks.updateKernelTextures();
	}



</script>


<label title="save file">
	Save 
	<button 
		title="save file"
		on:click={() => saveScene()}>save as json file
	</button>
</label>

<label title="load file">
	Load from file
	<label title="load file" class="button">
		load from file
		<input 
		hidden
			bind:this={fileInput} 
			on:change={() => loadScene()}
			type="file" 
			accept="application/JSON"/>
	</label>
</label>

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

.presets{
	border:1px solid var(--bg2);
	margin-top: 10px;
	
	/* max-height: 100px;
	overflow: auto; */
}
.presets > button{
	width: 100%;
}
.presets > .list{
	border:1px solid var(--bg2);
	padding: 10px;
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