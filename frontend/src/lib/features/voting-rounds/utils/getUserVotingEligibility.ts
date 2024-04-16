import { getCatalogNFTs, getTokenBalance } from '$flow/actions';
import { supabase } from '$lib/supabaseClient';
import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
import type { Vote } from '$lib/utilities/api/supabase/fetchVotingRoundVotes';
import type { VotingRoundStatus } from '../components/voting-widget/voting-round-status.type';

export interface VotingEligibility {
	eligible: boolean;
	reason?:
		| 'required-nfts-not-owned'
		| 'required-nfts-already-used'
		| 'required-tokens-not-owned'
		| 'already-voted'
		| 'not-connected'
		| 'voting-round-ended'
		| null;
	availableNfts?: string[];
	availableTokens?: number;
}

export const getUserVotingEligibility = async (
	userAddress: string | null,
	votingRound: VotingRound,
	votingRoundStatus: VotingRoundStatus,
	votes: Vote[] | null,
	tokenContractAddress: string | null
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
				votingRound.start_date ?? votingRound.created_at,
				votingRound.end_date
			);
		}

		if (eligibleNftsIds.length === 0) {
			return {
				eligible: false,
				reason: 'required-nfts-not-owned'
			};
		}

		let usedNftsUuids: string[] = [];

		if (votes) {
			votes.forEach((vote) => {
				if (vote.nft_uuids) {
					usedNftsUuids = usedNftsUuids.concat(vote.nft_uuids);
				}
			});
		} else {
			const { data: usedNfts, error } = await supabase
				.from('votes')
				.select('nft_uuids')
				.eq('voting_round_id', votingRound.id);

			if (error) {
				console.error('Error fetching used NFTs', error);
				throw error;
			}

			usedNfts.map((vote) => {
				if (vote.nft_uuids) {
					usedNftsUuids = usedNftsUuids.concat(vote.nft_uuids);
				}
			});
		}

		const availableNfts = eligibleNftsIds.filter(
			(nftId) => !usedNftsUuids.some((usedNftUuid) => usedNftUuid === nftId)
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

	let userVotes: Vote[];

	if (votes) {
		userVotes = votes.filter((vote) => vote.wallet_address === userAddress);
	} else {
		const { error, data } = await supabase
			.from('votes')
			.select('*')
			.eq('voting_round_id', votingRound.id)
			.eq('wallet_address', userAddress);

		if (error) {
			console.error('Error fetching user votes', error);
			throw error;
		}

		userVotes = data;
	}

	const amountOfVotes =
		votingRound.nft_mode === 'token-holders'
			? userVotes.reduce((acc, vote) => acc + Number(vote.amount_of_tokens), 0)
			: userVotes.length;

	if (votingRound.nft_mode === 'token-holders' && tokenContractAddress) {
		const userBalance = await getTokenBalance(
			votingRound.project_id,
			tokenContractAddress,
			userAddress
		);

		if (!userBalance || userBalance === 0) {
			return {
				eligible: false,
				reason: 'required-tokens-not-owned'
			};
		}

		if (amountOfVotes >= userBalance) {
			return {
				eligible: false,
				reason: 'already-voted'
			};
		}

		return {
			eligible: true,
			availableTokens: userBalance - amountOfVotes
		};
	}

	if (amountOfVotes !== null && amountOfVotes > 0) {
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

	if (!nfts[collectionId]) {
		return [];
	}

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
		.eq('data->>by', walletAddress)
		.eq('data->>collectionIdentifier', collectionId);
	// .gte('timestamp', startDate)
	// .lte('timestamp', endDate);

	if (error) {
		console.log(error);
		throw error;
	}

	// Calculate total amount donated by the specified user
	let nftsDonated: string[] = [];
	data.forEach((event) => {
		const { uuids } = event.data;

		if (uuids) {
			nftsDonated = nftsDonated.concat(uuids);
		}
	});

	return nftsDonated;
};
