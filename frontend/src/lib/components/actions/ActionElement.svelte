<script lang="ts">
	import type { MultisigActions } from '$lib/types/dao-project/multisig-actions/multisig-actions.type';
	import Icon from '@iconify/svelte';

	export let actionType: MultisigActions;
	export let actionId: string;
	export let signed: boolean;
	export let daoId: string | undefined = undefined;
	export let daoLogo: string | undefined =
		'https://avatars.githubusercontent.com/u/6936373?s=200&v=4';

	const actionTypeToIcon: {
		[key in MultisigActions]: string;
	} = {
		Withdraw: 'tabler:outbound',
		Mint: 'tabler:coin',
		NewFundingCycle: 'tabler:pig-money',
		RemoveSigner: 'tabler:pencil-off',
		AddSigner: 'tabler:pencil-plus',
		UpdateThreshold: 'tabler:alert-triangle'
	};

	const actionTypeToText: {
		[key in MultisigActions]: string;
	} = {
		Withdraw: 'Withdraw',
		Mint: 'Mint',
		NewFundingCycle: 'New Funding Cycle',
		RemoveSigner: 'Remove Signer',
		AddSigner: 'Add Signer',
		UpdateThreshold: 'Update Threshold'
	};
</script>

<div class="main-wrapper">
	<div class="row-6 align-center">
		<div class="row-2 align-center">
			<div class="icon-wrapper">
				<Icon icon={actionTypeToIcon[actionType]} width="0.9rem" />
			</div>
			<span class="action-name small">{actionTypeToText[actionType]}</span>
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
			<span class="xsmall">{actionId}</span>
		</div>
	</div>
	<div class="row-4">
		<div class="threshold-wrapper">
			<span class="xsmall">Signatures</span>
			<div class="row align-baseline">
				<span>1</span>
				<span class="threshold">/4</span>
			</div>
		</div>
		{#if !signed}
			<div class="row-2">
				<div class="action-wrapper sign">
					<Icon icon="tabler:pencil-plus" />
				</div>
				<div class="action-wrapper trash">
					<Icon icon="tabler:trash" />
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

		.icon-wrapper {
			background-color: var(--clr-tertiary-badge);
			border-radius: 50%;
			color: var(--clr-tertiary-main);
			width: 1.7em;
			height: 1.7em;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.action-name {
			color: var(--clr-heading-main);
		}

		.action-id {
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
				font-size: 0.6rem;
				color: var(--clr-font-text);
			}
		}
	}
</style>
