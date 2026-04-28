import type { TicketActivityItem } from '@/features/tickets/data/mockTicketActivity';
import { mockTickets } from '@/features/tickets/data/mockTickets';
import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type {
  CreateTicketInput,
  TicketActivityType,
  TicketPriority,
  TicketRecord,
  TicketSource,
  TicketStatus,
} from '@/types/tickets';

const STORAGE_KEY = 'inex-it-support:tickets';
const SCHEMA_VERSION_KEY = 'inex-it-support:schema-version';
const SCHEMA_VERSION_VALUE = '1';

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

function normalizeTickets(raw: unknown): raw is TicketRecord[] {
  if (!Array.isArray(raw)) {
    return false;
  }

  return raw.every((item) => {
    return Boolean(item)
      && typeof item === 'object'
      && typeof (item as TicketRecord).id === 'string'
      && typeof (item as TicketRecord).title === 'string';
  });
}

function readStoredTickets(): TicketRecord[] {
  return readLocalStore<TicketRecord[]>({
    storageKey: STORAGE_KEY,
    fallbackValue: mockTickets,
    schemaVersionKey: SCHEMA_VERSION_KEY,
    schemaVersionValue: SCHEMA_VERSION_VALUE,
    validate: normalizeTickets,
  });
}

function writeStoredTickets(tickets: TicketRecord[]) {
  writeLocalStore(STORAGE_KEY, tickets);
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

function nextActivityId(ticket: TicketRecord) {
  return `${ticket.id}-act-${ticket.activity.length + 1}`;
}

function prependActivity(
  ticket: TicketRecord,
  entry: Omit<TicketActivityItem, 'id' | 'time'>,
  updatedAt: string,
): TicketRecord {
  const activityEntry: TicketActivityItem = {
    id: nextActivityId(ticket),
    time: updatedAt,
    author: entry.author,
    type: entry.type,
    text: entry.text,
  };

  return {
    ...ticket,
    updatedAt,
    activity: [activityEntry, ...ticket.activity],
  };
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
    relatedErrorIds: input.relatedErrorIds,
    relatedIncidentId: input.relatedIncidentId.trim(),
    relatedResolutionId: input.relatedResolutionId.trim(),
    relatedKnowledgeArticleIds: input.relatedKnowledgeArticleIds,
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
    if (ticket.id !== ticketId || ticket.status === status) {
      return ticket;
    }

    const updatedAt = nowIsoLike();
    return prependActivity(
      {
        ...ticket,
        status,
      },
      {
        author: 'System',
        type: 'status',
        text: `Status changed from ${ticket.status.replace(/_/g, ' ')} to ${status.replace(/_/g, ' ')}.`,
      },
      updatedAt,
    );
  });

  writeStoredTickets(next);
}

export function updateTicketAssignment(ticketId: string, assignedTech: string) {
  const tickets = readStoredTickets();
  const cleanAssignedTech = assignedTech.trim() || 'Unassigned';

  const next = tickets.map((ticket) => {
    if (ticket.id !== ticketId || ticket.assignedTech === cleanAssignedTech) {
      return ticket;
    }

    const updatedAt = nowIsoLike();
    return prependActivity(
      {
        ...ticket,
        assignedTech: cleanAssignedTech,
      },
      {
        author: 'System',
        type: 'assignment',
        text: `Assignment changed from ${ticket.assignedTech || 'Unassigned'} to ${cleanAssignedTech}.`,
      },
      updatedAt,
    );
  });

  writeStoredTickets(next);
}

export function updateTicketPriority(ticketId: string, priority: TicketPriority) {
  const tickets = readStoredTickets();

  const next = tickets.map((ticket) => {
    if (ticket.id !== ticketId || ticket.priority === priority) {
      return ticket;
    }

    const updatedAt = nowIsoLike();
    return prependActivity(
      {
        ...ticket,
        priority,
      },
      {
        author: 'System',
        type: 'note',
        text: `Priority changed from ${ticket.priority} to ${priority}.`,
      },
      updatedAt,
    );
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
    case 'error_log':
      return 'Error log';
    default:
      return source.charAt(0).toUpperCase() + source.slice(1);
  }
}
