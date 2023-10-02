
<script lang="ts">
 	import { onMount } from "svelte";
	import { utils } from "../../utils";
    import type { Kernel } from "../../types/params";
    let canvas : HTMLCanvasElement;
	let ctx : CanvasRenderingContext2D|any;

	// kernel image size. dimensions: (size)x(size)
	const size = 64;

	onMount( async() => {
		ctx = canvas.getContext("2d");
  	});

	// render kernels previews
	export function renderPreview(kernels:Kernel[], radius:number){
		if(ctx != null){

			let result = [];
			// draw each kernel
			for(let k = 0; k < kernels.length; k++){
				// clear canvas
				ctx.clearRect(0, 0, size, size);
				for(let i = 0; i < size; i++){
					for(let j = 0; j < size; j++)
					{

						let dist = Math.sqrt(((radius-i))**2+((radius-j))**2);
						if(dist < radius)
						{
							let c = utils.getKernelValue(kernels[k],(dist)/radius);
							ctx.fillStyle = `rgba(${255},${180},${180},${c})`;
							ctx.fillRect(i-1, j-1, 1, 1)
						}
					}
				}

				result.push(
					canvas.toDataURL("image/png")
				);
			}
			return result; 
		}
		console.log("kernel rendering error");
	}

	// render kernel texture (each kernel assigned to RGB channel)
	export function renderTexture(kernels:Kernel[], radius:number){
		if(ctx != null){
			// clear canvas
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, size, size);

			for(let i = 0; i < size; i++){
				for(let j = 0; j < size; j++){
					let dist = Math.sqrt(((radius-i))**2+((radius-j))**2);
					if(dist < radius)
					{
						let rgb = [0,0,0];
						kernels.forEach((k,i) => {
							rgb[i] = utils.getKernelValue(kernels[i],(dist)/radius)*255;
						})
						ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
						ctx.fillRect(i-1, j-1, 1, 1)
					}
				}
			}
			
			return canvas.toDataURL("image/png");
		}
		console.log("kernel rendering error");
	}

</script>
<div class="canvas-container">
	<canvas
		aria-hidden="true"
		width={size}
		height={size}
		bind:this={canvas} 
	/>
	
</div>
	

<style>
	.canvas-container {
		display: none;
		visibility: hidden;
        overflow: hidden;
		
    }
	canvas{
		image-rendering: pixelated;
	}

</style>