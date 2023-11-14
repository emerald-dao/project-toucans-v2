<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { handleLogoImgError } from '$lib/utilities/handleLogoImgError';
	import Icon from '@iconify/svelte';

	export let daoData: DAOProject;
	export let title: string;
</script>

<div class="column-6 align-center">
	<div class="image-wrapper">
		<div class="icon-wrapper center">
			<Icon icon="tabler:cash-banknote" />
		</div>
		<img src={daoData.generalInfo.logo} on:error={(e) => handleLogoImgError(e)} alt="Toucans" />
	</div>
	<h4>{title}</h4>
</div>

<style lang="scss">
	.image-wrapper {
		position: relative;
		margin-bottom: var(--space-3);

		img {
			width: 70px;
			height: 70px;
			border-radius: 50%;
			object-fit: cover;
			border: 2px solid var(--clr-border-primary);
		}

		.icon-wrapper {
			position: absolute;
			bottom: -4px;
			right: -4px;
			background-color: var(--clr-tertiary-main);
			border-radius: 50%;
			width: 25px;
			height: 25px;
			color: var(--clr-heading-inverse);
		}
	}

	h4 {
		font-size: var(--font-size-5);
	}
</style>
