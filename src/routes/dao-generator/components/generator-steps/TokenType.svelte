<script type="ts">
	import { TokenTypes } from '$lib/types/token-types.enum';
	import { createForm } from 'felte';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { generatorSteps, generatorActiveStep } from '$stores/generator/GeneratorSteps';

	const { form } = createForm({
		onSubmit() {
			generatorActiveStep.increment();
		}
	});
</script>

<form use:form id={$generatorSteps[$generatorActiveStep].slug}>
	<input
		type="radio"
		id="financial"
		name="tokenType"
		bind:group={$daoData.tokenomics.tokenType}
		value={TokenTypes.FINANCIAL}
	/>
	<label for="financial">
		<h4>Financial</h4>
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
		<h4>Community</h4>
		<span>
			Consectetur esse aliqua mollit sit sint sunt irure ad excepteur et amet irure. Eiusmod culpa
			est adipisicing amet pariatur enim et eiusmod do ut tempor qui ea.
		</span>
	</label>
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
			border: 0.5px var(--clr-neutral-900) solid;
			width: 100%;
			border-radius: 1rem;
			cursor: pointer;
			font-size: var(--fs-300);

			h4 {
				margin-bottom: 0.8rem;
			}
		}

		input:checked + label {
			color: var(--clr-primary-main);
			border: 0.5px var(--clr-primary-main) solid;

			h4 {
				color: var(--clr-primary-main);
			}
		}
	}
</style>
