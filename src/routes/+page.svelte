<script lang="ts">
	import "../app.css"
	import { onMount } from "svelte";
	import { shaders } from "../webgl/shaders";
	import Main from "../components/Main.svelte";
	
	let isLoaded = false;

	onMount( async() => {
		// preload shader files
		for (let shaderName in shaders)
		{	
			const shader = (shaders as any)[shaderName];
			shader.program = [];
			for(let i = 0; i < 2; i++){
				const e = ["vertex.vs",`${shaderName}.fs`][i];
				const response = await fetch(`shaders/${e}`);
				shader.program[i] = await  response.text();
			}
		}	
		// get settings from the local storage
		// if(localStorage)
		// {
		// 	const s = localStorage.getItem("settings");
		// 	if(s)
		// 		$settings = {...$settings, ...JSON.parse(s+"")};
		// }
		isLoaded = true;
	});

</script>
{#if isLoaded}
	<Main shaders={shaders} />
{/if}

<style>
	:global(body){
		color: aliceblue;
		background-color: black;
		font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	}

</style>