<script lang="ts">
	import { Button } from '@emerald-dao/component-library';
</script>

<section class="section-large">
	<div class="container-small linear-gradient">
		<div class="column-3 align-center">
			<h2 class="w-medium">Ready to give super powers to your community?</h2>
			<p>Unlock transparent funding and governance on the Flow Blockchain.</p>
		</div>
		<Button color="primary" size="large" width="extended" href="/dao-generator">
			Create your DAO for free in just 5 minutes!
		</Button>
	</div>
</section>

<style lang="scss">
	section {
		background-color: var(--clr-background-secondary);
		border-block: 1px solid var(--clr-neutral-badge);

		.container-small {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 60px;
			gap: var(--space-8);
			border-radius: 20px;
			border-color: var(--clr-border-primary);
			text-align: center;
			border: 1px;

			p {
				font-size: var(--font-size-3);
				line-height: 30px;
			}

			h2 {
				font-size: var(--font-size-7);
			}
		}
		.linear-gradient {
			background: linear-gradient(
				180deg,
				var(--clr-background-secondary) 50%,
				var(--clr-primary-main) 1000%
			);
			border-radius: var(--radius-3);
			border: 1px solid var(--clr-border-primary);
		}
	}
</style>
