import type { TokenInfo } from '$lib/types/dao-project/dao-project.interface';
import { addresses } from './FlowStore';

export const currencies: { [key: string]: TokenInfo } = {
	FLOW: {
		contractName: 'FlowToken',
		contractAddress: addresses.FlowToken,
		symbol: 'FLOW',
		tokenType: '',
		receiverPath: {
			domain: "public",
			identifier: 'flowTokenReceiver'
		},
		publicPath: {
			domain: "public",
			identifier: 'flowTokenBalance'
		},
		storagePath: {
			domain: "storage",
			identifier: 'flowTokenVault'
		},
		image: '/flow-logo.png'
	},
	USDC: {
		contractName: 'FiatToken',
		contractAddress: addresses.FiatToken,
		symbol: 'USDC',
		tokenType: '',
		receiverPath: {
			domain: "public",
			identifier: 'USDCVaultReceiver'
		},
		publicPath: {
			domain: "public",
			identifier: 'USDCVaultBalance'
		},
		storagePath: {
			domain: "storage",
			identifier: 'USDCVault'
		},
		image: '/usdc-logo.png'
	}
};
