<script lang="ts">
	export let currency: string;
	export let activeCurrency: string;
</script>

<label>
	{currency}
	<input type="radio" id={currency} name="currency" value={currency} bind:group={activeCurrency} />
</label>
