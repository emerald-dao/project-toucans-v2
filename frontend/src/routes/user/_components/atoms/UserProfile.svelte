<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<div class="column-11">
	<div class="row-6 align-center">
		<img src="/new-avatar.png" alt="User avatar" class="avatar" />
		<div class="column-2">
			<h2 class="name">CrazyAnonToucan</h2>
			<span class="address">
				<Icon icon="tabler:wallet" />
				0xf8d6e0586b0a20c7
			</span>
		</div>
	</div>
	<div class="column-1">
		<span class="signer-title">
			<Icon icon="tabler:writing-sign" />
			Signer of
		</span>
		<div class="dao-labels-wrapper">
			<div class="dao-label">
				<img src="/ec-logo.png" alt="Emerald City Logo" class="dao-logo" />
				<span>Emerald City DAO</span>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.name {
		font-size: var(--font-size-6);
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

	.signer-title {
		font-size: var(--font-size-0);
		color: var(--clr-text-off);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
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
			color: var(--clr-text-off);
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
</style>
