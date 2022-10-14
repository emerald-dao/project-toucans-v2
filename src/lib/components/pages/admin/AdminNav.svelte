<script>
	import { Card, Ball } from '$components/atoms';
	import { Column, Row } from '@mateoroldos/svelte.bones';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
</script>

<nav>
	<Card padding={3}>
		<Column align="flex-start">
			<Row gap={1}>
				<img src="/ec-logo.png" alt="DAO Logo" />
				<h1>Emerald City DAO</h1>
			</Row>
			<Column align="flex-start" gap="small">
				<Button href="/admin" type="transparent"
					><Icon icon="tabler:chart-infographic" />Stats</Button
				>
				<Button href="/admin/rounds" type="transparent"
					><Icon icon="tabler:pig-money" />Rounds</Button
				>
				<Button href="/admin/info" type="transparent"
					><Icon icon="tabler:file-info" />Edit Info</Button
				>
				<Button href="/admin/activity" type="transparent"
					><Icon icon="tabler:activity" />Activity</Button
				>
				<Button href="/admin/distribute" type="transparent"
					><Icon icon="tabler:affiliate" />Distribute</Button
				>
			</Column>
		</Column>
	</Card>
</nav>

<style type="scss">
	nav {
		img {
			max-width: 45px;
		}

		h1 {
			font-size: var(--fs-400);
		}
	}
</style>
