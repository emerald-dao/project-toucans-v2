import type { VotingOption } from '$lib/features/voting-rounds/types/voting-option.interface';
import { create, test, each, enforce } from 'vest';

const validationSuite = create((votingOptions: VotingOption[]) => {
	each(votingOptions, (option) => {
		test(
			`option-name-${option.id}`,
			'Option name is required',
			() => {
				enforce(option.name).isNotEmpty();
			},
			option.id
		);
	});

	each(votingOptions, (option) => {
		test(
			`option-name-${option.id}`,
			'Option name should be shorter than 40 characters',
			() => {
				enforce(option.name).shorterThanOrEquals(40);
			},
			option.id
		);
	});

	each(votingOptions, (option) => {
		test(
			`option-description-${option.id}`,
			'Option description should be shorter than 70 characters',
			() => {
				enforce(option.description).shorterThanOrEquals(70);
			},
			option.id
		);
	});

	each(votingOptions, (option) => {
		test(
			`option-name-${option.id}`,
			'Option name should be unique',
			() => {
				const thisFieldIndex = votingOptions.findIndex(
					(votingOption) => votingOption.id === option.id
				);
				const previousNames = votingOptions
					.slice(0, thisFieldIndex)
					.map((votingOption) => votingOption.name);

				enforce(option.name).notInside(previousNames);
			},
			option.id
		);
	});
});

export const reset = validationSuite.reset;

export default validationSuite;
