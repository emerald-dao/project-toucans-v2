import { user } from '$stores/flow/FlowStore';
import { get } from 'svelte/store';

export const navElements = [
	{
		name: 'Generate DAO',
		url: '/dao-generator',
		prefetch: true
	},
	{
		name: 'Discover',
		url: '/discover',
		prefetch: true
	},
	{
		name: 'Docs',
		url: 'https://docs.ecdao.org/products/toucans',
		prefetch: true,
		target: '_blank'
	}
];

export const emeraldTools = [
	{
		name: 'Emerald Academy',
		url: 'https://academy.ecdao.org/'
	},
	{
		name: 'FLOAT',
		url: 'https://floats.city/'
	},
	{
		name: 'Emerald Bot',
		url: 'https://bot.ecdao.org/'
	},
	{
		name: 'Touchstone',
		url: 'https://touchstone.city/'
	},
	{
		name: 'Toucans',
		url: 'https://toucans.ecdao.org/'
	}
];

export const socialMedia = [
	{
		name: 'Twitter',
		url: 'https://twitter.com/emerald_dao',
		icon: 'ion:logo-twitter'
	},
	{
		name: 'Github',
		url: 'https://github.com/emerald-dao',
		icon: 'ion:logo-github'
	},
	{
		name: 'Discord',
		url: 'https://discord.gg/emerald-city-906264258189332541',
		icon: 'ion:logo-discord'
	}
];

export const avatarDropdownNav = [
	{
		name: 'Profile',
		url: `/u/${get(user)?.addr}`,
		prefetch: true,
		icon: 'tabler:user'
	},
	{
		name: 'DAO Manager',
		url: '/admin',
		prefetch: true,
		icon: 'tabler:adjustments'
	},
	{
		name: 'Pending Actions',
		url: '/signatures-queue',
		prefetch: true,
		icon: 'tabler:pencil-plus',
		notifications: 0
	},
	{
		name: 'Create DAO',
		url: '/dao-generator',
		prefetch: true,
		icon: 'tabler:square-rounded-plus'
	},
	{
		name: 'Edit avatar',
		url: '/avatar',
		prefetch: true,
		icon: 'tabler:alien'
	}
];
