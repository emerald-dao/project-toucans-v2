<script lang="ts">
	import DaoRankingRow from "$lib/features/dao-ranking/components/atoms/DaoRankingRow.svelte";
	import type { DaoRankingData } from "$lib/features/dao-ranking/types/dao-ranking-data.interface";
	import BorderColoredText from "./atoms/BorderColoredText.svelte";
    import ProjectCard from "$components/cards/ProjectCard.svelte";
	import type { DaoDatabaseData } from "$lib/types/dao-project/dao-project.interface";

    export let projects: DaoDatabaseData[];
    export let daoOfTheMonth: DaoRankingData;

    const DaoOfTheMonth: DaoDatabaseData = projects.find(
		(project) => project.project_id === daoOfTheMonth.project_id
	) as DaoDatabaseData;
</script>

<section class="section-large">
    <div class="container-small">
        <BorderColoredText text={"Dao of the month"} color={"#FF66C4"} borderRadius={"16px"} backgroundColor={"#FF66C4"}/>
        <h1>{DaoOfTheMonth.name}</h1>
        <p>{DaoOfTheMonth.description}</p>
        <div class="container-small">
            <ProjectCard project={DaoOfTheMonth}/>
        </div>
    </div>
</section>

<style lang="scss">
    section {
        .container-small {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap:22px;
            text-align: center;

                .container-small{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 40px;
                    max-width: 360px;
                }

                p{
                font-size: 22px;
                line-height: 30px;
            
            }
            
        }
    }
</style>