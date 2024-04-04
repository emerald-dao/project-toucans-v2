import { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';

export const GET = async () => {
	const rankings = await fetchDaoRankings();

	const totalTreasuryValue = rankings.reduce((acc, curr) => acc + curr.treasury_value, 0);

	// DAOs with +$500 treasury value or +100 participants
	const amountOfBigDaos = rankings.filter(
		(x) => x.treasury_value > 500 || x.num_participants >= 100
	).length;

	const projectsWithTokenValue = rankings.filter(
		(x) => x.price && x.liquidity_amount && x.liquidity_amount >= 50
	);
	const totalMarketCap = projectsWithTokenValue.reduce(
		(acc, curr) => acc + curr.price * curr.total_supply,
		0
	);

	return new Response(JSON.stringify({ totalTreasuryValue, totalMarketCap, amountOfBigDaos }), {
		status: 201
	});
};
