import { supabase } from '$lib/supabaseClient';
import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
import type { User } from '@emerald-dao/component-library/models/user.interface';

export const getUserVotingEligibility = async (
	user: User,
	votingRound: VotingRound
): Promise<{
	eligible: boolean;
	reason?: 'required-nfts-not-owned' | 'required-nfts-already-used' | 'already-voted' | null;
	availableNfts?: string[];
}> => {
	// CHECK NFT MODE CASES
	if (
		(votingRound.nft_mode === 'nft-holders' || votingRound.nft_mode === 'nft-donators') &&
		votingRound.required_nft_collection_id
	) {
		let eligibleNftsIds: string[] = [];

		if (votingRound.nft_mode === 'nft-holders') {
			eligibleNftsIds = await getUserNftsFromCollection(
				user.addr,
				votingRound.required_nft_collection_id
			);
		} else if (votingRound.nft_mode === 'nft-donators') {
			eligibleNftsIds = await getUserDonatedNftsFromCollection(
				user.addr,
				votingRound.required_nft_collection_id,
				votingRound.project_id
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

	// CHECK NO NFT MODE CASE
	const { data: votes, error } = await supabase
		.from('votes')
		.select('count(*)')
		.eq('voting_round_id', votingRound.id)
		.eq('wallet_address', user.addr);

	if (error) {
		console.error('Error fetching votes', error);
		throw error;
	}

	if (votes.length > 0) {
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
	// todo - fetch all the NFTs owned by the user from the collection

	return [''];
};

const getUserDonatedNftsFromCollection = async (
	walletAddress: string,
	collectionId: string,
	projectId: string
): Promise<string[]> => {
	// todo - fetch all the NFTs donated by the user from the collection to the project

	return [''];
};
