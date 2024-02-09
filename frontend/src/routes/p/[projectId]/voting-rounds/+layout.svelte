<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let data;
</script>

<section class="container column-8">
	<div class="row-14 align-center">
		<Button href={`/p/${$page.params.projectId}`} color="neutral" type="transparent">
			<Icon icon="tabler:arrow-left" />
			DAO Profile
		</Button>
		<div class="row-3 align-center">
			<img src={`${data.generalInfo.logo}`} alt="DAO logo" width="40px" height="40px" />
			<h1>
				{data.generalInfo.name}
				<span> voting rounds </span>
			</h1>
		</div>
	</div>
	<slot />
</section>

<style lang="scss">
	section {
		flex: 1;

		img {
			border-radius: var(--radius-0);
		}

		h1 {
			font-size: var(--font-size-5);

			span {
				color: var(--clr-text-off);
			}
		}
	}
</style>
