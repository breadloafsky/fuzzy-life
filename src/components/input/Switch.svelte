
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let value:number|boolean;
	export let fieldNames:string[] = ["off","on"];
	export let width:number = 50;
	
	const dispatch = createEventDispatcher();
</script>


<button data-enabled={value} class="switch" style="width: {width}px;" 
	on:click={
	()=> {value = !value; dispatch('click');}}
	>
	<div style="width:{width*2}px;  transform: translateX({value ?"0" : -(width-20)}px);">
		<div style="width: {width-20}px;">
			{fieldNames[1]}
		</div>
		<div class="square"></div>
		<div style="width: {width-20}px;">
			{fieldNames[0]}
		</div>
	</div>
</button>

<style>
.switch{
	display: flex;
	overflow: hidden;
	border-radius: 5px;
	padding: 0;
	color:white;
	height: 22px;
	background-color:  var(--bg0);
}
.switch > div{
	transition: 0.2s all;
}
.switch > div:first-child{
	display: flex;
	left: 0px;
}
.square{
	background-color: rgb(172, 172, 172);
	border-radius: 25%;
	width: 20px;
	/* height: 100%; */
}
.switch[data-enabled=false] {
	background-color: #9e9e9e;
	color:black;
}

.switch[data-enabled=false] .square{
	background-color: #525252;
}

</style>