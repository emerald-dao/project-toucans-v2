import { create, enforce, test } from 'vest';

const validationSuite = create((data: string) => {
	test(`event-id`, 'Event ID should be 64 chars long', () => {
		enforce(data.length).equals(64);
	});
});

export default validationSuite;
