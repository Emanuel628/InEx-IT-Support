export type BusinessSupportPlan = 'free' | 'v1' | 'v2' | 'trial' | 'unknown';

export type BusinessSupportSubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'unknown';

export type BusinessSupportRegion = 'US' | 'CA' | 'unknown';

export type BusinessSupportLanguage = 'en' | 'es' | 'fr' | 'unknown';

export type BusinessSupportRecord = {
  id: string;
  businessName: string;
  ownerUserId: string;
  ownerEmail: string;
  plan: BusinessSupportPlan;
  subscriptionStatus: BusinessSupportSubscriptionStatus;
  includedBusinesses: number;
  additionalBusinessSlots: number;
  businessLimit: number;
  region: BusinessSupportRegion;
  language: BusinessSupportLanguage;
  createdAt: string;
  linkedUserIds: string[];
  linkedTicketIds: string[];
  linkedErrorIds: string[];
  linkedIncidentIds: string[];
  notes: string;
  tags: string[];
  updatedAt: string;
};

export type CreateBusinessSupportInput = {
  businessName: string;
  ownerUserId: string;
  ownerEmail: string;
  plan: BusinessSupportPlan;
  subscriptionStatus: BusinessSupportSubscriptionStatus;
  includedBusinesses: number;
  additionalBusinessSlots: number;
  businessLimit: number;
  region: BusinessSupportRegion;
  language: BusinessSupportLanguage;
  createdAt: string;
  linkedUserIds: string[];
  linkedTicketIds: string[];
  linkedErrorIds: string[];
  linkedIncidentIds: string[];
  notes: string;
  tags: string[];
};
