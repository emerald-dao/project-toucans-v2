import { supabase } from '$lib/supabaseClient';

export const fetchProjectEvents = async (projectId: string) => {
	const { data: eventsData } = await supabase
		.from('events')
		.select()
		.eq('project_id', projectId)
		.order('timestamp', { ascending: false });

	return eventsData || [];
};

export type BaseEvent = Awaited<ReturnType<typeof fetchProjectEvents>>[0];
