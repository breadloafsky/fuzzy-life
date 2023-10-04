
<script lang="ts">
	export let kernel:any;
	export let i:any;
	export let size:number;
	export let off = false;
	export let absolute = false;
	const hue:number[]=[50, 200, 270];
</script>

<div 
	class="kern-img"
	style="
		{absolute ? "position:absolute;" : ""}
		--kern-img:url({kernel}); 
		--size:{size}px;
		
		{off ? "opacity: 0.2; filter:grayscale(1.0);": "filter:hue-rotate("+hue[i]+"deg);"}"
	/>

<style>
.kern-img {

	background-image: var(--kern-img);
	background-origin: border-box;
	image-rendering: pixelated;
	--size:64;
	--t:calc(var(--kern-size)/64);
	height:var(--size);
	width:var(--size);
	background-position: calc( var(--size)   / var(--t) )  calc( -1 * var(--size) / var(--t) );
	background-size: calc( var(--size) * 1 / var(--t) ) calc( var(--size)   / var(--t) );
}

</style>