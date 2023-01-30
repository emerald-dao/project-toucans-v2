import { supabase } from '$lib/supabaseClient';
import { getProjectInfo } from '$flow/actions.js';
import '$flow/config.js';
import * as fcl from '@onflow/fcl';

export async function load({ params }) {
	const { data } = await supabase.from('projects').select().eq('contract_name', params.project);
	const info = data[0];
	const projectInfo = await getProjectInfo(
		info.contract_name,
		info.contract_address,
		info.owner,
		info.type
	);

	console.log(data);
	const thing = await fetchEvents();
	console.log(thing);

	return { ...info, ...projectInfo };
}

const fetchEvents = async () => {
	const latestBlock = await fcl.send([fcl.getBlock(true)]).then(fcl.decode);

	let end = latestBlock.height;

	console.log('block', latestBlock);

	// const response = await fcl.send([
	//   fcl.getEvents("A.f8d6e0586b0a20c7.bummm.TokensTransferred", end - 100, end)
	// ])
	const response = await fcl.send(
		await fcl.build([
			fcl.getEventsAtBlockHeightRange('A.f8d6e0586b0a20c7.bummm.TokensTransferred', 0, end)
		])
	);
};
