import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true,
			scss: {
				prependData: `@import './node_modules/@emerald-dao/component-library/styles/utils/mixins';`
			}
		})
	],

	kit: {
		adapter: adapter(),
		alias: {
			$atoms: 'src/lib/components/atoms/index.ts',
			$components: 'src/lib/components',
			$stores: 'src/lib/stores/',
			$flow: 'src/flow/'
		}
	}
};

export default config;
