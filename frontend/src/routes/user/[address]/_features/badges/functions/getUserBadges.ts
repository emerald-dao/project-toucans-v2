import type { UserData } from '../../../_types/user-data.interface';
import type { Level } from '../badges.interfaces';
import USER_BADGES from '../userBadges';

const getUserBadges = (userData: UserData): Level[] => {
	const userBadges: Level[] = [];

	for (let i = 0; i < USER_BADGES.length; i++) {
		const levelNumber = USER_BADGES[i].rule(userData);

		if (levelNumber > 0) {
			userBadges.push(USER_BADGES[i].levels[levelNumber - 1]);
		}
	}

	return userBadges;
};

export default getUserBadges;
