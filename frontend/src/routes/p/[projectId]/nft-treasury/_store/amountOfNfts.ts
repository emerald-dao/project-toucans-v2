import { writable, type Writable } from 'svelte/store';

export const amountOfNfts: Writable<null | 'loading' | number> = writable(null);
