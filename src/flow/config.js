import { config } from '@onflow/fcl';
import dappInfo from '$lib/config/config';

config()
	.put('flow.network', 'emulator')
	.put('app.detail.title', dappInfo.title)
	.put('app.detail.icon', dappInfo.icon)
	.put('accessNode.api', 'http://localhost:8888')
	.put('discovery.wallet', 'http://localhost:8701/fcl/authn');
