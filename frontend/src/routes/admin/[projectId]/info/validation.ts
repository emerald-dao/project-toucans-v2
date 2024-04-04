import {
	discordValidations,
	twitterValidations,
	websiteValidations
} from '$lib/utilities/validations/socialsValidations';
import {
	descriptionValidation,
	longDescriptionValidation
} from '$lib/utilities/validations/descriptionValidation';
import { create, only, optional } from 'vest';
import { nameValidation } from '$lib/utilities/validations/nameValidation';

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	optional(['website', 'discord', 'twitter', 'name', 'description', 'longDescription']);

	nameValidation(data.name);

	descriptionValidation(data.description);

	longDescriptionValidation(data.long_description);

	websiteValidations(data.website);

	twitterValidations(data.twitter);

	discordValidations(data.discord);
});

export default validationSuite;
