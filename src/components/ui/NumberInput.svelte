
<script lang="ts">
	export let value:number;
	export let step = 0.01;
	export let min=0.0;
	export let max=1;
	let previousValue:number;

	// check the value is a number
	function isNumber(value:string) {
    	return /-?\d+$/.test(value);
	}

	$:value, (()=>previousValue = value)();



	function onInput(e:any){
		const val = e.target.value;
		if(isNumber(val) && val >= min && val <= max)
			previousValue = val;
		else
			e.target.value = previousValue;
	}

</script>

<input 
	on:input={onInput}
	bind:value={value} 
	type="number" 
	step={step} 
	min={min} 
	max={max}
/>





<style>
	input[type=number]{
		width: 60px;
	}
</style>