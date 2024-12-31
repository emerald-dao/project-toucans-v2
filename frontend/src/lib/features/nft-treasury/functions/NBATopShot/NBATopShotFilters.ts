import type { NBAFilter } from '../../types/NBATopShot/nba-filter-interface';
import { NumberOneSerialEnum } from '../../types/NBATopShot/nba-number-one-serial.enum';
import { PlayCategoryEnum } from '../../types/NBATopShot/nba-play-category.enum';
import { SeriesNumberEnum } from '../../types/NBATopShot/nba-series-number.enum';
import { TierEditionEnum } from '../../types/NBATopShot/nba-tier.enum';

export const numberOneSerialFilter: NBAFilter = {
	title: '#1 Serial',
	slug: 'number-one-serial',
	filterElement: [
		{
			slug: NumberOneSerialEnum.True
		}
	],
	filterBucket: []
};

export const seriesNumberFilter: NBAFilter = {
	title: 'Series',
	slug: 'series',
	filterElement: Object.values(SeriesNumberEnum).map((serie) => {
		return {
			slug: serie
		};
	}),
	filterBucket: []
};

export const playCategoryFilter: NBAFilter = {
	title: 'Play Category',
	slug: 'play-category',
	filterElement: Object.values(PlayCategoryEnum).map((cat) => {
		return {
			slug: cat
		};
	}),
	filterBucket: []
};

export const tierFilter: NBAFilter = {
	title: 'Tier',
	slug: 'tier',
	filterElement: Object.values(TierEditionEnum).map((tier) => {
		return {
			slug: tier
		};
	}),
	filterBucket: []
};

export const createNBAFilters = (activeFilters: {
	numberOneSerial: boolean;
	seriesNumber: boolean;
	playCategory: boolean;
	tier: boolean;
}) => {
	const filters = [];

	numberOneSerialFilter.filterBucket = [];
	seriesNumberFilter.filterBucket = [];
	playCategoryFilter.filterBucket = [];
	tierFilter.filterBucket = [];

	if (activeFilters.numberOneSerial) {
		filters.push(numberOneSerialFilter);
	}
	if (activeFilters.seriesNumber) {
		filters.push(seriesNumberFilter);
	}
	if (activeFilters.playCategory) {
		filters.push(playCategoryFilter);
	}
	if (activeFilters.tier) {
		filters.push(tierFilter);
	}
	return filters;
};
