<script type="ts">
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';

	export let activeDao: number;
	export let userDaos: DAOProject[];

	let dropDown: HTMLDivElement;
	let headingWrapper: HTMLDivElement;

	let displayDropDown = false;

	const handleClick = () => {
		displayDropDown = !displayDropDown;
	};

	const handleWindowClick = (e: MouseEvent) => {
		if (
			dropDown &&
			!dropDown.contains(e.target as Node) &&
			!headingWrapper.contains(e.target as Node)
		) {
			displayDropDown = false;
		}
	};

	$: activeDao && (displayDropDown = false);
</script>

<svelte:window on:click={handleWindowClick} />
<div class="main-wrapper">
	<div
		class="heading-wrapper row-2 align-center"
		bind:this={headingWrapper}
		on:click={handleClick}
		on:keydown
	>
		<h1>
			{#if userDaos[activeDao]}
				{userDaos[activeDao].generalInfo.name}
			{/if}
		</h1>
		<div class="icon-wrapper" class:selected={displayDropDown}>
			<Icon icon="tabler:chevron-down" width="1.2rem" />
		</div>
	</div>
	{#if displayDropDown}
		<div class="drop-down" bind:this={dropDown} transition:fly|local={{ y: 15, duration: 400 }}>
			<slot name="top" />
			{#if userDaos.length > 1}
				<ul>
					{#each userDaos as dao, index}
						<li>
							<img
								src={dao.generalInfo.logo}
								on:error={(e) => handleLogoImgError(e)}
								alt="dao logo"
							/>
							<a
								class="header-link"
								class:selected={index === activeDao}
								href=""
								on:click={() => (activeDao = index)}
							>
								{dao.generalInfo.name}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
			<slot name="bottom" />
		</div>
	{/if}
</div>

<style type="scss">
	.main-wrapper {
		position: relative;

		.heading-wrapper {
			cursor: pointer;

			h1 {
				font-size: var(--font-size-4);
			}

			.icon-wrapper {
				transition: 0.2s;
				width: 1.2rem;
				height: 1.2rem;
				margin-top: var(--space-2);

				&.selected {
					transform: rotate(180deg);
				}
			}
		}

		.drop-down {
			position: absolute;
			top: 2.9rem;
			left: 0;
			width: fit-content;
			min-width: 180px;
			background-color: var(--clr-surface-primary);
			border-radius: var(--radius-2);
			padding: var(--space-5) var(--space-6);
			z-index: 1;

			ul {
				list-style: none;
				padding: var(--space-2) 0;
				margin: 0;

				li {
					padding: var(--space-2) 0;
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: var(--space-2);

					img {
						width: 1.2rem;
						height: 1.2rem;
						border-radius: 4px;
						object-fit: cover;
					}

					.selected {
						color: var(--clr-heading-main);
					}
				}
			}
		}
	}
</style>
