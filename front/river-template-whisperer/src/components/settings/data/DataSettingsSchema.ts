
import { z } from "zod";

export const dataSettingsSchema = z.object({
  dataRefreshRate: z.string(),
  offlineMode: z.boolean(),
  autoSync: z.boolean(),
  dataExportFormat: z.string(),
  includePH: z.boolean(),
  includeTemp: z.boolean(),
  includeTurbidity: z.boolean(),
  includeDissolvedOxygen: z.boolean(),
  includeNitrates: z.boolean(),
  includePhosphates: z.boolean(),
  historicalDataLimit: z.string(),
  advancedFiltering: z.boolean()
});

export type DataSettingsValues = z.infer<typeof dataSettingsSchema>;

export const defaultDataSettings: DataSettingsValues = {
  dataRefreshRate: '5',
  offlineMode: false,
  autoSync: true,
  dataExportFormat: 'csv',
  includePH: true,
  includeTemp: true,
  includeTurbidity: true,
  includeDissolvedOxygen: true,
  includeNitrates: true,
  includePhosphates: false,
  historicalDataLimit: '30',
  advancedFiltering: false
};
