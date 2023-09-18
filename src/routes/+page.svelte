<script lang="ts">
	import "../app.css"

    import { browser } from "$app/environment";
	import Main from "../components/Main.svelte";
 
	const shaders:any ={
		screen:{
			program: {},
			attributes: {
				aTextureCoord: {value:null},
				aVertexPosition: {value:null},
			},
			uniforms: {
				uSampler: {value:null},
				uTextureDims:{value:null},
				uGradient:{value:null},
			},
		},
		
		frame:{
			program: {},
			attributes: {
				aTextureCoord: {value:null},
				aVertexPosition: {value:null},
				
			},
			uniforms: {
				uSampler: {value:null},	
				uTextureDims:{value:null},
				uKernelRadius:{value:null},
				uKern:{value:null},	// kernel texture
				uRules:{value:null},
				uDelta: {value:null},	// dt of integration
				uReset: {value:null},	// reset the texture
				uDebug:{value:null},	// DEBUG
				isPaused:{value:null},
				brush:{value:null},	// paint brush
			},
		},
	};




	// preload the shaders
	async function loadShaderFiles(){
		let promises = [];
		for (let shaderName in shaders)
		{	
			const promise = new Promise<void>((resolve, reject) => {
				const shaderFiles = ["vs","fs"].map(async (e) => {
					const response = await fetch(`shaders/${shaderName}.${e}`);
					return response.text();
				});
				Promise.all(shaderFiles).then(data => {
						const shader = shaders[shaderName];
						shader.program = data;
						resolve();
				});
			});
			promises.push(promise);	
		}	
		return promises;
	}

	async function preload() {
		if(browser)
		return new Promise<void>(async function(resolve) {
			Promise.all(await loadShaderFiles()).then(()=>{
				resolve();
			});
		})
	}

</script>
{#await preload() then _}
	<Main shaders={shaders} />
{/await}

<style>
	:global(body){
		color: aliceblue;
		background-color: black;
	}

</style>