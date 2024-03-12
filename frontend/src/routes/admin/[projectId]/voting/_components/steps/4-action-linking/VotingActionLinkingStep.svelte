<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import PendingActionsListElement from '$components/dao-data-blocks/pending-actions/list/PendingActionsListElement.svelte';
	import Pagination from '$components/atoms/Pagination.svelte';
	import { votingGeneratorLinkedAction } from '../../../_config/votingGeneratorData';

	export let daoData: DAOProject;

	let pageStart: number;
	let pageEnd: number;

	$: currentPageActions = daoData.onChainData.actions.slice(pageStart, pageEnd);
</script>

<div class="column-3">
	{#if daoData.onChainData.actions.length === 0}
		<em>No pending actions found</em>
	{:else}
		{#each currentPageActions as action (action.id)}
			<div
				on:click={() =>
					($votingGeneratorLinkedAction = {
						id: action.id,
						type: action.title
					})}
				on:keydown
				class="action-wrapper"
				class:selected={$votingGeneratorLinkedAction &&
					action.id === $votingGeneratorLinkedAction.id}
			>
				<PendingActionsListElement
					projectOwner={daoData.generalInfo.owner}
					daoId={daoData.generalInfo.project_id}
					{action}
					threshold={action.threshold}
					showDetail={true}
					isSigner={false}
					showDao={false}
				/>
				{#if $votingGeneratorLinkedAction && action.id === $votingGeneratorLinkedAction.id}
					<button on:click|stopPropagation={() => ($votingGeneratorLinkedAction = null)}>
						<Icon icon="tabler:x" />
					</button>
				{/if}
			</div>
		{/each}
		<Pagination
			amountOfItems={daoData.onChainData.actions.length}
			bind:pageStart
			bind:pageEnd
			pageSize={5}
		/>
	{/if}
</div>

<style lang="scss">
	em {
		color: var(--clr-text-off);
	}
	.action-wrapper {
		cursor: pointer;
		border-radius: var(--radius-1);
		padding-inline: var(--space-5);
		position: relative;
		border: 1px solid var(--clr-border-primary);
		transition: border-color 0.2s ease-in-out;

		&.selected {
			border-color: var(--clr-primary-main);
		}

		button {
			background-color: transparent;
			border: none;
			color: var(--clr-text-main);
			cursor: pointer;
			transition: color 0.2s ease-in-out;
			position: absolute;
			top: 1px;
			right: 0;

			&:hover {
				color: var(--clr-heading-main);
			}
		}
	}
</style>
