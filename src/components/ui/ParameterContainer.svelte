
<script lang="ts">
	export let label:string;
	export let vertical = false;
</script>

<div data-vertical={vertical} class="parameter-container">
	<label >
		<div class="title">{label}</div>
		<div class="control">
			<slot/>
		</div>	
	</label>
	
</div>

<style>

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
	
}
[data-vertical="true"] label{
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