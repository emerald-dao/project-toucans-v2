import type { fetchDaoRankings } from '$lib/utilities/api/supabase/fetchDaoRankings';

type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type DaoRankingData = ArrayElement<Awaited<ReturnType<typeof fetchDaoRankings>>>;
