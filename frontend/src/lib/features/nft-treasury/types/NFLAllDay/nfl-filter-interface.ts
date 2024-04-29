import type { SeriesNameEnum } from './nfl-series-number.enum';
import type { TierEditionEnum } from './nfl-tier.enum';
import type { PlayTypeEnum } from './nfl-play-type.enum';

export interface NFLFilter {
	title: string;
	slug: 'tier' | 'play-type' | 'series';
	filterElement: FilterElement[];
	filterBucket: FilterNFLSlugs[];
}

interface FilterElement {
	slug: FilterNFLSlugs;
}

export type FilterNFLSlugs = SeriesNameEnum | PlayTypeEnum | TierEditionEnum;
