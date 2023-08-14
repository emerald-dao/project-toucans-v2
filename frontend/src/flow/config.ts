import { config } from '@onflow/fcl';
import dappInfo from '$lib/config/config';
import { env } from '$env/dynamic/public';

const resolver = async () => {
	// const response = await fetch('/api/generate');
	const nonce = '7f190deedcd3b0538b7cd0ebc1994ed40d9db16cc1a6fcc3e7a994240c14d86d';
	return {
		appIdentifier: 'Toucans',
		nonce
	};
};

export const network: 'mainnet' | 'testnet' | 'emulator' = env.PUBLIC_FLOW_NETWORK as
	| 'mainnet'
	| 'testnet'
	| 'emulator';

const fclConfigInfo = {
	emulator: {
		accessNode: 'http://127.0.0.1:8888',
		discoveryWallet: 'http://localhost:8701/fcl/authn',
		discoveryAuthnInclude: []
	},
	testnet: {
		accessNode: 'https://rest-testnet.onflow.org',
		discoveryWallet: 'https://fcl-discovery.onflow.org/testnet/authn',
		discoveryAuthnInclude: ['0x9d2e44203cb13051']
	},
	mainnet: {
		accessNode: 'https://rest-mainnet.onflow.org',
		discoveryWallet: 'https://fcl-discovery.onflow.org/authn',
		discoveryAuthnInclude: ['0xe5cd26afebe62781']
	}
}

config()
	.put('app.detail.title', dappInfo.title)
	.put('app.detail.icon', dappInfo.icon)
	.put('fcl.accountProof.resolver', resolver)
	.put('flow.network', network)
	.put('accessNode.api', fclConfigInfo[network].accessNode)
	.put('discovery.wallet', fclConfigInfo[network].discoveryWallet)
	.put('discovery.authn.include', fclConfigInfo[network].discoveryAuthnInclude);
