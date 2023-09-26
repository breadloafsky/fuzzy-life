
<script lang="ts">
	import { toolTip } from "../../stores";
	let pos = [0,0];
	document.onmousemove = (e)=>{
		if($toolTip)
			pos = [e.pageX,e.pageY]
	};
</script>

{#if $toolTip}
	<div class="toolTip" style="left:{pos[0]}px; top:{pos[1]}px;">
		{$toolTip}
	</div>
{/if}

<style>



.toolTip {
	pointer-events: none;
	position: absolute;
	z-index: 10;
	margin-left: 20px;
	padding-block: 4px;
	padding-inline: 8px;
	max-width: 250px;
	background-color: #161616;
	border: 1px solid #616161;
}

</style>