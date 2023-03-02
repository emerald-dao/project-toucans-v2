import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import Tokenomics from '../components/steps/2-tokenomics/Tokenomics.svelte';
import ReviewAndDeploy from '../components/steps/3-review-and-deploy/ReviewAndDeploy.svelte';
import DaoDetails from '../components/steps/1-general-data/GeneralData.svelte';
import { deployDao } from '../functions/deployDao';

export const daoGeneratorSteps = createSteps([
	{
		name: 'DAO Details',
		slug: 'daoDetailes',
		component: DaoDetails,
		action: null,
		form: true,
		state: 'active'
	},
	{
		name: 'Tokenomics',
		slug: 'tokenomics',
		component: Tokenomics,
		action: null,
		form: true,
		state: 'inactive'
	},
	{
		name: 'Review & Deploy',
		slug: 'review',
		component: ReviewAndDeploy,
		action: deployDao,
		form: false,
		state: 'inactive'
	}
]);
export const generatorActiveStep = createActiveStep(daoGeneratorSteps);
