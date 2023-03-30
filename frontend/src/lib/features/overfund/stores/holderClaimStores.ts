import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import Claim from '../holder-claim/steps/1-Claim/Claim.svelte';
import Thanks from '../holder-claim/steps/2-Thanks/Thanks.svelte';

export const holderClaimSteps = createSteps([
	{
		name: 'Claim',
		slug: 'claim',
		component: Claim,
		action: null,
		form: true,
		state: 'active',
		button: {
			text: 'Claim'
		}
	},
	{
		name: 'Thanks',
		slug: 'thanks',
		component: Thanks,
		action: null,
		form: true,
		state: 'inactive'
	}
]);
export const holderClaimActiveStep = createActiveStep(holderClaimSteps);
