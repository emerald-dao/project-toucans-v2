import type { Currencies, Currency } from '$lib/types/currencies.enum';
import { addresses } from './FlowStore';

export const currencies: { [key: string]: Currency } = {
    FLOW: {
        contractName: "FlowToken",
        contractAddress: addresses.FlowToken,
        receiverPath: "flowTokenReceiver",
        publicPath: "flowTokenBalance",
        storagePath: "flowTokenVault",
        image: "flow-logo.png"
    },
    FUSD: {
        contractName: "FUSD",
        contractAddress: addresses.FUSD,
        receiverPath: "fusdReceiver",
        publicPath: "fusdBalance",
        storagePath: "fusdVault",
        image: "fusd-logo.png"
    }
};