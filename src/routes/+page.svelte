<script type="ts">
	import dappInfo from '$lib/config/config';
	import { Section, Container, Column, Row } from '@mateoroldos/svelte.bones';
	import { transactionInProgress } from '$stores/FlowStore';
	import { Button, Tagline } from '@emerald-dao/component-library';
</script>

<Section>
	<Container>
		<Column>
			<h1>Create a token.<br /> Launch a DAO</h1>
			<p>
				Toucans is the first fungible token creation and management platform on the Flow blockchain
				that makes it easy for internet communities unlock the power of human-centric coordination.
			</p>
			<Row gap="small">
				<Button>Launch a Token</Button>
				<Button type="ghost">Browse Projects</Button>
			</Row>
		</Column>
	</Container>
</Section>

<Section>
	<Container>
		<Column>
			<Tagline>Why Start a DAO?</Tagline>
			<h1>Tokens for any Community</h1>
		</Column>
	</Container>
</Section>

<style type="scss">
	h1,
	p {
		text-align: center;
	}
</style>
