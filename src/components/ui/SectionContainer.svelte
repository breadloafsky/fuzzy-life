
<script lang="ts">
	export let label:string;
</script>

<div class="section" >
	<h2 class="header">{label}</h2>
	<div class="body">
		<slot/>
	</div>
</div>


<style>
.section { 
	border: 2px solid var(--bg2);
	margin-inline: 0px;
	margin-block: 20px;
	display: flex;
	flex-direction: column;
}

.header{
	z-index: 3;
	position: sticky;
	background-color: var(--bg2);
	top: 0;
	padding: 10px;
	transform:translateY(2);
	margin: 0;
}

.body {
	background-color: var(--bg1);
	padding: 10px;
	padding-bottom: 0px;
}
.body > :global(div > div){
	padding-block: 10px;
}
.body > :global(div > div:not(:last-child)){
	border-bottom: 1px solid #3d3d3d;
}



</style>