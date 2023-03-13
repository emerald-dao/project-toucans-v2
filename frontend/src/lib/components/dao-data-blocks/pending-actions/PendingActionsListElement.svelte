<script lang="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import type { ActionData } from '$lib/types/dao-project/dao-project.interface';
	import type { MultisigActions } from '$lib/types/dao-project/multisig-actions/multisig-actions.type';
	import Icon from '@iconify/svelte';
	import { user } from '$stores/flow/FlowStore';
	import { acceptActionExecution } from '$flow/actions';

	export let action: ActionData;
	export let threshold: string;
	export let projectOwner: string;
	export let projectId: string;
	export let daoId: string | undefined = undefined;
	export let daoLogo: string | undefined =
		'https://avatars.githubusercontent.com/u/6936373?s=200&v=4';
	export let showDetail = true;

	const signed = Object.keys(action.votes).includes($user.addr as string);
	const yesCount = Object.values(action.votes).filter((v) => v === true).length;

	const actionTypeToIcon: {
		[key in MultisigActions]: string;
	} = {
		Withdraw: 'tabler:outbound',
		RemoveSigner: 'tabler:pencil-off',
		AddSigner: 'tabler:pencil-plus',
		UpdateThreshold: 'tabler:alert-triangle'
	};

	const actionTypeToText: {
		[key in MultisigActions]: string;
	} = {
		Withdraw: 'Withdraw',
		RemoveSigner: 'Remove Signer',
		AddSigner: 'Add Signer',
		UpdateThreshold: 'Update Threshold'
	};
</script>

<div class="main-wrapper">
	<div class="row-6 align-center">
		<div class="row-2 align-center">
			<IconCircle icon={actionTypeToIcon[action.title]} />
			<span class="action-name small">{actionTypeToText[action.title]}</span>
		</div>
		{#if daoId}
			<div class="dao-project">
				<img src={daoLogo} alt="dao logo" />
				<span class="xsmall">
					{daoId}
				</span>
			</div>
		{/if}
		<div>
			<span class="xsmall action-id">Action ID</span>
			<span class="xsmall">{action.id}</span>
		</div>
		{#if showDetail}
			<span class="action-message xsmall">{action.intent}</span>
		{/if}
	</div>
	<div class="row-4">
		<div class="threshold-wrapper">
			<span class="xsmall">Signatures</span>
			<span class="threshold"><strong>{yesCount}</strong>/{threshold}</span>
		</div>
		{#if !signed}
			<div class="row-2">
				<div
					class="action-wrapper sign"
					on:click={() => acceptActionExecution(projectOwner, projectId, action.intent, action.id)}
					on:keydown
				>
					<Icon icon="tabler:pencil-plus" />
				</div>
				<div class="action-wrapper trash">
					<Icon icon="tabler:x" />
				</div>
			</div>
		{:else}
			<div class="row align-center">
				<Icon icon="tabler:check" width="1rem" color="var(--clr-primary-main)" />
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding-block: var(--space-4);
		border-bottom: 1px solid var(--clr-neutral-badge);
		gap: var(--space-4);

		.dao-project {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--space-2);
			background-color: var(--clr-neutral-badge);
			padding: var(--space-1) var(--space-2);
			border-radius: var(--radius-8);

			img {
				width: 1.3em;
				height: 1.3em;
				border-radius: 50%;
			}
		}

		.action-name {
			color: var(--clr-heading-main);
		}

		.action-id {
			color: var(--clr-text-off);
		}

		.action-message {
			max-width: 50ch;
			color: var(--clr-text-off);
		}

		.action-wrapper {
			border-radius: 50%;
			color: var(--clr-heading-inverse);
			width: 1.7em;
			height: 1.7em;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: transform 0.2s ease-in-out;

			&.sign {
				background-color: var(--clr-primary-main);
			}

			&.trash {
				background-color: var(--clr-alert-main);
			}

			&:hover {
				transform: scale(1.1);
			}
		}

		.threshold-wrapper {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--space-1);
			background-color: var(--clr-surface-primary);
			padding: 0 var(--space-4);
			border-radius: var(--radius-8);

			.threshold {
				font-size: var(--font-size-0);
				color: var(--clr-font-text);
			}
		}
	}
</style>
