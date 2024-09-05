import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: ['flow.json']
		}
	},

	// Fixes issue with @onflow/fcl. "node-fetch" couldn't be used in client, so replaced it with "isomorphic-fetch"
	resolve: {
		alias: {
			'node-fetch': 'isomorphic-fetch'
		}
	}
};

export default config;
