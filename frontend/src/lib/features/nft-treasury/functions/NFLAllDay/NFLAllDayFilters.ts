import type { NFLFilter } from '../../types/NFLAllDay/nfl-filter-interface';
import { PlayTypeEnum } from '../../types/NFLAllDay/nfl-play-type.enum';
import { SeriesNameEnum } from '../../types/NFLAllDay/nfl-series-number.enum';
import { TierEditionEnum } from '../../types/NFLAllDay/nfl-tier.enum';

export const tierFilter: NFLFilter = {
	title: 'Edition Tier',
	slug: 'tier',
	filterElement: Object.values(TierEditionEnum).map((tier) => {
		return {
			slug: tier
		};
	}),
	filterBucket: []
};

export const seriesNameFilter: NFLFilter = {
	title: 'Series name',
	slug: 'series',
	filterElement: Object.values(SeriesNameEnum).map((serie) => {
		return {
			slug: serie
		};
	}),
	filterBucket: []
};

export const playTypeFilter: NFLFilter = {
	title: 'Play Type',
	slug: 'play-type',
	filterElement: Object.values(PlayTypeEnum).map((cat) => {
		return {
			slug: cat
		};
	}),
	filterBucket: []
};

export const createNFLFilters = (activeFilters: {
	tier: boolean;
	seriesName: boolean;
	playType: boolean;
}) => {
	const filters = [];

	tierFilter.filterBucket = [];
	seriesNameFilter.filterBucket = [];
	playTypeFilter.filterBucket = [];

	if (activeFilters.tier) {
		filters.push(tierFilter);
	}
	if (activeFilters.seriesName) {
		filters.push(seriesNameFilter);
	}
	if (activeFilters.playType) {
		filters.push(playTypeFilter);
	}
	return filters;
};
