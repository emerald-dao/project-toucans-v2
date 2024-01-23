export const DAO_TYPES = [
	{
		title: 'DAO',
		description:
			'This option will launch a DAO. It will set up a multi-sig treasury, the ability to donate, vote, and more. It will not create a token upon deployment.',
		icon: 'tabler:users',
		slug: 'dao',
		estimatedTime: '3 minutes'
	},
	{
		title: 'DAO + Token',
		description:
			'This option will do everything the DAO option does as well as deploy a new fungible token on the Flow blockchain for you to fundraise with, mint, trade, and more.',
		icon: 'tabler:coin',
		slug: 'dao-token',
		estimatedTime: '5 minutes'
	}
];

export type DaoType = (typeof DAO_TYPES)[number];
