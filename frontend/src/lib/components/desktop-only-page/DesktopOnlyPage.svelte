<script lang="ts">
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
</script>

<section class="container-small column-8 center">
	<h4>For better user experience, this page is only available on desktop.</h4>
	<Button href="/">
		<Icon icon="tabler:home" />
		Home
	</Button>
</section>

<style lang="scss">
	section {
		display: flex;
		flex: 1;

		h4 {
			text-align: center;
		}
	}
</style>
