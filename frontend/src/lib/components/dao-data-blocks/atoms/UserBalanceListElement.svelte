<script lang="ts">
	import { Currency } from '@emerald-dao/component-library';
	import type { FindProfile } from '@emerald-dao/component-library/models/user.interface';
	import Icon from '@iconify/svelte';

	export let address: string;
	export let balance: string;
	export let tokenSymbol: string;
	export let findProfile: FindProfile | undefined = undefined;
</script>

<div class="activity-wrapper">
	<div class="row-2 align-center">
		{#if findProfile}
			<img src={findProfile.avatar} alt="find avatar logo" />
			<span class="holder-name">{findProfile.name}</span>
			<a
				href={`https://find.xyz/${findProfile.name}`}
				target="_blank"
				class="header-link"
				rel="noreferrer"
			>
				<Icon icon="tabler:external-link" />
			</a>
		{:else}
			<img src={'/new-avatar.png'} alt="avatar logo" />
			<span class="holder-name">{address}</span>
		{/if}
	</div>
	<Currency
		amount={Number(balance)}
		currency={tokenSymbol}
		color="heading"
		fontSize="var(--font-size-0)"
	/>
</div>

<style type="scss">
	.activity-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-2);
		border-bottom: 1px solid var(--clr-neutral-badge);

		img {
			width: 1.8rem;
			height: 1.8rem;
			border-radius: 50%;
		}

		.holder-name {
			font-size: var(--font-size-0);
		}
	}
</style>
