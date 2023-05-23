import type { ECurrencies } from '../../common/enums';

export interface RoundData {
	startDate: string;
	endDate: string;
	fundingGoal: number | undefined;
	projectId: string | undefined;
	currency: ECurrencies;
	infiniteDuration: boolean;
	infiniteFundingGoal: boolean;
	distributionList: [string, number][];
	issuanceRate: number | undefined;
	reserveRate: number;
	allowOverflow: boolean;
	requiredNft: string | null;
}
