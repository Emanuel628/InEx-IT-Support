export type TicketStatus = 'new' | 'in_progress' | 'waiting_on_user' | 'escalated' | 'resolved' | 'archived';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type TicketCategory =
  | 'bug'
  | 'billing'
  | 'exports'
  | 'receipts'
  | 'authentication'
  | 'data_integrity'
  | 'ui_ux'
  | 'feature_request'
  | 'infrastructure'
  | 'account_access'
  | 'business_context'
  | 'deployment';

export type TicketSource = 'manual' | 'email' | 'contact_form' | 'internal' | 'error_log' | 'incident';

export type TicketEnvironment = 'production' | 'staging' | 'local' | 'development';

export type TicketAppArea =
  | 'auth'
  | 'transactions'
  | 'accounts'
  | 'categories'
  | 'receipts'
  | 'exports'
  | 'billing'
  | 'settings'
  | 'dashboard'
  | 'onboarding'
  | 'email'
  | 'database'
  | 'api'
  | 'frontend'
  | 'deployment'
  | 'unknown';

export type TicketSeverity = 'minor' | 'major' | 'critical';

export type TicketActivityType = 'note' | 'status' | 'assignment' | 'resolution';

export type TicketActivityItem = {
  id: string;
  time: string;
  author: string;
  type: TicketActivityType;
  text: string;
};

export type TicketRecord = {
  id: string;
  title: string;
  requester: string;
  requesterEmail: string;
  businessName: string;
  department: string;
  asset: string;
  assignedTech: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  source: TicketSource;
  environment: TicketEnvironment;
  appArea: TicketAppArea;
  severity: TicketSeverity;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  details: string;
  reproductionSteps: string;
  expectedResult: string;
  actualResult: string;
  workaround: string;
  relatedBusinessId: string;
  relatedUserId: string;
  relatedRelease: string;
  relatedErrorIds: string[];
  relatedIncidentId: string;
  relatedResolutionId: string;
  relatedKnowledgeArticleIds: string[];
  tags: string[];
  activity: TicketActivityItem[];
};

export type CreateTicketInput = {
  title: string;
  requester: string;
  requesterEmail: string;
  businessName: string;
  department: string;
  asset: string;
  assignedTech: string;
  priority: TicketPriority;
  category: TicketCategory;
  source: TicketSource;
  environment: TicketEnvironment;
  appArea: TicketAppArea;
  severity: TicketSeverity;
  dueAt: string;
  details: string;
  reproductionSteps: string;
  expectedResult: string;
  actualResult: string;
  workaround: string;
  relatedBusinessId: string;
  relatedUserId: string;
  relatedRelease: string;
  relatedErrorIds: string[];
  relatedIncidentId: string;
  relatedResolutionId: string;
  relatedKnowledgeArticleIds: string[];
  tags: string[];
};