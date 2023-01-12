<script type="ts">
	import Icon from '@iconify/svelte';
	import { fundData } from '$stores/fund/FundDataStore';
	import { Button } from '@emerald-dao/component-library';
	import { fade } from 'svelte/transition';
</script>

<div in:fade={{ duration: 200 }}>
	<div class="column-8 align-center">
		<h4 class="w-medium">Thank You!</h4>
		<p>
			{`You funded ${$fundData.daoName} with`}
			<span class="strong">{`$${$fundData.currency} ${$fundData.amount}`}</span>
			and got
			<span class="strong"
				>{`$${$fundData.tokenName} ${($fundData.amount * $fundData.issuanceRate).toFixed(2)}`}</span
			>
		</p>
		<div class="column-3 align-center">
			<span class="tagline-small">Share it!</span>
			<div class="row-3">
				<Button
					href={`https://twitter.com/intent/tweet?text=I%20just%20funded%20${
						$fundData.daoName
					}%20DAO%20with%20$${$fundData.currency}%20${$fundData.amount}%20and%20got%20$${
						$fundData.tokenName
					}%20${($fundData.amount * $fundData.issuanceRate).toFixed(2)}
				`}
					target="_blank"
					type="ghost"
					color="neutral"
					size="small"><Icon icon="tabler:brand-twitter" />Twitter</Button
				>
				<Button
					href="https://discord.com/"
					target="_blank"
					color="neutral"
					type="ghost"
					size="small"><Icon icon="tabler:brand-discord" />Discord</Button
				>
			</div>
		</div>
	</div>
</div>

<style type="scss">
	.tagline-small {
		color: var(--clr-primary-main);
		font-size: var(--font-size-1);
	}

	p {
		text-align: center;
		max-width: 30ch;
		font-size: var(--fs-300);

		span.strong {
			color: var(--clr-heading-main);
		}
	}
</style>
