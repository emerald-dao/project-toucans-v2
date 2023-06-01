import {
	descriptionValidation,
	longDescriptionValidation
} from '$lib/utilities/validations/descriptionValidation';
import { create, only, optional } from 'vest';

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	optional(['longDescription']);

	descriptionValidation(data.description);

	longDescriptionValidation(data.longDescription);
});

export default validationSuite;
