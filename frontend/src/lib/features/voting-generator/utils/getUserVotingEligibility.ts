import { getCatalogNFTs } from '$flow/actions';
import { supabase } from '$lib/supabaseClient';
import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
import type { VotingRoundStatus } from '../../../../routes/p/[projectId]/voting-rounds/[votingRoundId]/_components/voting-widget/voting-round-status.type';

export interface VotingEligibility {
	eligible: boolean;
	reason?:
	| 'required-nfts-not-owned'
	| 'required-nfts-already-used'
	| 'already-voted'
	| 'not-connected'
	| 'voting-round-ended'
	| null;
	availableNfts?: string[];
}

export const getUserVotingEligibility = async (
	userAddress: string | null,
	votingRound: VotingRound,
	votingRoundStatus: VotingRoundStatus
): Promise<VotingEligibility> => {
	if (votingRoundStatus === 'ended') {
		return {
			eligible: false,
			reason: 'voting-round-ended'
		};
	}

	if (!userAddress) {
		return {
			eligible: false,
			reason: 'not-connected'
		};
	}

	if (
		(votingRound.nft_mode === 'nft-holders' || votingRound.nft_mode === 'nft-donators') &&
		votingRound.required_nft_collection_id
	) {
		let eligibleNftsIds: string[] = [];

		if (votingRound.nft_mode === 'nft-holders') {
			eligibleNftsIds = await getUserNftsFromCollection(
				userAddress,
				votingRound.required_nft_collection_id
			);
		} else if (votingRound.nft_mode === 'nft-donators') {
			eligibleNftsIds = await getUserDonatedNftsFromCollection(
				userAddress,
				votingRound.required_nft_collection_id,
				votingRound.project_id,
				votingRound.start_date,
				votingRound.end_date
			);
		}

		if (eligibleNftsIds.length === 0) {
			return {
				eligible: false,
				reason: 'required-nfts-not-owned'
			};
		}

		// CHECK USED NFTS
		const { data: usedNfts, error } = await supabase
			.from('votes')
			.select('nft_uuid')
			.eq('voting_round_id', votingRound.id)
			.in('nft_uuid', eligibleNftsIds);

		if (error) {
			console.error('Error fetching used NFTs', error);
			throw error;
		}

		const availableNfts = eligibleNftsIds.filter(
			(nftId) => !usedNfts.some((usedNft) => usedNft.nft_uuid === nftId)
		);

		if (availableNfts.length === 0) {
			return {
				eligible: false,
				reason: 'required-nfts-already-used'
			};
		}

		return {
			eligible: true,
			availableNfts
		};
	}

	const { error, count } = await supabase
		.from('votes')
		.select('*', { count: 'exact', head: true })
		.eq('voting_round_id', votingRound.id)
		.eq('wallet_address', userAddress);

	if (error) {
		console.error('Error fetching votes', error);
		throw error;
	}

	if (count !== null && count > 0) {
		return {
			eligible: false,
			reason: 'already-voted'
		};
	}

	return {
		eligible: true
	};
};

const getUserNftsFromCollection = async (
	walletAddress: string,
	collectionId: string
): Promise<string[]> => {
	const nfts = await getCatalogNFTs([collectionId], walletAddress);

	return Object.values(nfts[collectionId]).map((nft) => nft.id);
};

const getUserDonatedNftsFromCollection = async (
	walletAddress: string,
	collectionId: string,
	projectId: string,
	startDate: string,
	endDate: string
): Promise<string[]> => {
	const { data, error } = await supabase
		.from('events')
		.select('data, project_id, timestamp, type')
		.eq('type', 'DonateNFT')
		.eq('project_id', projectId)
		.eq('data:by->>', walletAddress)
		.eq('data:collectionIdentifier->>', collectionId)
		.gte('timestamp', startDate)
		.lte('timestamp', endDate);

	if (error) {
		throw error;
	}

	// Calculate total amount donated by the specified user
	let nftsDonated: string[] = [];
	data.forEach(event => {
		const { uuids } = event.data;
		if (uuids) {
			nftsDonated = nftsDonated.concat(uuids);
		}
	});

	return nftsDonated;
};
