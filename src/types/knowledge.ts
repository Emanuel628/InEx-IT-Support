export type KnowledgeArticleType =
  | 'how_to'
  | 'troubleshooting'
  | 'known_issue'
  | 'internal_procedure'
  | 'escalation_guide'
  | 'customer_response_template';

export type KnowledgeArticleCategory =
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

export type KnowledgeArticleAppArea =
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

export type KnowledgeArticleRecord = {
  id: string;
  title: string;
  articleType: KnowledgeArticleType;
  category: KnowledgeArticleCategory;
  appArea: KnowledgeArticleAppArea;
  summary: string;
  symptoms: string;
  cause: string;
  troubleshootingSteps: string[];
  resolutionSteps: string[];
  escalationRules: string;
  customerResponseTemplate: string;
  internalNotes: string;
  relatedTicketIds: string[];
  relatedResolutionIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateKnowledgeArticleInput = {
  title: string;
  articleType: KnowledgeArticleType;
  category: KnowledgeArticleCategory;
  appArea: KnowledgeArticleAppArea;
  summary: string;
  symptoms: string;
  cause: string;
  troubleshootingSteps: string[];
  resolutionSteps: string[];
  escalationRules: string;
  customerResponseTemplate: string;
  internalNotes: string;
  relatedTicketIds: string[];
  relatedResolutionIds: string[];
  tags: string[];
};
