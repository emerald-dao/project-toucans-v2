import {
	discordValidations,
	twitterValidations,
	websiteValidations
} from '$lib/utilities/validations/socialsValidations';
import { descriptionValidation } from '$lib/utilities/validations/descriptionValidation';
import { create, only, optional } from 'vest';

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	optional(['website', 'discord', 'twitter', 'description']);

	descriptionValidation(data.description);

	websiteValidations(data.website);

	twitterValidations(data.twitter);

	discordValidations(data.discord);
});

export default validationSuite;
