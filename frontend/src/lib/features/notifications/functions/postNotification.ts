import { user } from "$stores/flow/FlowStore";
import { get } from "svelte/store";

export const addNotification = async (projectId: string, projectOwner: string) => {
    const res = await fetch('/api/add-notification', {
        method: 'POST',
        body: JSON.stringify({
            user: get(user),
            projectId,
            projectOwner
        }),
        headers: {
            'content-type': 'application/json'
        }
    });

    const response = await res.json();

    return response;
};

export const removeNotification = async (projectId: string, projectOwner: string) => {
    const res = await fetch('/api/remove-notification', {
        method: 'POST',
        body: JSON.stringify({
            user: get(user),
            projectId,
            projectOwner
        }),
        headers: {
            'content-type': 'application/json'
        }
    });

    const response = await res.json();

    return response;
};