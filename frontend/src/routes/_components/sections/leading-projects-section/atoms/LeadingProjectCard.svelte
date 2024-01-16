<script lang="ts">
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';

	export let project: DaoDatabaseData;

	function handleBannerImgError(e: Event) {
		const target = e.target as HTMLImageElement;
		target.src = 'toucans-illustration.png';
	}
</script>

<div class="main-wrapper column align-center">
	<img
		src={project.banner_image ?? 'toucans-illustration.png'}
		on:error={(e) => handleBannerImgError(e)}
		alt={`${project.name} banner`}
		class="banner"
	/>
	<div class="card-content">
		<h3 class="w-medium" style="text-align:left">{project.name}</h3>
		<p class="small" style="text-align:left">{project.description}</p>
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		background-color: var(--clr-neutral-badge);
		border-radius: 10px;
		overflow: hidden;

		.banner {
			width: 100%;
			height: 160px;
			object-fit: cover;
		}

		.card-content {
			padding: var(--space-5) var(--space-5);
			text-align: left;
			display: flex;
			flex-direction: column;
			gap: 8px;
			width: 100%;

			h3 {
				font-size: var(--font-size-4);
			}

			p {
				// max 4 lines
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
				overflow: hidden;
				font-size: var(--font-size-1);
			}
		}
	}
</style>
