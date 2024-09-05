<script lang="ts">
	import { fly } from 'svelte/transition';
	import UserAvatar from '$components/atoms/user/UserAvatar.svelte';
	import type { Profile } from '$lib/types/common/profile.interface';
	import UserName from '$components/atoms/user/UserName.svelte';

	export let address: string;
	export let position: number;

	let userProfile: Profile;

	let hover = false;

	const imageWidth = {
		1: '130px',
		2: '85px',
		3: '85px',
		4: '55px',
		5: '55px',
		6: '55px',
		7: '55px',
		8: '55px',
		9: '55px'
	}[position];

	$: modalMargin = `${Number((imageWidth as string).replace('px', '')) / 2 + 18}px`;
</script>

<div
	class="main-wrapper column align-center"
	class:gold={position === 1}
	class:silver={position === 2}
	class:bronze={position === 3}
	style={`max-width: ${imageWidth};`}
>
	<div on:mouseenter={() => (hover = true)} on:mouseleave={() => (hover = false)}>
		<UserAvatar {address} imageSize={imageWidth} showName={false} bind:userProfile />
	</div>
	<div class="position-wrapper center">
		<span class="position w-medium">{position}</span>
	</div>
	{#if hover}
		<div
			class="modal-wrapper"
			transition:fly|local={{ y: 10, duration: 400 }}
			style={`--right-distance: ${modalMargin}`}
		>
			<span class="small">
				{#if position === 1}
					🥇 1st place
				{:else if position === 2}
					🥈 2nd place
				{:else if position === 3}
					🥉 3rd place
				{/if}
			</span>
			<UserName profile={userProfile} fontSize="1rem" showWallet={true} showCreateProfile={false} />
			<div class="prize-wrapper">
				<slot />
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		position: relative;
		display: inline-block;

		.position-wrapper {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			text-align: center;
			border-radius: 50%;
			width: 1rem;
			height: 1rem;
			background-color: var(--clr-surface-secondary);

			span {
				font-size: 0.5rem;
			}
		}

		&.gold {
			.position-wrapper {
				background-color: #cbb222;
				width: 1.4rem;
				height: 1.4rem;
				top: 0.2rem;
				left: 0.2rem;

				.position {
					font-size: 0.7rem;
					color: var(--clr-heading-inverse);
				}
			}
		}

		&.silver {
			.position-wrapper {
				background-color: #818181;

				.position {
					color: var(--clr-heading-inverse);
				}
			}
		}

		&.bronze {
			.position-wrapper {
				background-color: #a46425;

				.position {
					color: var(--clr-heading-inverse);
				}
			}
		}
	}

	.modal-wrapper:after {
		position: absolute;
		bottom: 100%;
		right: var(--right-distance);
		width: 0;
		border-bottom: 5px var(--clr-surface-secondary) solid;
		border-right: 5px solid transparent;
		border-left: 5px solid transparent;
		content: ' ';
		font-size: 0;
		line-height: 0;
	}

	.modal-wrapper {
		position: absolute;
		background-color: var(--clr-surface-secondary);
		padding: var(--space-4);
		border-radius: var(--radius-1);
		width: 210px;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		z-index: 10;
		margin-top: 10px;
		right: -25px;

		.prize-wrapper {
			margin-top: 3px;
		}
	}
</style>
