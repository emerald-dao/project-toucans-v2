<script lang="ts">
	import { Currency } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import UserBadge from './UserBadge.svelte';
</script>

<div class="column-8">
	<div class="row-6 align-center">
		<img src="/new-avatar.png" alt="User avatar" class="avatar" />
		<div class="column-2">
			<h2 class="name w-medium">CrazyAnonToucan</h2>
			<span class="address">
				<Icon icon="tabler:wallet" />
				0xf8d6e0586b0a20c7
			</span>
		</div>
	</div>
	<div class="column-6">
		<div class="column-2">
			<h4>
				<Icon icon="tabler:writing-sign" />
				Signer of
			</h4>
			<div class="dao-labels-wrapper">
				<div class="dao-label">
					<img src="/ec-logo.png" alt="Emerald City Logo" class="dao-logo" />
					<span>Emerald City DAO</span>
				</div>
			</div>
		</div>
		<div class="column-10 balance-wrapper">
			<div class="column-2">
				<h4>
					<Icon icon="tabler:medal" />
					Badges
				</h4>
				<div class="badges-wrapper">
					<UserBadge />
					<UserBadge />
					<UserBadge />
					<UserBadge />
					<UserBadge />
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.name {
		font-size: var(--font-size-6);
	}

	.dao-labels-wrapper {
		display: flex;
		flex-direction: row;
		gap: var(--space-2);
		align-items: center;
		flex-wrap: wrap;

		.dao-label {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--space-1);
			color: var(--clr-text-main);
			border: 1px solid var(--clr-border-primary);
			padding: 2px var(--space-3);
			border-radius: 20px;
			width: fit-content;

			span {
				font-size: var(--font-size-0);
			}

			.dao-logo {
				width: 18px;
				height: 18px;
				aspect-ratio: 1;
			}
		}
	}

	.balance-wrapper {
		margin-bottom: var(--space-4);
	}

	.badges-wrapper {
		display: flex;
		flex-direction: row;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.address {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
		color: var(--clr-text-off);
	}

	.avatar {
		aspect-ratio: 1 !important;
		width: 70px;
		height: 70px;
		border-radius: 50%;
	}

	h4 {
		font-size: var(--font-size-2);
		color: var(--clr-text-off);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
	}
</style>
