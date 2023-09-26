
<script lang="ts">
	import { onMount } from "svelte";
   	let hideWarning = false;
	let isWarningVisible = true;
   
	onMount( async() => {
		//get warning agreement from the local storage
		if(localStorage)
		{
			if(localStorage.getItem("hideWarning"))
				isWarningVisible = false;
		}
	});

	function buttonClick(){
		if(hideWarning && localStorage)
		 	localStorage.setItem("hideWarning","true");
		isWarningVisible = false;
	}

</script>

{#if isWarningVisible}
<div class="warning-container">
	<div class="warning">
		<h1>WARNING</h1>
		<p> This application can produce high-frequency flashing patterns that might not be suitable for individuals with photosensitive epilepsy</p>
	</div>
	<label>
		Don't show it again
		<input type="checkbox" bind:value={hideWarning}>
	</label>
	<button on:click={buttonClick}>Continue</button>
</div>
{:else}
	<slot/>
{/if}



   

<style>
	.warning{
		border: 1px solid rgb(255, 255, 255);
		padding: 20px;
	}
	p, button{
		font-size: 20px;
		line-height: 25px;
	}
	.warning{
		width: 50vw;
	}
	.warning-container{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
		height: 100vh;
	}
</style>