import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import type { TransactionStatusObject } from '@onflow/fcl';
import * as fcl from '@onflow/fcl';

const supabase = createClient(PublicEnv.PUBLIC_SUPABASE_URL, PrivateEnv.SUPABASE_SERVICE_KEY);

export async function POST({ request }) {
	const data = await request.json();
	const transactionId = data.transactionId;

	console.log('[SAVING]: Step 2');

	try {
		const timeout =
			<T>(cb: (res: (arg: T) => T) => T, interval: number) =>
			() =>
				new Promise((resolve) => setTimeout(() => cb(resolve as () => T), interval));
		const timeoutPromise = timeout<string>((resolve) => resolve('timeout'), 3000);

		const executionResult = (await Promise.race(
			[timeoutPromise, fcl.tx(transactionId).onceSealed].map((f) => f())
		)) as TransactionStatusObject | 'timeout';

		if (executionResult === 'timeout') {
			return json({
				success: false,
				error: 'There was an error fetching this transaction. Please check your id'
			});
		}

		const [event] = executionResult.events.filter(
			(event) =>
				event.type.includes('Toucans.NewFundingCycle') ||
				event.type.includes('Toucans.Donate') ||
				event.type.includes('Toucans.Purchase') ||
				event.type.includes('Toucans.Mint') ||
				event.type.includes('Toucans.BatchMint') ||
				event.type.includes('Toucans.Burn') ||
				event.type.includes('Toucans.BatchWithdraw') ||
				event.type.includes('Toucans.Withdraw') ||
				event.type.includes('Toucans.AddSigner') ||
				event.type.includes('Toucans.RemoveSigner') ||
				event.type.includes('Toucans.UpdateThreshold')
		);

		console.log('[SAVING]: Step 3', event);

		if (!event) {
			return json({ success: false, error: 'Event does not exist.' });
		}

		const { projectId, amounts, ...rest } = event.data;

		const { error } = await supabase.from('events').insert({
			project_id: projectId,
			type: event.type.substring(27),
			data: rest,
			transaction_id: transactionId
		});

		if (error) {
			return json({ success: false, error: 'This transaction has already been added.' });
		}

		return json({ success: true });
	} catch (error) {
		console.log('[SAVING]: Step 4', error);

		return json({ success: false, error });
	}
}
