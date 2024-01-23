<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { DaoType } from '../../../../dao-generator/daoTypes';

	export let daoType: DaoType;
</script>

<a class="card column-6" href={`/dao-generator/${daoType.slug}`}>
	<div class="row-3 align-center">
		<div class="icon-wrapper">
			<Icon color="var(--clr-primary-main)" icon={daoType.icon} width="1rem" />
		</div>
		<h4 class="w-medium">
			{daoType.title}
		</h4>
	</div>
	<div class="column-1">
		<div class="row-2 align-center off">
			<Icon icon="tabler:clock" />
			<span class="small off">
				{`Takes only ${daoType.estimatedTime} to create`}
			</span>
		</div>
		<div class="row-2 align-center off">
			<Icon icon="tabler:cash" />
			<span class="small off"> Cost: Free! </span>
		</div>
	</div>
</a>

<style lang="scss">
	a {
		text-decoration: none;
		color: var(--clr-text-main);
		transition: all 0.2s ease-in-out;
		cursor: pointer;
		background-color: var(--clr-surface-primary);
		justify-content: space-between;

		h4 {
			font-size: var(--font-size-5);
		}

		&:hover {
			background-color: var(--clr-surface-secondary);
		}

		.icon-wrapper {
			background-color: var(--clr-primary-badge);
			border-radius: 50%;
			width: 2rem;
			height: 2rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
