import { supabase } from '$lib/supabaseClient';

export const fetchProjectEvents = async (projectId: string) => {
	const { data: eventsData } = await supabase.from('events').select().eq('project_id', projectId);

	return eventsData || [];
};
