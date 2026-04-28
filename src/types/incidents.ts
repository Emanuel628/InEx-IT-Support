export type IncidentStatus =
  | 'investigating'
  | 'identified'
  | 'monitoring'
  | 'resolved'
  | 'postmortem_needed';

export type IncidentSeverity = 'minor' | 'major' | 'critical';

export type IncidentEnvironment = 'production' | 'staging' | 'local' | 'development';

export type IncidentTimelineItem = {
  id: string;
  timestamp: string;
  actor: string;
  summary: string;
};

export type IncidentRecord = {
  id: string;
  title: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  environment: IncidentEnvironment;
  affectedAreas: string[];
  customerImpact: string;
  startedAt: string;
  resolvedAt: string;
  rootCause: string;
  workaround: string;
  resolutionSummary: string;
  relatedTicketIds: string[];
  relatedErrorIds: string[];
  relatedReleaseId: string;
  relatedResolutionId: string;
  timeline: IncidentTimelineItem[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateIncidentInput = {
  title: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  environment: IncidentEnvironment;
  affectedAreas: string[];
  customerImpact: string;
  startedAt: string;
  resolvedAt: string;
  rootCause: string;
  workaround: string;
  resolutionSummary: string;
  relatedTicketIds: string[];
  relatedErrorIds: string[];
  relatedReleaseId: string;
  relatedResolutionId: string;
  tags: string[];
};
