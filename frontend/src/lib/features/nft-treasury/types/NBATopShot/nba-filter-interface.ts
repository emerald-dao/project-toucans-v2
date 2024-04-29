import type { NumberOneSerialEnum } from './nba-number-one-serial.enum';
import type { PlayCategoryEnum } from './nba-play-category.enum';
import type { SeriesNumberEnum } from './nba-series-number.enum';
import type { TierEditionEnum } from './nba-tier.enum';

export interface NBAFilter {
	title: string;
	slug: 'number-one-serial' | 'series' | 'play-category' | 'tier';
	filterElement: FilterElement[];
	filterBucket: FilterNBASlugs[];
}

interface FilterElement {
	slug: FilterNBASlugs;
}

export type FilterNBASlugs =
	| SeriesNumberEnum
	| PlayCategoryEnum
	| TierEditionEnum
	| NumberOneSerialEnum;
