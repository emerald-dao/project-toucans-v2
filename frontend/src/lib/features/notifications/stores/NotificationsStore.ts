import type { Writable } from 'svelte/store';
import type { ProjectNotifications } from '../types/notifications.interface';
import { writable } from 'svelte/store';
import { getNotifications } from '../functions/getNotifications';

export const notifications: Writable<ProjectNotifications | null> = writable(null);

export const setNotifications = async (userAddress: string) => {
	notifications.set(await getNotifications(userAddress));
};

export const getNotificationsNumber = (notifications: ProjectNotifications | null) => {
	let number = 0;
	for (const project in notifications) {
		number += notifications[project].length;
	}
	return number;
};
