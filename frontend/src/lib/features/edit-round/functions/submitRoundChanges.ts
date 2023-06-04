import { editRoundExecution } from '$flow/actions';

const submitRoundChanges = async (data: RoundChangesData) => {
	console.log(data);

	return await editRoundExecution(
		data.projectId,
		data.cycleIndex,
		data.startDate,
		data.endDate,
		data.reserveRate,
		data.issuanceRate.toString(),
		data.fundingTarget.toString()
	);
};

export interface RoundChangesData {
	issuanceRate: number;
	fundingTarget: number;
	startDate: string;
	endDate: string;
	reserveRate: number;
	projectId: string;
	cycleIndex: number;
}

export default submitRoundChanges;
