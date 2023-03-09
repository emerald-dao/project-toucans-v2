import type { TokenInfo } from '$lib/types/dao-project/dao-project.interface';
import { addresses } from './FlowStore';

export const currencies: { [key: string]: TokenInfo } = {
	FLOW: {
		contractName: 'FlowToken',
		contractAddress: addresses.FlowToken,
		receiverPath: 'flowTokenReceiver',
		publicPath: 'flowTokenBalance',
		storagePath: 'flowTokenVault',
		image: 'flow-logo.png'
	},
	FUSD: {
		contractName: 'FUSD',
		contractAddress: addresses.FUSD,
		receiverPath: 'fusdReceiver',
		publicPath: 'fusdBalance',
		storagePath: 'fusdVault',
		image: 'fusd-logo.png'
	}
};
