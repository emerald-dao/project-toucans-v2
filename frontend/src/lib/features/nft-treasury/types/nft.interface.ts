export interface Nft {
	uuid: string;
	id: string;
	name: string;
	thumbnail: string;
	serial: string | null;
	traits: { name: string; value: string }[] | undefined;
}
