
<script lang="ts">
	export let color = "#a8a8a8";
	export let name = "";
</script>

<div class="icon" style={`--icon: url("/icons/${name}.svg"); background-color:${color};`}/>

<style>

.icon {
    mask: var(--icon) no-repeat center;
    -webkit-mask: var(--icon) no-repeat center;
    height: 100%;
    width: 100%;
}

</style>