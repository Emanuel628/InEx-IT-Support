export type ResolutionRecord = {
  id: string;
  title: string;
  problemSummary: string;
  rootCause: string;
  fixApplied: string;
  filesOrAreasTouched: string[];
  commandsUsed: string[];
  verificationSteps: string[];
  rollbackNotes: string;
  relatedTicketIds: string[];
  relatedErrorIds: string[];
  relatedIncidentId: string;
  relatedReleaseId: string;
  relatedKnowledgeArticleIds: string[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

export type CreateResolutionInput = {
  title: string;
  problemSummary: string;
  rootCause: string;
  fixApplied: string;
  filesOrAreasTouched: string[];
  commandsUsed: string[];
  verificationSteps: string[];
  rollbackNotes: string;
  relatedTicketIds: string[];
  relatedErrorIds: string[];
  relatedIncidentId: string;
  relatedReleaseId: string;
  relatedKnowledgeArticleIds: string[];
  tags: string[];
};
