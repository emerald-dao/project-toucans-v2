import type { Currencies } from "./currencies.enum";

export interface RoundData {
    startDate: string;
    endDate: string;
    fundingGoal: number | undefined;
    projectId: string;
    currency: Currencies;
    infiniteDuration: boolean;
    infiniteFundingGoal: boolean;
    distributionList: [string, number][];
    issuanceRate: number | undefined;
    reserveRate: number | undefined;
}