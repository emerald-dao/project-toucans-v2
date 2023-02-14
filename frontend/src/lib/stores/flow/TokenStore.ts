import type { Currencies, Currency } from '$lib/types/currencies.enum';
import { writable } from 'svelte/store';
import { addresses } from './FlowStore';

export const currencies: { [key: Currencies]: Currency } = writable({
    FLOW: {
        contractName: "FlowToken",
        contractAddress: addresses.FlowToken,
        receiverPath: "/public/flowTokenReceiver",
        publicPath: "/public/flowTokenBalance",
        storagePath: "/storage/flowTokenVault"
    }
});