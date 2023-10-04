
<script lang="ts">
    import { onMount } from "svelte";
    import type { GradientPoint } from "../../types/ui";

	let canvas : HTMLCanvasElement;
	let ctx : CanvasRenderingContext2D|any;

	onMount( async() => {
		ctx = canvas.getContext("2d");
  	});
	export function renderGradient(values:GradientPoint[]){
		let vals = [];
		vals.push({...values[0], pos:0});
		vals = vals.concat(values); 
		vals.push({...values[values.length-1], pos:1}); 
		for(let i = 0; i < 64; i++){
			for(let j = 0; j < 64; j++){
				const pos = (j*64+i)/4096;
				const idx = vals.findIndex((v:any)=>v.pos > pos);
				const color = colorLerp(vals[idx-1].color, vals[idx].color, (pos-vals[idx-1].pos)/(vals[idx].pos-vals[idx-1].pos));
				ctx.fillStyle = color;
				ctx.fillRect(i, j, 1, 1)
			}
		}
		return canvas.toDataURL("image/png");
	}

	function getRgb(hex:string):any {
		const r = parseInt(hex.slice(1, 3), 16),
			g = parseInt(hex.slice(3, 5), 16),
			b = parseInt(hex.slice(5, 7), 16);
		return{r,g,b}
	}
	function colorLerp(x:string, y:string, t:number) {
		const rgbA = getRgb(x);
		const rgbB = getRgb(y);
		const [r,g,b] = ["r","g","b"].map((c)=>Math.round(rgbA[c] * (1 - t) + rgbB[c] * t));
		return `rgb(${r},${g},${b})`;	
	}

</script>

<canvas bind:this={canvas} height="64" width="64"/>

<style>
canvas{
	display: none;
	visibility: hidden;
	overflow: hidden;
	width: 100%;
	height: 100%;
}
</style>