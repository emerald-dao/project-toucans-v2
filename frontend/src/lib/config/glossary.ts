const GLOSSARY = {
	threshold: 'Amount of signatures required to execute a transaction',
	maxSupply: 'Maximum amount of tokens that can be minted',
	initialSupply: 'Initial amount of tokens that will be minted to the DAO treasury',
	minting: 'Must be turned on if you wish to be able to mint tokens to your users.',
	paymentCurrency:
		"The currency used by the DAO to receive funding and donations. This can't be changed once the DAO is created",
	editDelay:
		'Numbers of days in which you can edit the configuration of your funding round before it starts. This is to prevent any last-minute changes that could affect the outcome of the round. The higher the delay, the greater trust your community will have in you.',
	signer:
		"Address required to sign transactiont that involve transfering money from the DAO's treasury",
	preferredCurrnecy:
		"The preferred/main currency used in the DAO. Toucans will automatically track user funding in this currency."
};

export default GLOSSARY;
