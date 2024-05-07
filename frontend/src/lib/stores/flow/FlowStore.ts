import { writable } from 'svelte/store';
import { network } from '$flow/config';
import { env } from '$env/dynamic/public';
import type { CurrentUserObject } from '@onflow/fcl';
import type { Profile } from '$lib/types/common/profile.interface';

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
	ViewResolver: {
		emulator: '0xf8d6e0586b0a20c7',
		testnet: '0x631e88ae7f1d7c20',
		mainnet: '0x1d7e57aa55817448'
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
		testnet: '0x918c2008c16da416',
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
	},
	EmeraldIdentity: {
		emulator: '0xf8d6e0586b0a20c7',
		testnet: '0x4d47bf3ce5e4393f',
		mainnet: '0x39e42c67cc851cfb'
	},
	stFlowToken: {
		emulator: '0xf8d6e0586b0a20c7',
		testnet: '0xe45c64ecfe31e465',
		mainnet: '0xd6f80565193ad727'
	},
	MigrationContractStaging: {
		testnet: '0x2ceae959ed1a7e7a',
		mainnet: '0x56100d46aa9b0212'
	},
	FlovatarDustToken: {
		testnet: '0x9392a4a7c3f49a0b',
		mainnet: '0x921ea449dffec68a'
	}
};

export const user = writable<CurrentUserObject | { loggedIn: false; addr: null }>({
	loggedIn: false,
	addr: null
});
export const profile = writable<Profile | null>(null);
// export const transactionStatus = writable({});
// export const transactionInProgress = writable(false);
export const addresses: {
	[key: string]: string;
} = {
	NonFungibleToken: contractData.NonFungibleToken[network],
	MetadataViews: contractData.MetadataViews[network],
	ViewResolver: contractData.ViewResolver[network],
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
	SwapFactory: contractData.SwapFactory[network],
	EmeraldIdentity: contractData.EmeraldIdentity[network],
	stFlowToken: contractData.stFlowToken[network],
	Migration: contractData.MigrationContractStaging[network],
	FlovatarDustToken: contractData.FlovatarDustToken[network]
};
