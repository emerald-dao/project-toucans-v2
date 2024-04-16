import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import type { TransactionStatusObject } from '@onflow/fcl';
import * as fcl from '@onflow/fcl';
import { fetchFlowPrice } from '$lib/utilities/fetchFlowPrice';
import { ECurrencies } from '$lib/types/common/enums';

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
				event.type.includes('Toucans.DonateNFT') ||
				event.type.includes('Toucans.WithdrawNFT') ||
				event.type.includes('Toucans.Donate') ||
				event.type.includes('Toucans.Purchase') ||
				event.type.includes('Toucans.Mint') ||
				event.type.includes('Toucans.BatchMint') ||
				event.type.includes('Toucans.Burn') ||
				event.type.includes('Toucans.BatchWithdraw') ||
				event.type.includes('Toucans.Withdraw') ||
				event.type.includes('Toucans.AddSigner') ||
				event.type.includes('Toucans.RemoveSigner') ||
				event.type.includes('Toucans.UpdateThreshold') ||
				event.type.includes('Toucans.LockTokens') ||
				event.type.includes('Toucans.StakeFlow') ||
				event.type.includes('Toucans.UnstakeFlow')
		);

		console.log('[SAVING]: Step 3', event);

		if (!event) {
			return json({ success: false, error: 'Transaction does not contain any Toucans events.' });
		}

		const { projectId, ...rest } = event.data;
		const eventType = event.type.substring(27);

		// if its a donate or purchase event, save it differently
		if (
			(eventType === 'Donate' || eventType === 'Purchase') &&
			(rest.tokenSymbol === ECurrencies.FLOW || rest.tokenSymbol === ECurrencies.USDC)
		) {
			let amount = 0;
			if (rest.tokenSymbol === 'FLOW') {
				const flowPrice = await fetchFlowPrice();
				if (!flowPrice) {
					return json({ success: false, error: 'There was an error fetching the flow price.' });
				}
				amount = Math.round(Number(rest.amount) * flowPrice * 100) / 100;
			} else if (rest.tokenSymbol === 'USDC') {
				amount = Math.round(Number(rest.amount) * 100) / 100;
			}

			const { error } = await supabase.rpc('save_fund', {
				_project_id: projectId,
				_type: eventType,
				_data: rest,
				_transaction_id: transactionId,
				_funder: rest.by,
				_usd_amount: amount
			});

			if (error) {
				return json({ success: false, error: 'This transaction has already been added.' });
			}
		} else if (eventType === 'DonateNFT') {
			const { error } = await supabase.rpc('save_nft_fund', {
				_project_id: projectId,
				_type: eventType,
				_data: rest,
				_transaction_id: transactionId,
				_funder: rest.by,
				_amount: rest.amount
			});

			if (error) {
				return json({ success: false, error: 'This transaction has already been added.' });
			}
		} else {
			const { error } = await supabase.from('events').insert({
				project_id: projectId,
				type: eventType,
				data: rest,
				transaction_id: transactionId
			});

			if (error) {
				return json({ success: false, error: 'This transaction has already been added.' });
			}
		}

		return json({ success: true });
	} catch (error) {
		console.log('[SAVING]: Step 4', error);

		return json({ success: false, error });
	}
}
