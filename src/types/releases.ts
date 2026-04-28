export type ReleaseEnvironment = 'production' | 'staging' | 'local' | 'development';

export type ReleaseRecord = {
  id: string;
  title: string;
  version: string;
  commitSha: string;
  environment: ReleaseEnvironment;
  releaseDate: string;
  summary: string;
  changedAreas: string[];
  migrationsIncluded: boolean;
  knownRisks: string[];
  verificationChecklist: string[];
  rollbackNotes: string;
  relatedTicketIds: string[];
  relatedErrorIds: string[];
  relatedIncidentIds: string[];
  relatedResolutionIds: string[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

export type CreateReleaseInput = {
  title: string;
  version: string;
  commitSha: string;
  environment: ReleaseEnvironment;
  releaseDate: string;
  summary: string;
  changedAreas: string[];
  migrationsIncluded: boolean;
  knownRisks: string[];
  verificationChecklist: string[];
  rollbackNotes: string;
  relatedTicketIds: string[];
  relatedErrorIds: string[];
  relatedIncidentIds: string[];
  relatedResolutionIds: string[];
  tags: string[];
};
