
<script lang="ts">
    import { toolTip } from "../../stores";
    import Icon from "./Icon.svelte";

	export let label:string;
	export let vertical = false;
	export let labelStyle = "";
	export let warning = "";
</script>

<div data-vertical={vertical} class="parameter-container">
	<label >
		<div class="title" style={labelStyle}>
			{label}
			{#if warning}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="warning" 
					on:mouseenter={() => $toolTip = warning}
					on:mouseleave={() => $toolTip = ""}
					>
					<Icon name="warning" color="#d1b725"/>
				</div>
			{/if}
			
		</div>
		<div class="control">
			<slot/>
		</div>	
	</label>
	
</div>

<style>

.warning{
	width: 15px;
	height: 15px;
	color: #d1b725;
}

:global([type="range"]){
	width: 100%;
}

.parameter-container{
	display: flex;
}

label{
	width: 100%;
	display: flex;
	flex-direction: row;
}
[data-vertical="true"] label{
	flex-direction: column;
}

.title{
	width: 300px;
	display: flex;
	
}
[data-vertical="true"] .title{
	padding-bottom: 10px;
}
.control{
	display: flex;	
}
[data-vertical="false"] .control{
	align-self: center;
}

[data-vertical="false"] .control{
	flex-direction: column;
}



</style>