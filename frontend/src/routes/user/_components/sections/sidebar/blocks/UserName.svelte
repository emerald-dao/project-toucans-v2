<script type="ts">
	import Icon from '@iconify/svelte';
	import type { UserData } from '../../../../_types/user-data.interface';
	import { getContext } from 'svelte';
	import SignerOf from './SignerOf.svelte';

	const userData: UserData = getContext('userData');
</script>

<div class="row-6 align-center">
	<img src={userData.avatar} alt="User avatar" class="avatar" />
	<div class="column-4">
		<div class="column-1">
			<h2 class="name w-medium">{userData.name}</h2>
			<span class="address">
				<Icon icon="tabler:wallet" />
				{userData.address}
			</span>
		</div>
		<SignerOf />
	</div>
</div>

<style lang="scss">
	.name {
		font-size: var(--font-size-7);
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
		width: 130px;
		height: 130px;
		border-radius: 50%;
	}
</style>
