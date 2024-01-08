import { default as generalDataValidation } from '../components/steps/1-general-data/validation';
import { default as descriptionValidation } from '../components/steps/2-description/validation';
import { default as socialsValidation } from '../components/steps/3-socials/validation';
import { default as tokenomicsValidation } from '../components/steps/5-tokenomics/validation';

export const restartAllSuites = () => {
	generalDataValidation.reset();
	descriptionValidation.reset();
	socialsValidation.reset();
	tokenomicsValidation.reset();
};
