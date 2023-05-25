import type { TokenInfo } from '$lib/types/dao-project/dao-project.interface';
import { addresses } from './FlowStore';

export const currencies: { [key: string]: TokenInfo } = {
	FLOW: {
		contractName: 'FlowToken',
		contractAddress: addresses.FlowToken,
		symbol: 'FLOW',
		tokenType: '',
		receiverPath: 'flowTokenReceiver',
		publicPath: 'flowTokenBalance',
		storagePath: 'flowTokenVault',
		image: 'flow-logo.png'
	},
	USDC: {
		contractName: 'FiatToken',
		contractAddress: addresses.USDC,
		symbol: 'USDC',
		tokenType: '',
		receiverPath: 'USDCVaultReceiver',
		publicPath: 'USDCVaultBalance',
		storagePath: 'USDCVault',
		image: 'usdc-logo.png'
	}
};
