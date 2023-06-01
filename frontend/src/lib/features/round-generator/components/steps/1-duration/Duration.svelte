<script type="ts">
	import { fade } from 'svelte/transition';
	import { user } from '$stores/flow/FlowStore';
	import { roundGeneratorData } from '$lib/features/round-generator/stores/RoundGeneratorData';
	import RoundDatesPicker from '../../atoms/RoundDatesPicker.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { onMount } from 'svelte';

	export let projectId: string | undefined;
	export let daoData: DAOProject;
	export let isValid: boolean = false;

	let now = new Date();
	let minStartTime = new Date(now.getTime() + Number(daoData.onChainData.editDelay) * 1000);

	$: minStartTime = new Date(now.getTime() + Number(daoData.onChainData.editDelay) * 1000);

	const minStartTimePlus5Minutes = new Date(minStartTime.getTime() + 2 * 60000);

	onMount(() => {
		const interval = setInterval(() => {
			now = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	if ($user.addr) {
		roundGeneratorData.set({
			startDate: '',
			endDate: '',
			fundingGoal: undefined,
			currency: daoData.onChainData.paymentCurrency,
			infiniteFundingGoal: false,
			infiniteDuration: false,
			distributionList: [['Treasury', 100]],
			reserveRate: 0,
			issuanceRate: undefined,
			projectId,
			allowOverflow: true,
			requiredNft: null
		});
	}

	$: startDateValid =
		$roundGeneratorData.startDate.length > 0 &&
		new Date(Number($roundGeneratorData.startDate) * 1000) > minStartTime;
	$: endDateValid =
		$roundGeneratorData.endDate.length > 0 &&
		new Date(Number($roundGeneratorData.endDate) * 1000) > minStartTime;
	$: isValid =
		(startDateValid && endDateValid) || ($roundGeneratorData.infiniteDuration && startDateValid);
</script>

<form in:fade={{ duration: 300 }} autocomplete="off">
	<RoundDatesPicker
		rounds={daoData.onChainData.fundingCycles}
		{minStartTimePlus5Minutes}
		bind:startDate={$roundGeneratorData.startDate}
		bind:endDate={$roundGeneratorData.endDate}
		bind:infiniteDuration={$roundGeneratorData.infiniteDuration}
	/>
	<div class="column-8 secondary-wrapper">
		<div class="column-3">
			<span class="heading">Other options</span>
			<label for="infinite-duration" class="switch">
				<input
					type="checkbox"
					name="infinite-duration"
					id="infinite-duration"
					bind:checked={$roundGeneratorData.infiniteDuration}
				/>
				<span class="slider" />
				Infinite round
			</label>
		</div>
		<div class="column-3">
			<span class="heading">Conditions</span>
			<ul>
				{#if Number(daoData.onChainData.editDelay) > 0}
					<li>
						{`Your edit delay is ${
							Number(daoData.onChainData.editDelay) / 86400
						}, this means your rounds must start at least ${
							Number(daoData.onChainData.editDelay) / 86400
						} days after today.`}
					</li>
				{/if}
				<li>
					{`Funding rounds that have ending date can't overlap.`}
				</li>
				<li>
					{`If a non infinite funding round overlaps a infinite round, the non infinite round will be prioritized and the infinite round will automatically end.`}
				</li>
			</ul>
		</div>
	</div>
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: var(--space-7);
		margin-bottom: var(--space-8);

		.secondary-wrapper {
			border-left: 1px solid var(--clr-neutral-badge);
			padding-left: var(--space-4);
			padding-block: var(--space-4);

			span {
				font-size: var(--font-size-1);

				&.heading {
					color: var(--clr-heading-main);
				}
			}

			ul {
				padding-left: var(--space-3);
				margin-top: 0;

				li {
					font-size: var(--font-size-0);
					line-height: 1.4;

					&:not(:last-child) {
						margin-bottom: var(--space-2);
					}
				}
			}
		}
	}
</style>
