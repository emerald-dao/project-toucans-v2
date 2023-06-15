// This funcion should get a Flow blockchain wallet address like 0x508abfd3970f5872
// It should analyze it and return a random number between 1 and a given number x.
// The same address sholud always output the same number.
// The probability of each number should be the same.
import { createHash } from 'crypto';

const getRandomUserNumber = (address: string, max: number) => {
	const hash = createHash('sha256').update(address).digest('hex');

	// Convert the hash to a decimal number
	const decimalNumber = parseInt(hash, 16);

	// Generate the random number between 0 and the given maximum
	const randomNumber = decimalNumber % (max + 1);

	return randomNumber;
};

export default getRandomUserNumber;
