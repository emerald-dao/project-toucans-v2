import fs from 'fs';
import { network } from './config';

const contractData = {
  NonFungibleToken: {
    emulator: '0xf8d6e0586b0a20c7',
    testnet: '0x631e88ae7f1d7c20',
    mainnet: '0x1d7e57aa55817448'
  },
  FungibleTokenMetadataViews: {
    emulator: '0xf8d6e0586b0a20c7',
    testnet: '0x9a0766d93b6608b7',
    mainnet: '0xf233dcee88fe0abe'
  },
  MetadataViews: {
    emulator: '0xf8d6e0586b0a20c7',
    testnet: '0x631e88ae7f1d7c20',
    mainnet: '0x1d7e57aa55817448'
  },
  FungibleToken: {
    emulator: '0xee82856bf20e2aa6',
    testnet: '0x9a0766d93b6608b7',
    mainnet: '0xf233dcee88fe0abe'
  },
  FlowToken: {
    emulator: '0x0ae53cb6e3f42a79',
    testnet: '0x7e60df042a9c0868',
    mainnet: '0x1654653399040a61'
  },
  FUSD: {
    emulator: '0xf8d6e0586b0a20c7',
    testnet: '0xe223d8a629e49c68',
    mainnet: '0x3c5959b568896393'
  },
  FiatToken: {
    emulator: '0xf8d6e0586b0a20c7',
    testnet: '0xa983fecbed621163',
    mainnet: '0xb19436aae4d94622'
  },
  NFTCatalog: {
    emulator: '0xf8d6e0586b0a20c7',
    testnet: '0x324c34e1c517e4db',
    mainnet: '0x49a7cda3a1eecc29'
  },
  ECTreasury: {
    emulator: '0xf8d6e0586b0a20c7',
    testnet: '0x6c0d53c676256e8c',
    mainnet: '0x5643fd47a29770e7'
  },
  FLOAT: {
    emulator: '',
    testnet: '0x0afe396ebc8eee65',
    mainnet: '0x2d4c3caffbeab845'
  },
  FIND: {
    emulator: '0xf8d6e0586b0a20c7',
    testnet: '0xa16ab1d0abde3625',
    mainnet: '0x097bafa4e0b48eef'
  },
  Toucans: {
    emulator: '0xf8d6e0586b0a20c7',
    testnet: '0xaba4ef9fe3cbc7d0',
    mainnet: '0x577a3c409c5dcb5e'
  },
  SwapUtils: {
    emulator: '0xf8d6e0586b0a20c7',
    testnet: '0xddb929038d45d4b3',
    mainnet: '0xb78ef7afa52ff906'
  },
  SwapFactory: {
    emulator: '0xf8d6e0586b0a20c7',
    testnet: '0xcbed4c301441ded2',
    mainnet: '0xb063c16cac85dbd1'
  }
};

export const addresses: {
  [key: string]: string;
} = {
  NonFungibleToken: contractData.NonFungibleToken[network],
  MetadataViews: contractData.MetadataViews[network],
  FungibleTokenMetadataViews: contractData.FungibleTokenMetadataViews[network],
  FungibleToken: contractData.FungibleToken[network],
  FlowToken: contractData.FlowToken[network],
  FUSD: contractData.FUSD[network],
  ECTreasury: contractData.ECTreasury[network],
  FLOAT: contractData.FLOAT[network],
  FIND: contractData.FIND[network],
  Toucans: contractData.Toucans[network],
  FiatToken: contractData.FiatToken[network],
  NFTCatalog: contractData.NFTCatalog[network],
  SwapUtils: contractData.SwapUtils[network],
  SwapFactory: contractData.SwapFactory[network]
};

export function getCadenceCode(scriptFileName: string, contractName: string | undefined, contractAddress: string | undefined) {
  try {
    const data = fs.readFileSync(__dirname + '/cadence/scripts/' + scriptFileName, 'utf8');
    return replaceWithProperValues(data, contractName, contractAddress);
  } catch (err) {
    console.error(err);
  }
}

export function replaceWithProperValues(script: string, contractName: string | undefined, contractAddress: string | undefined) {
  return (
    script
      // For Tx/Scripts
      .replace('"../ExampleToken.cdc"', contractAddress)
      .replace('"../utility/NonFungibleToken.cdc"', addresses.NonFungibleToken)
      .replace('"../utility/MetadataViews.cdc"', addresses.MetadataViews)
      .replace('"../utility/FlowToken.cdc"', addresses.FlowToken)
      .replace('"../utility/FiatToken.cdc"', addresses.FiatToken)
      .replace('"../utility/FungibleToken.cdc"', addresses.FungibleToken)
      .replace('"../utility/FIND.cdc"', addresses.FIND)
      .replace('"../utility/FLOAT.cdc"', addresses.FLOAT)
      .replace('"../Toucans.cdc"', addresses.Toucans)
      .replace('"../ToucansActions.cdc"', addresses.Toucans)
      .replace('"../ToucansMultiSign.cdc"', addresses.Toucans)
      .replace('"../ToucansTokens.cdc"', addresses.Toucans)
      .replace('"../utility/NFTCatalog.cdc"', addresses.NFTCatalog)
      .replace('"../utility/SwapInterfaces.cdc"', addresses.SwapUtils)
      .replace('"../utility/SwapError.cdc"', addresses.SwapUtils)
      .replace('"../utility/SwapInterfaces.cdc"', addresses.SwapUtils)
      .replace('"../utility/SwapConfig.cdc"', addresses.SwapUtils)
      .replace('"../utility/SwapFactory.cdc"', addresses.SwapFactory)
      .replaceAll('ExampleToken', contractName)
  );
}

export const formatFix = (value) => {
  const i = Number.parseFloat(value);
  if (i % 1 == 0) {
    return i.toFixed(4);
  }
  return i.toFixed(4);
};

export const roundToUSDPrice = (value: number) => {
  return Math.round(value * 100) / 100;
}