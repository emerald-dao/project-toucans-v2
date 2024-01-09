import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import Disclaimer from '../components/steps/1-disclaimer/Disclaimer.svelte';
import Fund from '../components/steps/2-fund/Fund.svelte';
import Thanks from '../components/steps/3-thanks/Thanks.svelte';
import { submitPayment } from '../functions/submitPayment';
import { get } from 'svelte/store';
import { paymentData } from './PaymentData';

export const paymentSteps = createSteps([
	{
		name: 'Disclaimer',
		component: Disclaimer,
		action: null,
		form: false,
		state: 'active',
		button: {
			text: 'Accept'
		}
	},
	{
		name: 'Pay',
		component: Fund,
		action: () => submitPayment(get(paymentData)),
		form: false,
		state: 'inactive',
		button: {
			text: 'Send',
			icon: 'tabler:cash'
		}
	},
	{
		name: 'Thank You!',
		component: Thanks,
		action: null,
		form: false,
		state: 'inactive'
	}
]);
export const paymentActiveStep = createActiveStep(paymentSteps);
