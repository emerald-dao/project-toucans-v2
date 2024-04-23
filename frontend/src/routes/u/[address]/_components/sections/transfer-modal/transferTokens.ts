export const transferTokens = (
	recipient: string,
	amount: number,
	projectOwner: string,
	projectId: string,
	currencyToDistribute: string
) => {
	alert(`Transfering ${currencyToDistribute} tokens to ${recipient}`);
};
