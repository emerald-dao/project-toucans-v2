export enum Currencies {
	FLOW = 'FLOW',
	FUSD = 'FUSD'
}

export interface Currency {
	contractName: string,
	contractAddress: string,
	receiverPath: string,
	publicPath: string,
	storagePath: string,
	image: string
}
