import { ZonedDateTime, fromDate, getLocalTimeZone } from '@internationalized/date';
import { create, enforce, skipWhen, test } from 'vest';

const validationSuite = create((startDate: string | undefined, endDate: string | undefined) => {
	const startDateLocalized = startDate
		? fromDate(new Date(startDate), getLocalTimeZone())
		: undefined;
	const endDateLocalized = endDate ? fromDate(new Date(endDate), getLocalTimeZone()) : undefined;
	const nowLocalized = fromDate(new Date(), getLocalTimeZone());

	skipWhen(startDateLocalized === undefined, () => {
		test('start-date', 'Your votation start date must be in the future!', () => {
			return !((startDateLocalized as ZonedDateTime).compare(nowLocalized) < 0);
		});
	});

	test('end-date', 'Your votation needs an end date!', () => {
		enforce(endDate).isNotBlank();
	});

	test('end-date', 'Your votation end date must be at least one hour after now!', () => {
		if (endDateLocalized) {
			if (endDateLocalized.compare(nowLocalized.add({ hours: 1 })) < 0) {
				return false;
			}
		}

		return true;
	});

	skipWhen(startDateLocalized === undefined, () => {
		test('end-date', 'Your votation end date must be at least one hour after start date', () => {
			return !(
				(endDateLocalized as ZonedDateTime).compare(
					(startDateLocalized as ZonedDateTime).add({ hours: 1 })
				) < 0
			);
		});
	});
});

export default validationSuite;
