
<script >

	export let rr = 2;

   
</script>

<div class="diagram-container" style="--rr:{rr*100}%">
	<div class="d_outer">
		<div class="d_control">
			<div class="d_inner">
			</div>
		</div>
	</div>
</div>



<style>
	.diagram-container {
		display: flex;
		--rr:50%;
	}
	.d_outer{
		width: 140px;
		height: 140px;
		border-radius: 50%;
		background-color: var(--color1);
		display: flex;
		justify-content: center; 
    	align-items: center;
	} 
	.d_control{
		width: var(--rr);
		height: var(--rr);
		border-radius: 50%;
		padding: 2px;
		background-color: rgb(0, 0, 0);
		display: flex;
		justify-content: center; 
    	align-items: center;
	} 

	.d_inner{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: var(--color0);
	} 



   
</style>