
<script lang="ts">
 	import { onMount } from "svelte";
	import { utils } from "../../utils";
    let canvas : HTMLCanvasElement;
	let ctx : CanvasRenderingContext2D|any;

	// kernel size
	const size = 128;


	onMount( async() => {
		ctx = canvas.getContext("2d");
  	});

	
	export function render(kernel:any){
		if(ctx != null){
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, size, size);

			let pos = [Math.round(size/2-1),Math.round(size/2-1)];
			const r = size/2;

			for(let i = 0; i < size; i++){
				for(let j = 0; j < size; j++)
				{
	
					const dist = Math.sqrt((0.5+i-size/2)**2+(0.5+j-size/2)**2);
					const c = utils.getKernelValue(kernel,2*dist/size)*255;
					ctx.fillStyle = `rgb(${c},${c},${c})`;
					if(dist < r)
						ctx.fillRect(i, j, 1, 1)
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