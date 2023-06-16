import { notifications } from '../features/notifications/stores/NotificationsStore';
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
		name: 'Geeft',
		url: 'https://geeft.ecdao.org/'
	},
	{
		name: 'Drizzle',
		url: 'https://www.drizzle33.app/'
	}
];

export const socialMedia = [
	{
		name: 'Twitter ',
		url: 'https://twitter.com/emerald_dao',
		icon: 'ion:logo-twitter'
	},
	{
		name: 'Github ',
		url: 'https://github.com/emerald-dao',
		icon: 'ion:logo-github'
	}
];

export const avatarDropdownNav = [
	{
		name: 'DAO Manager',
		url: '/admin',
		prefetch: true,
		icon: 'tabler:adjustments'
	},
	{
		name: 'Profile',
		url: '/admin',
		prefetch: true,
		icon: 'tabler:user'
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
	}
];
