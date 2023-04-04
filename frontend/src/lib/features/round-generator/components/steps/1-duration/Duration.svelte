<script type="ts">
	import { fade } from 'svelte/transition';
	import { user } from '$stores/flow/FlowStore';
	import { roundGeneratorData } from '$lib/features/round-generator/stores/RoundGeneratorData';
	import { ECurrencies } from '$lib/types/common/enums';
	import RoundDatesPicker from '../../atoms/RoundDatesPicker.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let projectId: string | undefined;
	export let daoData: DAOProject;
	export let editDelay: string;
	export let isValid: boolean = false;

	let now = new Date(new Date().getTime() + 5 * 60000 + Number(editDelay));

	if ($user.addr) {
		roundGeneratorData.set({
			startDate: '',
			endDate: '',
			fundingGoal: undefined,
			currency: ECurrencies.FLOW,
			infiniteFundingGoal: false,
			infiniteDuration: false,
			distributionList: [[$user.addr, 100]],
			reserveRate: undefined,
			issuanceRate: undefined,
			projectId
		});
	}

	$: isValid =
		($roundGeneratorData.startDate.length > 0 &&
			$roundGeneratorData.endDate.length > 0 &&
			new Date($roundGeneratorData.startDate) > now) ||
		$roundGeneratorData.infiniteDuration;
</script>

<form in:fade={{ duration: 300 }} autocomplete="off">
	<RoundDatesPicker
		rounds={daoData.onChainData.fundingCycles}
		bind:startDate={$roundGeneratorData.startDate}
		bind:endDate={$roundGeneratorData.endDate}
		bind:infiniteDuration={$roundGeneratorData.infiniteDuration}
	/>
	<div class="secondary-wrapper column-5">
		<span class="heading">Other options</span>
		<label for="infinite-duration" class="switch">
			<input
				type="checkbox"
				name="infinite-duration"
				id="infinite-duration"
				bind:checked={$roundGeneratorData.infiniteDuration}
			/>
			<span class="slider" />
			Infinite
		</label>
	</div>
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: var(--space-10);
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
		}
	}
</style>
