async function saveEvent(transactionId: string) {
	const res = await fetch('/api/save-event-data', {
		method: 'POST',
		body: JSON.stringify({
			transactionId
		}),
		headers: {
			'content-type': 'application/json'
		}
	});

	const response = await res.json();

	console.log('response', response);

	return response;
}

export default saveEvent;
