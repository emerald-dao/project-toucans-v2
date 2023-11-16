import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// replace html lang attribute with correct language
	return resolve(event, {
		transformPageChunk: ({ html }) => {
			let currentTheme = event.cookies.get("theme");

			// Make sure the cookie was found, if not, set it to dark
			if (!currentTheme) {
				// default theme for Toucans
				currentTheme = "dark";
			}

			return html.replace(`data-theme=""`, `data-theme="${currentTheme}"`);
		}
	});
};