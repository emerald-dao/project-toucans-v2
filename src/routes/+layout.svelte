<script type="ts">
	import '../app.postcss';
	import '$lib/styles/app.scss';
	import { Header, Footer, TransactionModal } from '@emerald-dao/component-library';
	import { navElements, emeraldTools, socialMedia } from '$lib/config/navigation';
	import { theme } from '$stores/ThemeStore';
	import { logIn, unauthenticate } from '$flow/actions';
	import { user } from '$stores/flow/FlowStore';
	import { getFindProfile } from '$flow/utils';
	import { transactionStore } from '$stores/flow/TransactionStore';
</script>

<TransactionModal
	transactionInProgress={$transactionStore.progress}
	transactionStatus={$transactionStore.transaction}
/>
<Header themeStore={theme} {logIn} {unauthenticate} {getFindProfile} user={$user} {navElements} />
<main>
	<slot />
</main>
<Footer {navElements} {emeraldTools} socials={socialMedia} />
