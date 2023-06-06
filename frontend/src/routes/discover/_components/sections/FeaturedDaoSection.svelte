<script lang="ts">
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';

	export let project: DaoDatabaseData;
	export let story: string;
	export let title: string;
</script>

<section class="container-small border-bottom">
	<h3 class="w-medium">{title}</h3>
	<div class="project-wrapper">
		<ProjectCard {project} />
		<div class="column-2 stroy-wrapper">
			<h4 class="h5">Community story</h4>
			<p><em>{story}</em></p>
		</div>
	</div>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);

		@include mq(medium) {
			gap: var(--space-10);
		}

		.project-wrapper {
			display: flex;
			flex-direction: column-reverse;
			gap: var(--space-7);

			@include mq(medium) {
				display: grid;
				grid-template-columns: 4fr 3fr;
				gap: var(--space-12);
			}

			h4 {
				display: none;

				@include mq(medium) {
					display: block;
				}
			}
		}

		.stroy-wrapper {
			@include mq(medium) {
				margin-top: var(--space-16);
			}
		}
	}
</style>
