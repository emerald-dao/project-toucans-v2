import type { UserData } from '../../../_types/user-data.interface';
import USER_BADGES from '../userBadges';

const getUserBadges = (userData: UserData): number[] => {
	const userLevels: number[] = [];

	for (let i = 0; i < USER_BADGES.length; i++) {
		const levelNumber = USER_BADGES[i].rule(userData);

		userLevels.push(levelNumber);
	}

	return userLevels;
};

export default getUserBadges;
