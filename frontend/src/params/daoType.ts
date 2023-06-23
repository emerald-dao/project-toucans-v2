// /** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param) {
	return param === 'dao' || param === 'dao-token';
}
