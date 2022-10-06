export interface ActionResult {
	state: 'success' | 'error';
	errors: string[];
}
