import { descriptionValidation } from '$lib/utilities/validations/descriptionValidation';
import { create } from 'vest';

const validationSuite = create((data = {}) => {
	descriptionValidation(data.description);
});

export default validationSuite;
