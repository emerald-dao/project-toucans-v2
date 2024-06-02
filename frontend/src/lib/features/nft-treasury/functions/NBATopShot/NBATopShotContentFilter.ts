import type { FilterNBASlugs, NBAFilter } from '../../types/NBATopShot/nba-filter-interface';
import type { Nft } from '../../types/nft.interface';

export const filterNBAContent = async (
	_filters: NBAFilter[],
	contents: Nft[],
	activeFilters: {
		numberOneSerial: boolean;
		seriesNumber: boolean;
		playCategory: boolean;
		tier: boolean;
	}
) => {
	let filteredContent = contents;

	if (activeFilters.numberOneSerial) {
		filteredContent = await filterNumberOneSerial(_filters, filteredContent);
	}
	if (activeFilters.seriesNumber) {
		filteredContent = await filterSeriesNumber(_filters, filteredContent);
	}
	if (activeFilters.playCategory) {
		filteredContent = await filterPlayCategory(_filters, filteredContent);
	}
	/*  if (activeFilters.tier) {
		filteredContent = await filterTier(_filters, filteredContent);
	} */

	return filteredContent;
};

const filterNumberOneSerial = async (_filters: NBAFilter[], contents: Nft[]) => {
	const filter = _filters.filter((flt) => {
		return flt.slug === 'number-one-serial';
	});

	if (filter[0].filterBucket.includes('True' as FilterNBASlugs)) {
		return contents.filter((content) => content.serial === '1');
	}

	return contents;
};

const filterSeriesNumber = async (_filters: NBAFilter[], contents: Nft[]) => {
	const filter = _filters.filter((flt) => {
		return flt.slug === 'series';
	});

	return contents.filter((content) => {
		return (
			filter[0].filterBucket.some((item) => content.traits['SeriesNumber'].includes(item)) ||
			filter[0].filterBucket.length < 1
		);
	});
};

const filterPlayCategory = async (_filters: NBAFilter[], contents: Nft[]) => {
	const filter = _filters.filter((flt) => {
		return flt.slug === 'play-category';
	});

	return contents.filter((content) => {
		return (
			filter[0].filterBucket.some((item) => content.traits['PlayCategory'].includes(item)) ||
			filter[0].filterBucket.length < 1
		);
	});
};

/* const filterTier = async (_filters: NBAFilter[], contents: Nft[]) => {
	const filter = _filters.filter((flt) => {
		return flt.slug === 'tier';
	});

	return contents.filter((content) => {
	});
}; */
