<script lang="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import type { ActionData } from '$lib/types/dao-project/dao-project.interface';
	import type { MultisigActions } from '$lib/types/dao-project/multisig-actions/multisig-actions.type';
	import Icon from '@iconify/svelte';
	import { user } from '$stores/flow/FlowStore';
	import { voteOnActionExecution, getBatchAmounts } from '$flow/actions';
	import { Label, Modal, getModal } from '@emerald-dao/component-library';
	import BatchMintingList from '../atoms/BatchMintingList.svelte';
	import { formatDate } from '$lib/utilities/formatDate';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';

	export let action: ActionData;
	export let threshold: string;
	export let projectOwner: string;
	export let daoId: string;
	export let daoLogo: string | undefined =
		'https://avatars.githubusercontent.com/u/6936373?s=200&v=4';
	export let showDetail = true;
	export let isSigner: boolean;
	export let showDao = true;

	$: signed = Object.keys(action.votes).includes($user.addr as string);
	$: yesCount = Object.values(action.votes).filter((v) => v === true).length;

	const actionTypeToIcon: {
		[key in MultisigActions]: string;
	} = {
		Withdraw: 'tabler:outbound',
		WithdrawNFTs: 'tabler:outbound',
		BatchWithdraw: 'tabler:outbound',
		RemoveSigner: 'tabler:pencil-off',
		AddSigner: 'tabler:pencil-plus',
		UpdateThreshold: 'tabler:alert-triangle',
		Mint: 'tabler:coin',
		BatchMint: 'tabler:coin',
		MintToTreasury: 'tabler:pig-money',
		Burn: 'tabler:flame',
		LockTokens: 'tabler:lock-square',
		StakeFlow: 'tabler:coins',
		UnstakeFlow: 'tabler:coins'
	};

	const actionTypeToText: {
		[key in MultisigActions]: string;
	} = {
		Withdraw: 'Withdraw',
		WithdrawNFTs: 'Withdraw',
		BatchWithdraw: 'Batch Withdraw',
		RemoveSigner: 'Remove Signer',
		AddSigner: 'Add Signer',
		UpdateThreshold: 'Update Threshold',
		Mint: 'Mint',
		BatchMint: 'Batch Mint',
		MintToTreasury: 'Mint to Treasury',
		Burn: 'Burn',
		LockTokens: 'Locked Tokens',
		StakeFlow: 'Stake Flow',
		UnstakeFlow: 'Unstake Flow'
	};

	function translateIntent(action: MultisigActions, intent: string) {
		if (action === 'LockTokens') {
			const date = intent.substring(intent.search('until') + 6);
			const readableDate = formatDate(new Date(Number(date) * 1000));
			return intent.replace(date, readableDate);
		}
		return intent;
	}
</script>

<div class="main-wrapper">
	<div class="row-6 align-center">
		<div class="row-2 align-center">
			<IconCircle icon={actionTypeToIcon[action.title]} />
			<span class="action-name small">{actionTypeToText[action.title]}</span>
		</div>
		{#if daoId && showDao}
			<div class="dao-project">
				<img src={daoLogo} alt="dao logo" on:error={(e) => handleLogoImgError(e)} />
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
			<span class="action-message xsmall">{translateIntent(action.title, action.intent)}</span>
		{/if}
	</div>
	<div class="row-4 align-center">
		{#if action.title === 'BatchWithdraw' || action.title === 'BatchMint'}
			<div
				class="header-link"
				on:click={() => getModal(`batch-withdraw-${action.id}`).open()}
				on:keydown
			>
				<Icon icon="tabler:message" />
			</div>
			{#await getBatchAmounts(projectOwner, daoId, action.id) then { amounts, currency }}
				<Modal background="var(--clr-background-secondary)" id={`batch-withdraw-${action.id}`}>
					<BatchMintingList {amounts} {currency} />
				</Modal>
			{/await}
		{/if}
		<div class="threshold-wrapper">
			<span class="xsmall">Signatures</span>
			<span class="threshold">{yesCount}/{threshold}</span>
		</div>
		{#if isSigner}
			<div class="row-2 align-center">
				{#if signed && $user.addr && action.votes[$user.addr] === false}
					<Label size="xx-small" hasBorder={false} color="alert">
						Voted
						<Icon icon="tabler:x" />
					</Label>
				{/if}
				{#if signed && $user.addr && action.votes[$user.addr] === true}
					<Label size="xx-small" hasBorder={false}>
						Voted
						<Icon icon="tabler:check" />
					</Label>
				{/if}
				{#if !signed || ($user.addr && action.votes[$user.addr] === false)}
					<div
						class="action-wrapper sign"
						on:click={() => voteOnActionExecution(projectOwner, daoId, action.id, true)}
						on:keydown
					>
						<Icon icon="tabler:pencil-plus" />
					</div>
				{/if}
				{#if !signed || ($user.addr && action.votes[$user.addr] === true)}
					<div
						class="action-wrapper trash"
						on:click={() => voteOnActionExecution(projectOwner, daoId, action.id, false)}
						on:keydown
					>
						<Icon icon="tabler:x" />
					</div>
				{/if}
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
			border: 0.5px solid var(--clr-border-primary);
			padding: 0 var(--space-4);
			border-radius: var(--radius-8);

			.threshold {
				font-size: var(--font-size-0);
				color: var(--clr-font-text);
			}
		}
	}
</style>
