import { proposeWithdrawNFTsExecution } from '$flow/actions';
import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

export const withdrawNFTs = async (
	daoData: DAOProject,
	collectionIdentifier: string,
	nftIds: string[],
	recipient: string,
	reasonMessage: string
) => {
	return await proposeWithdrawNFTsExecution(
		daoData.generalInfo.owner,
		daoData.generalInfo.project_id,
		collectionIdentifier,
		nftIds,
		recipient,
		reasonMessage
	);
};
