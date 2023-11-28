<script lang="ts">
	import { user } from '$stores/flow/FlowStore';
	import { logIn, unauthenticate } from '$flow/actions';
	import { FlowConnect } from '@emerald-dao/component-library';
</script>

<section>
	<div>
		<div class="column-2">
			<h2 class="h4">Welcome</h2>
			<p>Please connect your Flow wallet to continue</p>
		</div>
		<FlowConnect {logIn} {unauthenticate} {$user} />
	</div>
	<div>
		<p class="h5">
			<strong>Flow blockchain</strong> is designed to be fast, secure, scalable and developer friendly.
		</p>
		<p class="h5">
			It offers first-in-class technology to onboard main-stream users to blockchain technology.
		</p>
		<p class="h5">
			We believe in this goal. Join us on <a
				href="https://discord.gg/emerald-city-906264258189332541"
				target="_blank"
				rel="noreferrer">discord</a
			>
			to build the future <strong>#onFlow</strong> together.
		</p>
	</div>
</section>

<style lang="scss">
	section {
		display: grid;
		grid-template-columns: 2fr 3fr;
		flex: 1;
		padding: 0;

		& > div {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: var(--space-4);

			&:first-child {
				background-color: var(--clr-background-secondary);
				border-right: 0.5px solid var(--clr-border-primary);
				align-items: flex-start;
				padding: var(--space-20);
			}

			&:last-child {
				padding: var(--space-22);
				& > p {
					color: var(--clr-text-main);

					& > strong {
						color: var(--clr-heading-main);
					}
				}
			}
		}
	}
</style>
