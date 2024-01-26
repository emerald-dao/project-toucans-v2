export interface Nft {
	id: string;
	name: string;
	thumbnail: string;
	serial: string | null;
	traits: { name: string; value: string }[] | null;
}
