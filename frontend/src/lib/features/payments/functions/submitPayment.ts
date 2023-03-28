import type { DonationData, FundData } from '../types/payment-data.interface';
import { donateExecution, fundProjectExecution } from '$flow/actions';

export const submitPayment = async (paymentData: DonationData | FundData) => {
	if (paymentData.type === 'donation') {
		const paymentResult = await donateExecution(
			paymentData.daoAddress,
			paymentData.projectId,
			(paymentData.amount as number).toString(),
			paymentData.specialMessage,
			paymentData.currency
		);

		return paymentResult;
	} else {

		const expectedAmount = (paymentData.amount as number) *
			(paymentData as FundData).issuanceRate *
			(1 - (paymentData as FundData).reserveRate);
		const paymentResult = await fundProjectExecution(
			paymentData.daoAddress,
			paymentData.projectId,
			(paymentData.amount as number).toString(),
			paymentData.specialMessage,
			paymentData.currency,
			expectedAmount
		);

		return paymentResult;
	}
};
