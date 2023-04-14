<script lang="ts">
	import type { RoundStatus } from '$lib/types/dao-project/funding-rounds/round-status.type';
	import { Label } from '@emerald-dao/component-library';

	export let status: RoundStatus;

	const STATUS_LABELS_DATA: {
		[key in RoundStatus]: {
			text: string;
			color: 'primary' | 'alert' | 'tertiary';
		};
	} = {
		active: {
			text: 'Active',
			color: 'primary'
		},
		finished: {
			text: 'Finished',
			color: 'alert'
		},
		upcoming: {
			text: 'Upcoming',
			color: 'tertiary'
		}
	};
</script>

<Label size="x-small" hasBorder={false} color={STATUS_LABELS_DATA[status].color}
	>{STATUS_LABELS_DATA[status].text}</Label
>
