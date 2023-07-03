<script lang="ts">
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import Icon from '@iconify/svelte';
	import NotableMemberAvatar from './atoms/NotableMemberAvatar.svelte';

	export let daoData: DAOProject;

	const prizeText =
		'In eiusmod do ullamco excepteur et do. Enim mollit exercitation laboris ex consequat adipisicing aliquip reprehenderit aliqua magna voluptate ea officia. Deserunt elit reprehenderit.';
</script>

<div class="main-wrapper">
	<span class="title">
		<Icon icon="tabler:medal" />
		Notable members
	</span>
	<div class="secondary-wrapper">
		<div class="card prize-wrapper">
			<div class="column-4 align-center">
				<span class="small title">Project investors</span>
				<div class="avatars-wrapper">
					<NotableMemberAvatar address="0xab41270ee6b2b689" position={1} {prizeText} />
					<NotableMemberAvatar address="0x73e4a1094d0bcab6" position={2} {prizeText} />
					<NotableMemberAvatar address="0xfcddbc5ac1b0469f" position={3} {prizeText} />
					<NotableMemberAvatar address="0x02d1a6f46510ba48" position={4} {prizeText} />
					<NotableMemberAvatar address="0xab41270ee6b2b689" position={5} {prizeText} />
				</div>
			</div>
		</div>
		<div class="card prize-wrapper">
			<div class="column-4 align-center">
				<span class="small title">Project holders</span>
				<div class="avatars-wrapper">
					<NotableMemberAvatar address="0xfcddbc5ac1b0469f" position={1} {prizeText} />
					<NotableMemberAvatar address="0x73e4a1094d0bcab6" position={2} {prizeText} />
					<NotableMemberAvatar address="0xfcddbc5ac1b0469f" position={3} {prizeText} />
					<NotableMemberAvatar address="0x02d1a6f46510ba48" position={4} {prizeText} />
					<NotableMemberAvatar address="0xab41270ee6b2b689" position={5} {prizeText} />
				</div>
			</div>
		</div>
		<div class="card prize-wrapper">
			<div class="column-4 align-center">
				<span class="small title">Decision makers</span>
				<div class="avatars-wrapper">
					<NotableMemberAvatar address="0x73e4a1094d0bcab6" position={1} {prizeText} />
					<NotableMemberAvatar address="0x73e4a1094d0bcab6" position={2} {prizeText} />
					<NotableMemberAvatar address="0xfcddbc5ac1b0469f" position={3} {prizeText} />
					<NotableMemberAvatar address="0x02d1a6f46510ba48" position={4} {prizeText} />
					<NotableMemberAvatar address="0xab41270ee6b2b689" position={5} {prizeText} />
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);

		.title {
			font-size: var(--font-size-1);
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: var(--space-1);
		}

		.secondary-wrapper {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			gap: var(--space-5);

			.prize-wrapper {
				background-color: var(--clr-background-secondary);
				border-radius: var(--radius-3);

				.avatars-wrapper {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					gap: var(--space-5);
					justify-content: center;
				}
			}
		}
	}
</style>
