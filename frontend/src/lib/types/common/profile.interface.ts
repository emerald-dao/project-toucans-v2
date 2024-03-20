export interface Profile {
	address: string;
	avatar: string;
	name: string;
	type: ProfileTypes;
}

export type ProfileTypes = 'find' | 'random' | 'toucans';
