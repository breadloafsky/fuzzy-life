
<script lang="ts">
	export let title = "";
</script>


<div class="dropdown">
	<div>
		{title}{" ⌄"}
	</div>
	<div>
		<slot/>
	</div>
</div>


<style>


.dropdown{
	position: relative;
	width: max-content;
	background-color:  var(--bg1);
	border: 1px solid gray;
	border-radius: 4px;
}

.dropdown > div:first-child{
	cursor: pointer;
	padding-inline: 20px;
	background-color: transparent;
}

.dropdown > div:last-child{
	position: absolute;
	width: 100%;
	visibility: hidden;
	z-index: 3;
}

.dropdown:hover > div:last-child{
	visibility: visible;
}

.dropdown > div:last-child > :global(*){
	width: 100%;
}


</style>