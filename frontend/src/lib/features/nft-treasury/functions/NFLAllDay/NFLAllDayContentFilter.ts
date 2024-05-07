import type { NFLFilter } from '../../types/NFLAllDay/nfl-filter-interface';
import type { Nft } from '../../types/nft.interface';

export const filterNFLContent = async (
	_filters: NFLFilter[],
	contents: Nft[],
	activeFilters: {
		tier: boolean;
		seriesName: boolean;
		playType: boolean;
	}
) => {
	let filteredContent = contents;

	if (activeFilters.seriesName) {
		filteredContent = await filterSeriesName(_filters, filteredContent);
	}
	if (activeFilters.playType) {
		filteredContent = await filterPlayType(_filters, filteredContent);
	}
	if (activeFilters.tier) {
		filteredContent = await filterTier(_filters, filteredContent);
	}
	return filteredContent;
};

const filterTier = async (_filters: NFLFilter[], contents: Nft[]) => {
	const filter = _filters.filter((flt) => {
		return flt.slug === 'tier';
	});

	return contents.filter((content) => {
		return (
			filter[0].filterBucket.some((item) => content.traits['editionTier'] === item) ||
			filter[0].filterBucket.length < 1
		);
	});
};

const filterSeriesName = async (_filters: NFLFilter[], contents: Nft[]) => {
	const filter = _filters.filter((flt) => {
		return flt.slug === 'series';
	});

	return contents.filter((content) => {
		return (
			filter[0].filterBucket.some((item) => content.traits['seriesName'].includes(item)) ||
			filter[0].filterBucket.length < 1
		);
	});
};

const filterPlayType = async (_filters: NFLFilter[], contents: Nft[]) => {
	const filter = _filters.filter((flt) => {
		return flt.slug === 'play-type';
	});

	contents = contents.filter((obj) => obj.traits && obj.traits['playType'] !== undefined);

	return contents.filter((content) => {
		return (
			filter[0].filterBucket.some((item) => content.traits['playType'].includes(item)) ||
			filter[0].filterBucket.length < 1
		);
	});
};
