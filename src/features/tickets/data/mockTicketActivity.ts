export type TicketActivityItem = {
  id: string;
  time: string;
  author: string;
  type: 'note' | 'status' | 'assignment' | 'resolution';
  text: string;
};

export const mockTicketActivity: TicketActivityItem[] = [
  {
    id: 'act-1',
    time: '2026-04-11 08:22',
    author: 'System',
    type: 'status',
    text: 'Ticket created and assigned initial status of New.',
  },
  {
    id: 'act-2',
    time: '2026-04-11 08:30',
    author: 'Evelyn',
    type: 'assignment',
    text: 'Assigned ticket to Evelyn for first response and triage.',
  },
  {
    id: 'act-3',
    time: '2026-04-11 08:44',
    author: 'Evelyn',
    type: 'note',
    text: 'User reports issue only occurs on office Wi-Fi, not on mobile hotspot.',
  },
  {
    id: 'act-4',
    time: '2026-04-11 09:05',
    author: 'Evelyn',
    type: 'status',
    text: 'Status changed from New to In Progress after initial troubleshooting began.',
  },
];
