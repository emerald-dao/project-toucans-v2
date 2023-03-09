import { supabase } from '$lib/supabaseClient';

export const fetchProjectEvents = async (projectId: string) => {
	const { data: actionData } = await supabase.from('events').select().eq('project_id', projectId);

	const [eventsData] = actionData || [];

	return eventsData;
};
