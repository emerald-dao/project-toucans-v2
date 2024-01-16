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

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	optional(['website', 'discord', 'twitter', 'description', 'longDescription']);

	descriptionValidation(data.description);

	longDescriptionValidation(data.long_description);

	websiteValidations(data.website);

	twitterValidations(data.twitter);

	discordValidations(data.discord);
});

export default validationSuite;
