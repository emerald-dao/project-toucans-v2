<script lang="ts">
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import NewBadge from '../atoms/NewBadge.svelte';
	import NfTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';

	const NFTs = {
		FlownsDomainNameNFT: [
			{
				id: '72618',
				name: 'sloppy.fn',
				thumbnail: 'https://flowns.org/api/fns?domain=sloppy.fn',
				serial: '72618'
			}
		],
		UFCStrike: [
			{
				id: '1373303',
				name: 'CHARLES OLIVEIRA | UFC FIGHT NIGHT AUG 1, 2010 | SUBMISSION',
				thumbnail: 'https://media.gigantik.io/ufc/qmvy2wythmspautosgboch3rbbf6jykxgcrmppxhgdc4jd',
				serial: '1373303'
			},
			{
				id: '1383093',
				name: 'CHARLES OLIVEIRA | UFC FIGHT NIGHT AUG 1, 2010 | SUBMISSION',
				thumbnail: 'https://media.gigantik.io/ufc/qmvy2wythmspautosgboch3rbbf6jykxgcrmppxhgdc4jd',
				serial: '1383093'
			}
		],
		RaceDayNFT: [
			{
				id: '55521',
				name: 'Beyond the Track',
				thumbnail:
					'https://giglabs.mypinata.cloud/ipfs/QmaABFdjJVSShk9Zn3MNJNix1k8yCRyKa3xGoDQFKWufYK',
				serial: '55521'
			},
			{
				id: '54665',
				name: 'Beyond the Track',
				thumbnail:
					'https://giglabs.mypinata.cloud/ipfs/QmaABFdjJVSShk9Zn3MNJNix1k8yCRyKa3xGoDQFKWufYK',
				serial: '54665'
			},
			{
				id: '61847',
				name: 'Commemorative Ticket: Autotrader EchoPark Automotive 500 (Common)',
				thumbnail:
					'https://giglabs.mypinata.cloud/ipfs/QmVR29CAC2MddNfHnpCHrbKZ5romQr2dZBdEJ3tZitHb2D',
				serial: '61847'
			}
		],
		FlovatarComponent: [
			{
				id: '10651',
				name: 'Sandwich',
				thumbnail: 'https://flovatar.com/api/image/template/25',
				serial: '10651'
			},
			{
				id: '125698',
				name: 'Fedora',
				thumbnail: 'https://flovatar.com/api/image/template/838',
				serial: '125698'
			},
			{
				id: '107638',
				name: 'Broomstick',
				thumbnail: 'https://flovatar.com/api/image/template/736',
				serial: '107638'
			}
		],
		InceptionAvatar: [
			{
				id: '1037',
				name: 'Inception Animals',
				thumbnail: 'https://storage.googleapis.com/inception_public/revealed/images/730.jpg',
				serial: '1949'
			}
		],
		NBATopShot: [
			{
				id: '39976478',
				name: 'Coby White Assist',
				thumbnail: 'https://assets.nbatopshot.com/media/39976478?width=256',
				serial: '6666'
			},
			{
				id: '40133193',
				name: 'Dennis Schröder Rim',
				thumbnail: 'https://assets.nbatopshot.com/media/40133193?width=256',
				serial: '1681'
			},
			{
				id: '41073967',
				name: 'Christian Wood Block',
				thumbnail: 'https://assets.nbatopshot.com/media/41073967?width=256',
				serial: '7754'
			},
			{
				id: '1108883',
				name: 'Nikola Jokić Mid-Range',
				thumbnail: 'https://assets.nbatopshot.com/media/1108883?width=256',
				serial: '3183'
			},
			{
				id: '28886198',
				name: 'Omer Yurtseven Mid-Range',
				thumbnail: 'https://assets.nbatopshot.com/media/28886198?width=256',
				serial: '3443'
			},
			{
				id: '392523',
				name: 'Alex Caruso Block',
				thumbnail: 'https://assets.nbatopshot.com/media/392523?width=256',
				serial: '371'
			},
			{
				id: '39087481',
				name: 'Dyson Daniels Assist',
				thumbnail: 'https://assets.nbatopshot.com/media/39087481?width=256',
				serial: '2179'
			}
		],
		PartyGooberz: [
			{
				id: '386',
				name: 'Party Goob #386',
				thumbnail: 'ipfs://Qmd9khNvZtnaVqXdrUwnt5DzDkhSRveQ3e3zKzAmT2f2K5',
				serial: null
			}
		]
	};
</script>

<FeatureCard.Root>
	<FeatureCard.Header>
		<div class="header-wrapper row-4 row-space-between">
			<FeautreLabel icon="mdi:account-cash" textColor="text">NFT Treasury</FeautreLabel>
			<NewBadge />
		</div>
		<FeatureCard.Heading>
			<FeatureCard.HeadingHighlight>Collect and manage NFTs</FeatureCard.HeadingHighlight> from your
			DAOs multisig treasury
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>
		<div class="card-primary">
			<NfTsList {NFTs} pageSize={2} />
		</div>
	</FeatureCard.Content>
</FeatureCard.Root>

<style lang="scss">
	.header-wrapper {
		width: 100%;
		align-items: center;
	}
</style>
