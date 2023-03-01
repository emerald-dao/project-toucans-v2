<script type="ts">
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import StepButtons from './atoms/StepButtons.svelte';
	import { daoGeneratorData } from '$stores/generator/DaoDataStore';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import { TokenTypes } from '$lib/types/common/token-types.enum';
</script>

<form
	id={$generatorSteps[$generatorActiveStep].slug}
	on:submit|preventDefault={generatorActiveStep.increment}
	in:fly="{{ y: 30, duration: 400 }}"
>
	<input
		type="radio"
		id="financial"
		name="tokenType"
		bind:group={$daoGeneratorData.tokenomics.tokenType}
		value={TokenTypes.FINANCIAL}
	/>
	<label for="financial">
		<div class="header-wrapper">
			<div
				class="icon-wrapper"
			>
				<Icon icon="tabler:pig-money" width="1.1em" />
			</div>
			<h4>Financial Token</h4>
		</div>
		<span>
			Consectetur esse aliqua mollit sit sint sunt irure ad excepteur et amet irure. Eiusmod culpa
			est adipisicing amet pariatur enim et eiusmod do ut tempor qui ea.
		</span>
	</label>
	<input
		type="radio"
		id="community"
		name="tokenType"
		bind:group={$daoGeneratorData.tokenomics.tokenType}
		value={TokenTypes.COMMUNITY}
	/>
	<label for="community">
		<div class="header-wrapper">
			<div
				class="icon-wrapper"
			>
				<Icon icon="tabler:affiliate" width="1.1em" />
			</div>
			<h4>Community Token</h4>
		</div>
		<span>
			Consectetur esse aliqua mollit sit sint sunt irure ad excepteur et amet irure. Eiusmod culpa
			est adipisicing amet pariatur enim et eiusmod do ut tempor qui ea.
		</span>
	</label>

	<StepButtons />
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: 2rem;

		input {
			display: none;
		}

		label {
			padding: 2rem;
			border: 1px var(--clr-border-primary) solid;
			width: 100%;
			border-radius: 1rem;
			cursor: pointer;
			--font-weight: 300;
			background-color: var(--clr-background-secondary);
			transition: 0.2s;
			color: var(--clr-text-off);

			.header-wrapper {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				margin-bottom: 0.8rem;
				gap: var(--space-3);

				.icon-wrapper {
					display: grid;
					place-content: center;
					padding: 0.4em;
					border-radius: 50%;
					transition: 0.2s;
					border: 1px var(--clr-border-primary) solid;
				}

				h4 {
					font-size: var(--font-size-4);
					color: var(--clr-font-text);
				}
			}
		}

		input:checked + label {
			border-color: var(--clr-font-header);
			color: var(--clr-text-primary);

			.icon-wrapper {
				background-color: var(--clr-tertiary-badge);
				color: var(--clr-tertiary-main);
				border: 1px var(--clr-tertiary-main) solid;
			}

			h4 {
				color: var(--clr-heading-main);
			}
		}
	}
</style>
