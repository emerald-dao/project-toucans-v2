import {
	descriptionValidation,
	longDescriptionValidation
} from '$lib/utilities/validations/descriptionValidation';
import { create } from 'vest';

const validationSuite = create((data = {}) => {
	descriptionValidation(data.description);

	longDescriptionValidation(data.longDescription);
});

export default validationSuite;
