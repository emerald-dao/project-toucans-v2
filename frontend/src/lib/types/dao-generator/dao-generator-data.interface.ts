export interface DaoGeneratorData {
	daoDetails: {
		name: string;
		tokenName: string;
		description: string;
		website: string;
		twitter: string;
		discord: string;
		contractName: string;
		logo: File[] | undefined;
	};
	tokenomics: {
		// tokenType: TokenTypes;
		totalSupply: number | undefined;
		editDelay: string | undefined;
		mintTokens: boolean;
	};
}
