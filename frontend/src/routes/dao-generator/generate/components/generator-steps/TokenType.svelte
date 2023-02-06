<script type="ts">
	import { Row } from '@mateoroldos/svelte.bones';
	import Icon from '@iconify/svelte';
	import StepButtons from './atoms/StepButtons.svelte';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';
	import { TokenTypes } from '$lib/types/token-types.enum';
</script>

<form
	id={$generatorSteps[$generatorActiveStep].slug}
	on:submit|preventDefault={generatorActiveStep.increment}
>
	<input
		type="radio"
		id="financial"
		name="tokenType"
		bind:group={$daoData.tokenomics.tokenType}
		value={TokenTypes.FINANCIAL}
	/>
	<label for="financial">
		<div class="header-wrapper">
			<div
				class="icon-wrapper"
				class:active={$daoData.tokenomics.tokenType === TokenTypes.FINANCIAL}
			>
				<Icon icon="tabler:pig-money" width="1.1em" />
			</div>
			<h4>Financial</h4>
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
		bind:group={$daoData.tokenomics.tokenType}
		value={TokenTypes.COMMUNITY}
	/>
	<label for="community">
		<div class="header-wrapper">
			<div
				class="icon-wrapper"
				class:active={$daoData.tokenomics.tokenType === TokenTypes.COMMUNITY}
			>
				<Icon icon="tabler:affiliate" width="1.1em" />
			</div>
			<h4>Community</h4>
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
			border: 2px var(--clr-neutral-300) solid;
			width: 100%;
			border-radius: 1rem;
			cursor: pointer;
			font-size: var(--fs-300);
			--font-weight: 300;
			background-color: var(--clr-neutral-300-t9);
			transition: 0.2s;

			.header-wrapper {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				margin-bottom: 0.8rem;
				gap: 0.7em;

				.icon-wrapper {
					background-color: red;
					display: grid;
					place-content: center;
					padding: 0.4em;
					border-radius: 50%;
					background-color: var(--clr-neutral-300-t7);
					transition: 0.2s;
				}
				.icon-wrapper.active {
					background-color: var(--clr-primary-main-t9);
					color: var(--clr-primary-main);
				}

				h4 {
					font-size: var(--fs-400);
				}
			}
		}

		input:checked + label {
			border-color: var(--clr-primary-main);
		}
	}
</style>
