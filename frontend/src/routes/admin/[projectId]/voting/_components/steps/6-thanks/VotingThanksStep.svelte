<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="column-2">
	<p>Your votation round has been succesfully created.</p>
	<p>
		Go to the <a href="/p/{$page.params.projectId}/voting-rounds">votings page</a> to see the voting
		rounds of this DAO.
	</p>
</div>
