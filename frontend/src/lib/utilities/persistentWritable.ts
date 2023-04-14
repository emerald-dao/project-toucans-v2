import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

// Make any writable store persistent.
function persistentWritable<T>(key: string, defaultValue: T): () => Writable<T> {
	// Create a writable store.
	const { subscribe, set, update } = writable();

	let storedValue;
	// Get stored value.
	if (browser) {
		storedValue = localStorage.getItem(key);
	}

	// Determine resolved value.
	const resolvedValue = storedValue === null ? defaultValue : storedValue;
	if (resolvedValue && isJsonString(resolvedValue)) {
		set(JSON.parse(resolvedValue));
	} else {
		set(resolvedValue);
	}

	// Subscribe to changes.
	subscribe((value) => {
		// Store the new value.
		if (browser) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	});

	return { subscribe, set, update };
}

function isJsonString(str: string) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

export default persistentWritable;
