export type TicketStatus = 'new' | 'in_progress' | 'waiting_on_user' | 'escalated' | 'resolved';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type TicketCategory =
  | 'hardware'
  | 'software'
  | 'network'
  | 'access'
  | 'printer'
  | 'email'
  | 'security';

export type TicketRecord = {
  id: string;
  title: string;
  requester: string;
  department: string;
  asset: string;
  assignedTech: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
};
