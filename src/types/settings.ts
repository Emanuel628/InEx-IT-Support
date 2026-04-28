export type SettingsRecord = {
  defaultAssignee: string;
  technicians: string[];
  categories: string[];
  appAreas: string[];
  environments: string[];
  sources: string[];
  statuses: string[];
  priorities: string[];
  localPreferences: {
    compactTables: boolean;
    showResolvedByDefault: boolean;
    dateFormat: string;
  };
  updatedAt: string;
};
