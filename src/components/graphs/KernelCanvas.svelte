
<script lang="ts">
 	import { onMount } from "svelte";
	import { utils } from "../../utils";
    import type { Kernel } from "../../types/types";
    let canvas : HTMLCanvasElement;
	let ctx : CanvasRenderingContext2D|any;

	// kernel image size. each kernel dimension is: (size)x(size)
	let size = 64;


	onMount( async() => {
		ctx = canvas.getContext("2d");
		
  	});

	
	export function render(kernels:Kernel[], radius:number, smoothing:number=2){
		if(ctx != null){

			// clear canvas
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, size, size*4);

			// draw each kernel
			for(let k = 0; k < kernels.length; k++){
				let pos = [-1,size*k-1];

				for(let i = 0; i < size; i++){
					for(let j = 0; j < size; j++)
					{

						let dist = Math.sqrt(((radius-i))**2+((radius-j))**2);
						if(dist < radius)
						{

							// 'smooth' the kernel
							let val = 0;
							let smoothCount = 0;
							for(let h = 1-smoothing; h < smoothing; h++){
								if(h+dist < radius)
									val+=utils.getKernelValue(kernels[k],(h+dist)/radius);
								else
									val+=utils.getKernelValue(kernels[k],1);

								smoothCount++;
							}

							val = val/smoothCount;

							const c = val*255;
							ctx.fillStyle = `rgb(${c*2},${c},${c})`;
							ctx.fillRect(i+pos[0], j+pos[1], 1, 1)
						}
							
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
		height={size*4}
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