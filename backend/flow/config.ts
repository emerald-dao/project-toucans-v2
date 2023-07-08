import { config } from "@onflow/fcl";

export const network: 'mainnet' | 'testnet' | 'emulator' = process.env.FLOW_NETWORK as
    | 'mainnet'
    | 'testnet'
    | 'emulator';

const fclConfigInfo = {
    emulator: {
        accessNode: 'http://127.0.0.1:8888',
    },
    testnet: {
        accessNode: 'https://rest-testnet.onflow.org',
    },
    mainnet: {
        accessNode: 'https://rest-mainnet.onflow.org',
    }
}

config()
    .put('accessNode.api', fclConfigInfo[network].accessNode)