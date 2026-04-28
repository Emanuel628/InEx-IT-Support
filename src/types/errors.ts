export type ErrorLogSource =
  | 'frontend_console'
  | 'api'
  | 'railway_logs'
  | 'github_actions'
  | 'stripe_webhook'
  | 'resend_email'
  | 'database'
  | 'pdf_worker'
  | 'manual';

export type ErrorLogEnvironment = 'production' | 'staging' | 'local' | 'development';

export type ErrorLogAppArea =
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

export type ErrorLogSeverity = 'minor' | 'major' | 'critical';

export type ErrorLogStatus =
  | 'new'
  | 'triaged'
  | 'linked_to_ticket'
  | 'investigating'
  | 'fixed'
  | 'ignored'
  | 'recurring';

export type ErrorLogRecord = {
  id: string;
  title: string;
  message: string;
  rawLog: string;
  stackTrace: string;
  source: ErrorLogSource;
  environment: ErrorLogEnvironment;
  appArea: ErrorLogAppArea;
  severity: ErrorLogSeverity;
  status: ErrorLogStatus;
  firstSeenAt: string;
  lastSeenAt: string;
  occurrenceCount: number;
  affectedUserId: string;
  affectedBusinessId: string;
  relatedTicketIds: string[];
  relatedIncidentId: string;
  relatedResolutionId: string;
  relatedReleaseId: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateErrorLogInput = {
  title: string;
  message: string;
  rawLog: string;
  stackTrace: string;
  source: ErrorLogSource;
  environment: ErrorLogEnvironment;
  appArea: ErrorLogAppArea;
  severity: ErrorLogSeverity;
  status: ErrorLogStatus;
  firstSeenAt: string;
  lastSeenAt: string;
  occurrenceCount: number;
  affectedUserId: string;
  affectedBusinessId: string;
  relatedTicketIds: string[];
  relatedIncidentId: string;
  relatedResolutionId: string;
  relatedReleaseId: string;
  notes: string;
  tags: string[];
};
