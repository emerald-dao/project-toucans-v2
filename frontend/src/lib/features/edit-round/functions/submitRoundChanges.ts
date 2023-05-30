const submitRoundChanges = (data: RoundChangesData) => {
	console.log(data);
};

export interface RoundChangesData {
	issuanceRate: number;
	fundingTarget: number;
	startDate: string;
	endDate: string;
}

export default submitRoundChanges;
