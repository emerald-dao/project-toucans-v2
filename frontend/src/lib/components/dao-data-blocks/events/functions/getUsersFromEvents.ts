import type { DaoEvent } from "$lib/types/dao-project/dao-event/dao-event.type"

export function getUsersFromEvents(events: DaoEvent[]): string[] {
  const filteredEvents = events.filter(
    (event) =>
      event.type === 'Withdraw' ||
      event.type === 'Mint' ||
      event.type === 'Donate' ||
      event.type === 'Purchase'
  )
  return filteredEvents.map((event) => {
    if (event.type === 'Withdraw' || event.type === 'Mint') {
      return event.data.to;
    } else if (event.type === 'Purchase' || event.type === 'Donate') {
      return event.data.by;
    }
    return '';
  });
}