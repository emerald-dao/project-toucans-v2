import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import { deployDao } from '../functions/deployDao';
import {
	GeneralData,
	Description,
	Socials,
	Tokenomics,
	ReviewAndDeploy,
	Multisig
} from '../components/steps';

export const daoGeneratorSteps = createSteps([
	{
		name: 'General Data',
		slug: 'generalData',
		component: GeneralData,
		action: null,
		form: true,
		state: 'active'
	},
	{
		name: 'Description',
		slug: 'description',
		component: Description,
		action: null,
		form: true,
		state: 'active'
	},
	{
		name: 'Socials',
		slug: 'socials',
		component: Socials,
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
		name: 'Multisig',
		slug: 'multisig',
		component: Multisig,
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
