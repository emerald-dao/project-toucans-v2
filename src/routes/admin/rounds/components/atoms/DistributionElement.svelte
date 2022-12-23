<script type="ts">
	export let address: string;
	export let i: number;

	const randomColor = '#' + (((1 << 24) * Math.random()) | 0).toString(16);
	document.documentElement.style.setProperty(`--random-color-${i}`, randomColor);
</script>

<div class="row-2 align-center">
	<div class="circle" style={`background-color: var(--random-color-${i});`} />
	<span class="xsmall">{address}</span>
</div>

<style type="scss">
	.circle {
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}
</style>
