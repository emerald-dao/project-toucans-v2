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