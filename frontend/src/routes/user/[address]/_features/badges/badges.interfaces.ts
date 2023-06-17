import type { UserData } from '../../_types/user-data.interface';

export interface Badge {
	name: string;
	levels: Level[];
	rule: (user: UserData) => number;
}

export interface Level {
	name: string;
	image: string;
	description: string;
	goal: string;
}
