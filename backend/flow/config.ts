import { config } from "@onflow/fcl";

export const network: 'mainnet' | 'testnet' | 'emulator' = process.env.FLOW_NETWORK as
    | 'mainnet'
    | 'testnet'
    | 'emulator';

config()
    .put('accessNode.api', process.env.ACCESS_NODE)