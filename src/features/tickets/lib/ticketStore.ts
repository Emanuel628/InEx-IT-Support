import type { TicketActivityItem } from '@/features/tickets/data/mockTicketActivity';
import { mockTickets } from '@/features/tickets/data/mockTickets';
import type {
  CreateTicketInput,
  TicketActivityType,
  TicketRecord,
  TicketSource,
  TicketStatus,
} from '@/types/tickets';

const STORAGE_KEY = 'inex-it-support:tickets';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

function normalizeTickets(raw: unknown): TicketRecord[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.filter((item): item is TicketRecord => {
    return Boolean(item)
      && typeof item === 'object'
      && typeof (item as TicketRecord).id === 'string'
      && typeof (item as TicketRecord).title === 'string';
  });
}

function readStoredTickets(): TicketRecord[] {
  if (!canUseStorage()) {
    return mockTickets;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTickets));
      return mockTickets;
    }

    const parsed = JSON.parse(raw) as unknown;
    const tickets = normalizeTickets(parsed);
    if (!tickets.length) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTickets));
      return mockTickets;
    }
    return tickets;
  } catch {
    return mockTickets;
  }
}

function writeStoredTickets(tickets: TicketRecord[]) {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function nextTicketId(existing: TicketRecord[]) {
  const highest = existing.reduce((max, ticket) => {
    const numeric = Number(ticket.id.replace(/[^0-9]/g, ''));
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 1200);

  return `INC-${String(highest + 1).padStart(4, '0')}`;
}

function buildCreatedActivity(ticket: TicketRecord): TicketActivityItem[] {
  const createdText = `Ticket created for ${ticket.appArea.replace(/_/g, ' ')} in ${ticket.environment.toUpperCase()} by ${ticket.requester}.`;
  const assignmentText = ticket.assignedTech
    ? `Assigned to ${ticket.assignedTech} for initial triage.`
    : 'Ticket created without an assignee yet.';

  const items: TicketActivityItem[] = [
    {
      id: `${ticket.id}-act-1`,
      time: ticket.createdAt,
      author: 'System',
      type: 'status',
      text: createdText,
    },
    {
      id: `${ticket.id}-act-2`,
      time: ticket.updatedAt,
      author: ticket.assignedTech || 'System',
      type: ticket.assignedTech ? 'assignment' : 'note',
      text: assignmentText,
    },
  ];

  if (ticket.details) {
    items.push({
      id: `${ticket.id}-act-3`,
      time: ticket.updatedAt,
      author: ticket.requester,
      type: 'note',
      text: ticket.details,
    });
  }

  return items;
}

export function getTickets() {
  return readStoredTickets().sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function getTicketById(ticketId: string) {
  return getTickets().find((ticket) => ticket.id === ticketId) || null;
}

export function createTicket(input: CreateTicketInput) {
  const existing = readStoredTickets();
  const timestamp = nowIsoLike();
  const ticket: TicketRecord = {
    id: nextTicketId(existing),
    title: input.title.trim(),
    requester: input.requester.trim(),
    requesterEmail: input.requesterEmail.trim(),
    businessName: input.businessName.trim(),
    department: input.department.trim() || 'Customer Support',
    asset: input.asset.trim() || 'Web app / account context',
    assignedTech: input.assignedTech.trim() || 'Unassigned',
    status: 'new',
    priority: input.priority,
    category: input.category,
    source: input.source,
    environment: input.environment,
    appArea: input.appArea,
    severity: input.severity,
    createdAt: timestamp,
    updatedAt: timestamp,
    dueAt: input.dueAt,
    details: input.details.trim(),
    reproductionSteps: input.reproductionSteps.trim(),
    expectedResult: input.expectedResult.trim(),
    actualResult: input.actualResult.trim(),
    workaround: input.workaround.trim(),
    relatedBusinessId: input.relatedBusinessId.trim(),
    relatedUserId: input.relatedUserId.trim(),
    relatedRelease: input.relatedRelease.trim(),
    tags: input.tags,
    activity: [],
  };

  ticket.activity = buildCreatedActivity(ticket);

  const nextTickets = [ticket, ...existing];
  writeStoredTickets(nextTickets);
  return ticket;
}

export function updateTicketStatus(ticketId: string, status: TicketStatus) {
  const tickets = readStoredTickets();
  const next = tickets.map((ticket) => {
    if (ticket.id !== ticketId) {
      return ticket;
    }

    const updatedAt = nowIsoLike();
    const statusEntry: TicketActivityItem = {
      id: `${ticket.id}-act-${ticket.activity.length + 1}`,
      time: updatedAt,
      author: 'System',
      type: 'status',
      text: `Status changed from ${ticket.status.replace(/_/g, ' ')} to ${status.replace(/_/g, ' ')}.`,
    };

    return {
      ...ticket,
      status,
      updatedAt,
      activity: [statusEntry, ...ticket.activity],
    };
  });

  writeStoredTickets(next);
}

export function getTicketActivity(ticketId: string): TicketActivityItem[] {
  return getTicketById(ticketId)?.activity || [];
}

export function getActivityBadgeLabel(type: TicketActivityType) {
  switch (type) {
    case 'assignment':
      return 'Assignment';
    case 'resolution':
      return 'Resolution';
    case 'status':
      return 'Status';
    default:
      return 'Note';
  }
}

export function getSourceLabel(source: TicketSource) {
  switch (source) {
    case 'contact_form':
      return 'Contact form';
    case 'manual':
      return 'Manual';
    default:
      return source.charAt(0).toUpperCase() + source.slice(1);
  }
}
