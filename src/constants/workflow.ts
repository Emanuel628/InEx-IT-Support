import type { TicketAppArea, TicketCategory, TicketEnvironment, TicketPriority, TicketSeverity, TicketSource, TicketStatus } from '@/types/tickets';
import type { ErrorLogAppArea, ErrorLogEnvironment, ErrorLogSeverity, ErrorLogSource, ErrorLogStatus } from '@/types/errors';
import type { IncidentSeverity, IncidentStatus } from '@/types/incidents';

export const TICKET_STATUSES: TicketStatus[] = [
  'new',
  'in_progress',
  'waiting_on_user',
  'escalated',
  'resolved',
];

export const TICKET_PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'critical'];

export const TICKET_SEVERITIES: TicketSeverity[] = ['minor', 'major', 'critical'];

export const TICKET_SOURCES: TicketSource[] = ['manual', 'email', 'contact_form'];

export const TICKET_CATEGORIES: TicketCategory[] = [
  'bug',
  'billing',
  'exports',
  'receipts',
  'authentication',
  'data_integrity',
  'ui_ux',
  'feature_request',
  'infrastructure',
];

export const TICKET_ENVIRONMENTS: TicketEnvironment[] = ['production', 'staging', 'local'];

export const TICKET_APP_AREAS: TicketAppArea[] = [
  'auth',
  'transactions',
  'accounts',
  'categories',
  'receipts',
  'exports',
  'billing',
  'settings',
  'dashboard',
  'unknown',
];

export const ERROR_LOG_STATUSES: ErrorLogStatus[] = [
  'new',
  'triaged',
  'linked_to_ticket',
  'investigating',
  'fixed',
  'ignored',
  'recurring',
];

export const ERROR_LOG_SOURCES: ErrorLogSource[] = [
  'frontend_console',
  'api',
  'railway_logs',
  'github_actions',
  'stripe_webhook',
  'resend_email',
  'database',
  'pdf_worker',
  'manual',
];

export const ERROR_LOG_ENVIRONMENTS: ErrorLogEnvironment[] = ['production', 'staging', 'local', 'development'];

export const ERROR_LOG_APP_AREAS: ErrorLogAppArea[] = [
  'auth',
  'transactions',
  'accounts',
  'categories',
  'receipts',
  'exports',
  'billing',
  'settings',
  'dashboard',
  'onboarding',
  'email',
  'database',
  'api',
  'frontend',
  'deployment',
  'unknown',
];

export const ERROR_LOG_SEVERITIES: ErrorLogSeverity[] = ['minor', 'major', 'critical'];

export const INCIDENT_STATUSES: IncidentStatus[] = [
  'investigating',
  'identified',
  'monitoring',
  'resolved',
  'postmortem_needed',
];

export const INCIDENT_SEVERITIES: IncidentSeverity[] = ['minor', 'major', 'critical'];
