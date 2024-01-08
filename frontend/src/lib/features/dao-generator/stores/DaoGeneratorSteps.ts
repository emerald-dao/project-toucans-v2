import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import { deployDao } from '../functions/deployDao';
import {
	GeneralData,
	Description,
	Socials,
	Tokenomics,
	ReviewAndDeploy,
	EditDelay,
	PreferredCurrency,
	NFTCollections
} from '../components/steps';
import { get } from 'svelte/store';
import { daoAndTokenGeneratorData } from './DaoAndTokenGeneratorData';
import { daoGeneratorData } from './DaoGeneratorData';

export const daoAndTokenGeneratorSteps = createSteps([
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
		state: 'inactive'
	},
	{
		name: 'Socials',
		slug: 'socials',
		component: Socials,
		action: null,
		form: true,
		state: 'inactive'
	},
	{
		name: 'NFT Collections',
		slug: 'nft-collections',
		component: NFTCollections,
		action: null,
		form: true,
		state: 'inactive'
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
		name: 'Edit Delay',
		slug: 'edit-delay',
		component: EditDelay,
		action: null,
		form: false,
		state: 'inactive'
	},
	{
		name: 'Review & Deploy',
		slug: 'review',
		component: ReviewAndDeploy,
		action: () => deployDao(get(daoAndTokenGeneratorData)),
		form: false,
		state: 'inactive'
	}
]);

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
		state: 'inactive'
	},
	{
		name: 'Socials',
		slug: 'socials',
		component: Socials,
		action: null,
		form: true,
		state: 'inactive'
	},
	{
		name: 'NFT Collections',
		slug: 'nft-collections',
		component: NFTCollections,
		action: null,
		form: true,
		state: 'inactive'
	},
	{
		name: 'Preferred Currency',
		slug: 'preferred-currency',
		component: PreferredCurrency,
		action: null,
		form: true,
		state: 'inactive'
	},
	{
		name: 'Review & Deploy',
		slug: 'review',
		component: ReviewAndDeploy,
		action: () => deployDao(get(daoGeneratorData)),
		form: false,
		state: 'inactive'
	}
]);

export const daoAndTokenGeneratorActiveStep = createActiveStep(daoAndTokenGeneratorSteps);
export const daoGeneratorActiveStep = createActiveStep(daoGeneratorSteps);
