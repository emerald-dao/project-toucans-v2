<script lang="ts">
	import { Label } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { InputWrapper } from '@emerald-dao/component-library';
	import type { SuiteResult } from 'vest';
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';

	export let address: string;
	export let i: number;
	export let id: string | undefined = undefined;
	export let owner: boolean = false;
	export let editable: boolean = false;
	export let deletable: boolean = true;
	export let res: SuiteResult | undefined = undefined;
	export let pending: boolean | undefined = undefined;
	export let pendingMessage: string[] | undefined = undefined;

	const dispatch = createEventDispatcher();
</script>

<div class="main-wrapper" in:fly|local={{ x: 10, duration: 400 }}>
	<div class="row-4 align-center">
		<!-- <div class="avatar-wrapper">
			<img src="/avatar-2.png" alt="" />
			<span class="number">{i + 1}</span>
		</div> -->
		{#if editable && !owner && id && res}
			<InputWrapper
				name={id}
				errors={res.tests[id] ? res.tests[id].errors : []}
				isValid={res.tests[id] ? res.tests[id].valid : false}
				required={true}
				hasStatusMessage={false}
				{pending}
				{pendingMessage}
			>
				<input
					name={id}
					{id}
					type="text"
					placeholder="0x1234567890abcdef"
					maxlength="18"
					disabled={owner}
					bind:value={address}
					on:input={(e) => dispatch('input', e)}
				/>
			</InputWrapper>
		{:else}
			<UserAvatar {address} imageSize="44px" />
		{/if}
	</div>
	{#if owner}
		<Label size="x-small" hasBorder={false}>Owner</Label>
	{:else if deletable}
		<div class="trash-wrapper" on:click={() => dispatch('delete', id)} on:keydown>
			<Icon icon="tabler:trash" class="delete" />
		</div>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px var(--clr-neutral-badge) solid;
		padding-block: var(--space-3);

		.avatar-wrapper {
			position: relative;

			img {
				width: 34px;
				aspect-ratio: 1 / 1;
				object-fit: cover;
				border-radius: 50%;
			}

			.number {
				font-size: 0.7em;
				color: var(--clr-text-off);
				background-color: var(--clr-surface-primary);
				width: 1.6em;
				height: 1.6em;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				border: 0.5px var(--clr-border-primary) solid;
				position: absolute;
				right: -4px;
				bottom: -4px;
			}
		}

		.address {
			color: var(--clr-heading-main);
		}

		.trash-wrapper {
			cursor: pointer;
			transition: all 0.2s ease-in-out;
			display: flex;
			align-items: center;
			justify-content: center;

			&:hover {
				transform: scale(1.1);
			}
		}
	}
</style>
