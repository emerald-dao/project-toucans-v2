<script type="ts">
	import Icon from '@iconify/svelte';
	import type { UserData } from '../../../../_types/user-data.interface';
	import { getContext } from 'svelte';
	// import SignerOf from './SignerOf.svelte';

	const userData: UserData = getContext('userData');
</script>

<div class="main-wrapper">
	<img src={userData.avatar} alt="User avatar" class="avatar" />
	<div class="column-4">
		<div class="column-1">
			<h2 class="name w-medium">{userData.name}</h2>
			<span class="address">
				<Icon icon="tabler:wallet" />
				{userData.address}
			</span>
		</div>
		<!-- <SignerOf /> -->
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		@include mq('small') {
			flex-direction: row;
			align-items: center;
			text-align: left;
			gap: var(--space-6);
		}

		.name {
			font-size: var(--font-size-7);
			overflow-wrap: break-word;
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
			width: 140px;
			height: 140px;
			border-radius: 50%;
			border: 2px solid var(--clr-neutral-badge);
		}
	}
</style>
