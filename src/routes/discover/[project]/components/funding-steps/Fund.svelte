<script type="ts">
	import Icon from '@iconify/svelte';
	import { InputWrapper } from '@emerald-dao/component-library';
	import { Button } from '@emerald-dao/component-library';
	import { fundActiveStep } from '$stores/fund/FundSteps';
	import { fundData } from '$stores/fund/FundDataStore';
	import fundingSuite from '$lib/validations/fundingSuite';
	import { Currencies } from '$lib/types/currencies.enum';
	import { fade } from 'svelte/transition';

	console.log($fundData);

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = fundingSuite($fundData, target.name);
	};

	let res = fundingSuite.get();
</script>

<div in:fade={{ duration: 200 }}>
	<div class="column-6 align-start">
		<h4 class="w-medium">Fund {$fundData.daoName}</h4>
		<form id="fund-form" on:submit|preventDefault={fundActiveStep.increment} autocomplete="off">
			<InputWrapper
				name="amount"
				iconUrl={$fundData.currency === Currencies.FLOW ? '/flow-logo.png' : '/fusd-logo.png'}
				errors={res.getErrors('amount')}
				isValid={res.isValid('amount')}
				label={`Funding amount ($${$fundData.currency})`}
			>
				<input
					type="text"
					name="amount"
					placeholder="1000"
					bind:value={$fundData.amount}
					on:input={handleChange}
				/>
			</InputWrapper>
			<InputWrapper
				name="message"
				label="Add a special message"
				errors={res.getErrors('message')}
				isValid={res.isValid('message')}
			>
				<textarea
					name="message"
					placeholder="Write a special message"
					bind:value={$fundData.specialMessage}
					on:input={handleChange}
				/>
			</InputWrapper>
			{#if $fundData.issuanceRate}
				<label for="receive">You will recieve</label>
				<span class="xsmall"
					>{`Issuance rate: $${$fundData.issuanceRate} ${$fundData.tokenName} = $1 ${$fundData.currency}`}</span
				>
				<input
					name="receive"
					type="text"
					value="${($fundData.amount ? $fundData.amount : 0) *
						$fundData.issuanceRate} {$fundData.tokenName}"
					readonly
					id="receive"
				/>
			{/if}
		</form>
		<Button form="fund-form" width="full-width" state={res.isValid() ? 'active' : 'disabled'}
			><Icon icon="tabler:pig-money" />Fund</Button
		>
	</div>
</div>

<style type="scss">
	form {
		width: 100%;
		display: flex;
		flex-direction: column;

		label {
			margin-bottom: var(--space-2);
		}

		#receive {
			padding-left: 0;
			background-color: transparent;
			border: none;
			color: var(--clr-heading-main);
		}

		label[for='receive'] {
			margin-bottom: 0;
		}

		textarea {
			min-height: 8rem;
			min-width: 300px;
			max-width: 300px;
			margin-top: var(--space-2);
		}
	}
</style>
