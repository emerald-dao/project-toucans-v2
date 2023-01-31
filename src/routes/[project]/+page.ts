import { supabase } from '$lib/supabaseClient';
import { getProjectInfo } from '$flow/actions.js';
import '$flow/config.js';
import type { FinancialDao, CommunityDao } from '$lib/types/dao-project.interface';

export async function load({
	params
}: {
	params: { project: string };
}): Promise<FinancialDao | CommunityDao> {
	const { data } = await supabase.from('projects').select().eq('contract_name', params.project);
	if (!data || !data.length) {
		throw new Error('No dao found');
	}
	const [info] = data;

	const projectInfo = await getProjectInfo(
		info.contract_name,
		info.contract_address,
		info.owner,
		info.type
	);

	// const thing = await fetchEvents();

	return {
		...info,
		...projectInfo
	};
}

// const fetchEvents = async () => {
// 	const latestBlock = await fcl.send([fcl.getBlock(true)]).then(fcl.decode);

// 	let end = latestBlock.height;

// 	console.log('block', latestBlock);

// 	// const response = await fcl.send([
// 	//   fcl.getEvents("A.f8d6e0586b0a20c7.bummm.TokensTransferred", end - 100, end)
// 	// ])
// 	const response = await fcl.send(
// 		await fcl.build([
// 			fcl.getEventsAtBlockHeightRange('A.f8d6e0586b0a20c7.bummm.TokensTransferred', 0, end)
// 		])
// 	);
// };
