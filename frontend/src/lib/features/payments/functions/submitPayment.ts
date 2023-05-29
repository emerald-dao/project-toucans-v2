import type { DonationData, FundData } from '../types/payment-data.interface';
import { donateExecution, fundProjectExecution, transferProjectTokenToTreasuryExecution } from '$flow/actions';

export const submitPayment = async (paymentData: DonationData | FundData) => {
	if (paymentData.type === 'donation') {
		if (paymentData.currency === paymentData.daoTokenSymbol) {
			return await transferProjectTokenToTreasuryExecution(
				paymentData.daoAddress,
				paymentData.projectId,
				(paymentData.amount as number).toString(),
				paymentData.specialMessage
			)
		}
		return await donateExecution(
			paymentData.daoAddress,
			paymentData.projectId,
			(paymentData.amount as number).toString(),
			paymentData.specialMessage,
			paymentData.currency
		);
	} else {
		const expectedAmount = (paymentData.amount as number) * (0.95) *
			(paymentData as FundData).issuanceRate *
			(1 - (paymentData as FundData).reserveRate);
		return await fundProjectExecution(
			paymentData.daoAddress,
			paymentData.projectId,
			(paymentData.amount as number).toString(),
			paymentData.specialMessage,
			paymentData.currency,
			expectedAmount.toString()
		);
	}
};
