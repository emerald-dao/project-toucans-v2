<script lang="ts">
	import { Button, Modal, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
</script>

<Button color="neutral" size="x-small" on:click={() => getModal('transfer').open()} type="ghost">
	Transfer
	<Icon icon="tabler:arrow-up-right" />
</Button>
<Modal id={'transfer'}>
	<div class="column-8">
		<h3>Transfer tokens</h3>
		<div class="available-tokens row-2 align-center">
			<div class="token-icon">
				<img
					src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"
					alt="Bitcoin"
				/>
			</div>
			<div class="token-details">
				<div class="token-name">Bitcoin</div>
				<div class="token-amount">0.00000000</div>
			</div>
		</div>
		<form class="column-2">
			<div class="input-group">
				<label for="recipient">Recipient</label>
				<input type="text" id="recipient" />
			</div>
			<div class="input-group">
				<label for="amount">Amount</label>
				<input type="number" id="amount" />
			</div>
		</form>
		<div class="column align-end">
			<Button color="primary" size="small">
				Transfer
				<Icon icon="tabler:arrow-up-right" />
			</Button>
		</div>
	</div>
</Modal>

<style lang="scss">
	h3 {
		font-size: var(--font-size-5);
		text-align: center;
	}

	.available-tokens {
		border: 1px solid var(--clr-border-primary);
		border-radius: var(--radius-2);
		padding: var(--space-2);
		background-color: var(--clr-surface-primary);

		.token-icon {
			width: 40px;
		}

		.token-name {
			color: var(--clr-heading-main);
		}
	}
</style>
