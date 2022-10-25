<script type="ts">
	import type { FullDaoProject } from '$lib/types/dao-project.interface';
	import distributionSuite from '$lib/validations/distributionSuite';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { getContext } from 'svelte';
	import DistStagingElement from './components/DistStagingElement.svelte';
	import { fly } from 'svelte/transition';
	import InputWrapper from '$components/forms/InputWrapper.svelte';

	interface Dist {
		forAccount: string;
		amount: number | undefined;
	}

	const daoData: FullDaoProject = getContext('dao-data');

	const handleChange = (input: Event) => {
		res = distributionSuite(currentDist, input.target.name);

		if (input.target.name === 'address') {
			addressPending = true;
		}

		res.done((result) => {
			res = result;
			addressPending = false;
		});
	};

	let res = distributionSuite.get();
	let addressPending: boolean;
	let addressPendingMessage = ['Checking if address exists in the blockchain'];

	let distStaging: Dist[] = [];

	let currentDist: Dist = {
		forAccount: '',
		amount: undefined
	};

	const addToStaging = () => {
		distStaging = [...distStaging, { ...currentDist }];
	};

	const deleteFromStaging = (i: number) => {
		distStaging.splice(i, 1);
		distStaging = distStaging;
	};

	const distributeTokens = () => {
		alert('distributing');
	};
</script>

<div class="main-wrapper">
	<div class="forms-wrapper sub-wrapper">
		<h4>Manual Add</h4>
		<form id="dist-form" on:submit|preventDefault={addToStaging} autocomplete="off">
			<InputWrapper
				name="address"
				label="Address"
				pending={addressPending}
				pendingMessage={addressPendingMessage}
				{res}
			>
				<input
					name="address"
					type="text"
					maxlength="18"
					bind:value={currentDist.forAccount}
					on:input={handleChange}
				/>
			</InputWrapper>
			<InputWrapper name="amount" label="Amount" iconText={`$${daoData.tokenName}`} {res}>
				<input
					name="amount"
					type="number"
					bind:value={currentDist.amount}
					on:input={handleChange}
				/>
			</InputWrapper>
		</form>
		<Button
			form="dist-form"
			type="ghost"
			color="neutral"
			size="full-width"
			state={res.isValid() ? 'active' : 'disabled'}
			>Add <Icon icon="tabler:arrow-narrow-right" /></Button
		>
	</div>
	<div class="dist-wrapper sub-wrapper">
		<div class="dist-elements-wrapper">
			{#each distStaging as dist, i}
				<DistStagingElement
					forAccount={dist.forAccount}
					amount={dist.amount}
					tokenName={daoData.tokenName}
					on:deleteDist={() => deleteFromStaging(i)}
				/>
			{/each}
		</div>
		{#if distStaging.length > 0}
			<div transition:fly|local={{ y: 10, duration: 500, delay: 200 }}>
				<Button size="full-width" on:click={distributeTokens}>Distribute</Button>
			</div>
		{/if}
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: 2fr 3fr;
		gap: 2rem;
		height: 100%;

		.sub-wrapper {
			// background-color: var(--clr-background-secondary);
			padding: 2rem;
		}

		.dist-wrapper {
			display: flex;
			flex-direction: column;
			gap: 1.4rem;

			.dist-elements-wrapper {
				height: 100%;
				display: flex;
				flex-direction: column;
				gap: 1rem;
				overflow-y: auto;
				overflow-x: hidden;
			}
		}
	}
</style>
