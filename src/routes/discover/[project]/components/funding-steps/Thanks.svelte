<script type="ts">
	import Icon from '@iconify/svelte';
	import { fundData } from '$stores/fund/FundDataStore';
	import { Button } from '@emerald-dao/component-library';
	import { Column, Row } from '@mateoroldos/svelte.bones';
</script>

<Column>
	<h4>Thank You!</h4>
	<p>
		{`You funded ${$fundData.daoName} with $${$fundData.currency} ${$fundData.amount} and got $${
			$fundData.tokenName
		} ${($fundData.amount * $fundData.issuanceRate).toFixed(2)}`}
	</p>
	<Column gap={1}>
		<span>Share it</span>
		<Row gap={0.8}>
			<Button
				href={`https://twitter.com/intent/tweet?text=I%20just%20funded%20${
					$fundData.daoName
				}%20DAO%20with%20$${$fundData.currency}%20${$fundData.amount}%20and%20got%20$${
					$fundData.tokenName
				}%20${($fundData.amount * $fundData.issuanceRate).toFixed(2)}
				`}
				target="_blank"
				type="ghost"
				size="x-small"><Icon icon="tabler:brand-twitter" />Twitter</Button
			>
			<Button href="https://discord.com/" target="_blank" type="ghost" size="x-small"
				><Icon icon="tabler:brand-discord" />Discord</Button
			>
		</Row>
	</Column>
</Column>

<style type="scss">
	span {
		color: var(--clr-primary-main);
		text-transform: uppercase;
		font-size: var(--fs-200);
		letter-spacing: 0.2em;
		font-family: var(--ff-mono);
	}
	p {
		text-align: center;
		max-width: 30ch;
		font-size: var(--fs-300);
	}
</style>
