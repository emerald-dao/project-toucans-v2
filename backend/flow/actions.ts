import './config';
import * as fcl from '@onflow/fcl';
import { formatFix, getCadenceCode } from './utils';

export const getTrendingData = async (
  projectIds: string[],
  contractAddresses: string[]
) => {
  try {
    return await fcl.query({
      cadence: getCadenceCode('get_trending_data.cdc', undefined, undefined),
      args: (arg, t) => [
        arg(projectIds, t.Array(t.String)),
        arg(contractAddresses, t.Array(t.Address))
      ]
    });
  } catch (e) {
    console.log('Error in getTrendingData', e);
    throw new Error('Error in getTrendingData');
  }
};

async function getSwapPairInfo(pairAddr) {
  const response = await fcl.query({
    cadence: `
      import SwapInterfaces from 0xb78ef7afa52ff906
      import SwapConfig from 0xb78ef7afa52ff906

      pub fun main(pairAddr: Address): [AnyStruct] {
        let pairPublicRef = getAccount(pairAddr)
          .getCapability<&{SwapInterfaces.PairPublic}>(SwapConfig.PairPublicPath)
          .borrow()
          ?? panic("cannot borrow reference to PairPublic resource")

        return pairPublicRef.getPairInfo()
      }
    `,
    args: (arg, t) => [
      arg(pairAddr, t.Address)
    ]
  });
  return response;
}

export async function getQuoteToFlowPriceFromDex(pairAddr) {
  let info = await getSwapPairInfo(pairAddr)
  let numFlow = 0.0
  let numQuote = 0.0
  if (info[0].includes('Flow')) {
    numFlow = parseFloat(info[2])
    numQuote = parseFloat(info[3])
  } else if (info[1].includes('Flow')) {
    numFlow = parseFloat(info[3])
    numQuote = parseFloat(info[2])
  } else {
    throw (`not paired with flow`)
  }
  // 1 quote token = xx flow
  return numFlow / numQuote
}

export async function getQuoteToUSDCPriceFromDex(pairAddr) {
  let info = await getSwapPairInfo(pairAddr)
  let numUsdc = 0.0
  let numQuote = 0.0
  if (info[0].includes('FiatToken')) {
    numUsdc = parseFloat(info[2])
    numQuote = parseFloat(info[3])
  } else if (info[1].includes('FiatToken')) {
    numUsdc = parseFloat(info[3])
    numQuote = parseFloat(info[2])
  } else {
    throw (`not paired with USDC`)
  }
  // 1 quote token = xx usdc
  return numUsdc / numQuote
}