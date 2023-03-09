<script type="ts">
	import Icon from '@iconify/svelte';
	import { InputWrapper } from '@emerald-dao/component-library';
	import { Button } from '@emerald-dao/component-library';
	import { fundActiveStep } from '$lib/features/funding/stores/FundingSteps';
	import validationSuite from './validation';
	import { fade } from 'svelte/transition';
	import { ECurrencies } from '$lib/types/common/enums';
	import { fundingData } from '$lib/features/funding/stores/FundingData';

	const handleChange = (input: Event) => {
		const target = input.target as HTMLInputElement;

		res = validationSuite($fundingData, target.name);
	};

	let res = validationSuite.get();
</script>

<div in:fade={{ duration: 200 }}>
	<div class="column-6 align-start">
		<h4 class="w-medium">Fund {$fundingData.daoName}</h4>
		<form id="fund-form" on:submit|preventDefault={fundActiveStep.increment} autocomplete="off">
			<InputWrapper
				name="amount"
				iconUrl={$fundingData.currency === ECurrencies.FLOW ? '/flow-logo.png' : '/fusd-logo.png'}
				errors={res.getErrors('amount')}
				isValid={res.isValid('amount')}
				label={`Funding amount ($${$fundingData.currency})`}
			>
				<input
					type="text"
					name="amount"
					placeholder="1000"
					bind:value={$fundingData.amount}
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
					bind:value={$fundingData.specialMessage}
					on:input={handleChange}
				/>
			</InputWrapper>
			{#if $fundingData.issuanceRate}
				<label for="receive">You will recieve</label>
				<span class="xsmall"
					>{`Issuance rate: $${$fundingData.issuanceRate} ${$fundingData.tokenName} = $1 ${$fundingData.currency}`}</span
				>
				<input
					name="receive"
					type="text"
					value="${($fundingData.amount ? $fundingData.amount : 0) *
						$fundingData.issuanceRate} {$fundingData.tokenName}"
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
