<script type="ts">
	import { createForm } from 'felte';
	import { daoData } from '$stores/generator/DaoDataStore';
	import { Column } from '@mateoroldos/svelte.bones';

	let daoDetails = $daoData.daoDetails;
	const { form } = createForm({
		onSubmit: (values) => {
			// ...
		}
	});
</script>

<Column gap="small">
	<input type="radio" id="financial" name="tokenType" />
	<label for="financial">
		<h4>Financial</h4>
		<span>
			Consectetur esse aliqua mollit sit sint sunt irure ad excepteur et amet irure. Eiusmod culpa
			est adipisicing amet pariatur enim et eiusmod do ut tempor qui ea.
		</span>
	</label>
	<input type="radio" id="community" name="tokenType" />
	<label for="community">
		<h4>Community</h4>
		<span>
			Consectetur esse aliqua mollit sit sint sunt irure ad excepteur et amet irure. Eiusmod culpa
			est adipisicing amet pariatur enim et eiusmod do ut tempor qui ea.
		</span>
	</label>
</Column>

<style type="scss">
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
</style>
