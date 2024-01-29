import type { Vote } from '$lib/types/dao-project/bot-votes/votes.interface';

export const VOTING_ROUNDS_MOCK: Vote[] = [
	{
		title: 'New logo',
		description:
			'sit ad nostrud esse amet culpa proident excepteur voluptate proident eu ut aute dolore sit sint enim magna excepteur enim.',
		for_total: 43,
		against_total: 23,
		created_at: '2021-10-07T20:00:00.000Z',
		pending: false,
		type: 'Toucans',
		discord_message_link: 'https://discord.com',
		votes: [
			{
				voter: '0x1234567890123456789012345678901234567890'
			}
		]
	},
	{
		title: 'Vote 2',
		description: 'Description 2',
		for_total: 0,
		against_total: 1,
		created_at: '2021-10-07T20:00:00.000Z',
		pending: false,
		type: 'Toucans Action',
		discord_message_link: 'https://discord.com',
		toucans_action_id: 1,
		votes: [
			{
				voter: '0x1234567890123456789012345678901234567890'
			}
		]
	}
];
