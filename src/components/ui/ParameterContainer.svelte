
<script lang="ts">
	export let label:string;
</script>


<div class="parameter-container">
	<label for={label}>
		{label}
	</label>
	<div >
		<slot/>
	</div>
</div>
<style>

:global([type="range"]){
	width: 100%;
}

.parameter-container{
	display: flex;
}

label{
	width: 200px;
}
.parameter-container > div{
	display: flex;
	width: 100%;
}

</style>