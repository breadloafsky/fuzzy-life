<script>
    import Icon from "../ui/Icon.svelte";

</script>



<div class="notification">
	<div class="warning">
		<div class="icon"><Icon name="mobile"/></div>
		<h1>No mobile version available</h1>
		<p> Unfortunately this application is not optimized for mobile devices</p>
	</div>
</div>



   

<style>

	.icon{
		width: 100px;
		height: 100px;
		padding-bottom: 40px;
	}
	.warning{
		width: 80vw;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.notification{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
		height: 100vh;
	}
</style>