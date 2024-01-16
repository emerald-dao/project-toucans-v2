<script lang="ts">
	export let currencies: string[];
	export let value: string;
</script>

<div class="radio-tabs" id="currencies">
	{#each currencies as currency}
		<label>
			{#if currency === 'NFTs'}
				<span>{`${currency}`}</span>
			{:else}
				<span>{`$${currency}`}</span>
			{/if}
			<input type="radio" id={currency} name="currency" value={currency} bind:group={value} />
		</label>
	{/each}
</div>

<style lang="scss">
	label {
		padding: var(--space-2) var(--space-2);

		@include mq('small') {
			padding: var(--space-2) var(--space-4);
		}
	}
</style>
