import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ resolve, event }) => {
	// This is a workaround to enable CORS for the get-profile API route
	const validDomains = /^(.*)?\.?floats\.city$/;
	let cors: string | false = false;

	let originDomain = null;
	try {
		originDomain = new URL(event.request.headers.get('origin') || '').hostname;
		if (validDomains.test(originDomain)) {
			cors = `https://${originDomain}`;
		}
	} catch (e) {
		console.log('Invalid origin', e);
	}

	// Apply CORS header for API routes
	if (event.url.pathname.startsWith('/api/get-profile')) {
		// Required for CORS to work
		if (event.request.method === 'OPTIONS' && cors) {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
					'Access-Control-Allow-Origin': cors,
					'Access-Control-Allow-Headers': '*'
				}
			});
		}
	}

	const response = await resolve(event);
	if (event.url.pathname.startsWith('/api/get-profile') && cors != false) {
		response.headers.append('Access-Control-Allow-Origin', cors);
	}
	return response;
};
