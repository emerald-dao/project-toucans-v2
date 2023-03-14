<script lang="ts">
	export let goal: number | string;
	export let funding: number;
	export let fontSize: string = '1rem';
</script>

<div class="main-wrapper" style={`font-size: ${fontSize}`}>
	<span class="funding w-regular">{`$${funding.toLocaleString()}`}</span>
	<span class="goal w-regular">{`/ ${goal.toLocaleString()} FLOW`}</span>
</div>

<style lang="scss">
	.main-wrapper {
		.funding {
			color: var(--clr-heading-main);
			font-size: 1.1em;
		}

		.goal {
			font-size: 0.7em;
			color: var(--clr-text-off);
		}
	}
</style>
