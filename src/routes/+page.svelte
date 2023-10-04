<script lang="ts">
	import "../app.css"
	import { onMount } from "svelte";
	import { shaders } from "../webgl/shaders";
	import { presets } from "../stores";
	import Main from "../components/Main.svelte";
    import Warning from "../components/misc/Warning.svelte";
    import MobileInfo from "../components/misc/MobileInfo.svelte";

	let isLoaded = false;
	let isMobile = false;

	function checkIfMobile(){
        if (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
         }
         else
            return false;
    }

	onMount( async() => {
		//	preload shader files
		isMobile = checkIfMobile();
		if(isMobile)
			return;
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
		//	preload presets
		$presets = await( await fetch("presets.json") ).json();
		isLoaded = true;
	});

	


</script>
{#if !isMobile}
	{#if isLoaded}
		<Warning>
			<Main shaders={shaders} />
		</Warning>
		{:else}
		<div class="loading">
			<div/>
		</div>
	{/if}
	{:else}
	<MobileInfo/>
{/if}


<style>
	:global(body){
		color: aliceblue;
		background-color: #000000;
		font-family: Arial, sans-serif;
	}

	.loading{
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loading > div{
		width: 20vh;
		height: 20vh;
		border: 16px solid #000000; 
		border-top: 16px solid #636363; 
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

</style>