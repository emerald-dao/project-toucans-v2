import { supabase } from '$lib/supabaseClient';

export async function fetchDaoFundingInfo(projectId: string) {
	const { data: fundingStats } = await supabase
		.from('rankings')
		.select('numbers, total_funding')
		.eq('project_id', projectId);
	const { data: funders } = await supabase
		.from('user_funding')
		.select('address, amount, num_nfts')
		.eq('project_id', projectId);

	return {
		...(fundingStats ? fundingStats[0] : {}),
		funders: (funders || []).reduce(
			(obj, item) =>
				Object.assign(obj, { [item.address]: { amount: item.amount, num_nfts: item.num_nfts } }),
			{}
		)
	};
}
