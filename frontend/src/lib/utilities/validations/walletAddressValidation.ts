export const isValidFlowWallet = (walletAddress: string) => {
	return walletAddress.length === 18 && walletAddress.startsWith('0x');
};
