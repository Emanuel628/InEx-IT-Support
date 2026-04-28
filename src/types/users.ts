export type SupportUserRole = 'owner' | 'admin' | 'member' | 'accountant' | 'viewer' | 'unknown';

export type SupportUserPlan = 'free' | 'v1' | 'v2' | 'trial' | 'unknown';

export type SupportUserSubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'unknown';

export type SupportUserRegion = 'US' | 'CA' | 'unknown';

export type SupportUserLanguage = 'en' | 'es' | 'fr' | 'unknown';

export type SupportUserRecord = {
  id: string;
  displayName: string;
  email: string;
  role: SupportUserRole;
  emailVerified: boolean;
  relatedBusinessIds: string[];
  plan: SupportUserPlan;
  subscriptionStatus: SupportUserSubscriptionStatus;
  region: SupportUserRegion;
  language: SupportUserLanguage;
  createdAt: string;
  notes: string;
  linkedTicketIds: string[];
  linkedErrorIds: string[];
  tags: string[];
  updatedAt: string;
};

export type CreateSupportUserInput = {
  displayName: string;
  email: string;
  role: SupportUserRole;
  emailVerified: boolean;
  relatedBusinessIds: string[];
  plan: SupportUserPlan;
  subscriptionStatus: SupportUserSubscriptionStatus;
  region: SupportUserRegion;
  language: SupportUserLanguage;
  createdAt: string;
  notes: string;
  linkedTicketIds: string[];
  linkedErrorIds: string[];
  tags: string[];
};
