import type { DonationData, FundData } from '../types/payment-data.interface';
import {
	donateExecution,
	donateNFTsExecution,
	fundProjectExecution,
	transferProjectTokenToTreasuryExecution
} from '$flow/actions';

export const submitPayment = async (paymentData: DonationData | FundData) => {
	if (paymentData.type === 'donation') {
		if (
			paymentData.NFTs &&
			paymentData.NFTCollection &&
			paymentData.currency === 'NFTs' &&
			paymentData.NFTs.length > 0
		) {
			return await donateNFTsExecution(
				paymentData.daoAddress,
				paymentData.projectId,
				paymentData.NFTs,
				paymentData.NFTCollection,
				paymentData.specialMessage
			);
		} else if (paymentData.currency === paymentData.daoTokenSymbol) {
			return await transferProjectTokenToTreasuryExecution(
				paymentData.daoAddress,
				paymentData.contractAddress as string,
				paymentData.projectId,
				(paymentData.amount as number).toString(),
				paymentData.specialMessage
			);
		}
		return await donateExecution(
			paymentData.daoAddress,
			paymentData.projectId,
			(paymentData.amount as number).toString(),
			paymentData.specialMessage,
			paymentData.currency
		);
	} else {
		const expectedAmount =
			(paymentData.amount as number) *
			0.98 *
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
