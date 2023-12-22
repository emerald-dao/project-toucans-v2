<script lang="ts">
	import { AdaptableGrid } from '@mateoroldos/svelte.bones';
	import { LeadingProjectCard } from '$components/cards/index';
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';
	import { logIn } from '@onflow/fcl';
	import type { DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import ProjectCard from '$components/cards/ProjectCard.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	
	export let projects: DaoRankingData[] = [];
	export let allProjects: DaoDatabaseData[] = [];

	const tabs = ['All', 'Top Grossing', 'NFT Communities', 'Gaming'];

	let selectedTab = 'All';
	let topProjects = projects.sort((a, b) => b.treasury_value - a.treasury_value).slice(0, 3);
	
	$: topThreeCommunities = handleTopProjectsChange(topProjects);;

	function handleSelectedTab(tab: string){
		selectedTab = tab;

		if(tab == tabs[0]){
			topProjects = projects.sort((a, b) => b.treasury_value - a.treasury_value).slice(0, 3);
		}else if(tab == tabs[1]){
			topProjects = projects.sort((a, b) => b.total_funding - a.total_funding).slice(0, 3);
		}else if(tab == tabs[2]){
			topProjects = projects.sort((a, b) => b.treasury_value - a.treasury_value).slice(0, 3);
		}else if(tab == tabs[3]){
			topProjects = projects.sort((a, b) => b.treasury_value - a.treasury_value).slice(0, 3);
		}
		
      handleTopProjectsChange(topProjects);
	}

	function handleTopProjectsChange(top: DaoRankingData[]){
		let top3: DaoDatabaseData[]= [];
		for(let i=0;i<top.length;i++){
			top3[i] =  allProjects.find(
				(project) => project.project_id === top[i].project_id
				) as DaoDatabaseData;
		}
		return top3;
	}
</script>

<section class="section-large">
	<div class="container-medium">
			<h2 class="w-medium">Leading Communities</h2>
		<div class="navbar container-small">
			{#each tabs as tab}
			  <div
				class="tab {selectedTab === tab ? 'selected' : ''}"
					on:click={()=>handleSelectedTab(tab)}
				>
				{tab}
			  </div>
			{/each}
		</div>
		<div class="projects-wrapper" >
					{#each topThreeCommunities as project, i}
					<ProjectCard {project}/>
				{/each}
		</div>
	</div>
</section>

<style type="scss">
	section {
		.container-medium {
			display: flex;
			flex-direction: column;
			gap:40px;
			text-align: center;
			h1{
				font-size: 2.5rem;
			}
			@include mq('small'){
				h1{
					font-size: 70px;
				}
			}
			.navbar {
				background-color: #222222;
				color: white;
				border-radius: 20px;
				display: flex;
				justify-content: space-around;
				width: 100%;
				font-size: 13px;
				padding: 10px;

				@include mq("small"){
					font-size: 18px;
					width:75%
				}

				align-items: center;
			}

			.tab {
				cursor: pointer;
				padding: 12px 8px;

				border-radius: 10px;
				@include mq("small"){
					padding: 8px 16px;

				}
			}

			.selected {
				background-color: #313131; 
			}

			.projects-wrapper{
				display: flex;
				flex-direction: column;
				gap: 30px;

				@include mq('small'){
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					grid-gap: 50px;
				}
			}
		}
	}
</style>
