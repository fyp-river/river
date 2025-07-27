
import { z } from 'zod';

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  appNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  alertFrequency: z.enum(['immediate', 'hourly', 'daily', 'weekly']).default('immediate'),
  warningNotifications: z.boolean().default(true),
  criticalNotifications: z.boolean().default(true),
  maintenanceNotifications: z.boolean().default(false),
  weeklyReports: z.boolean().default(true),
});

export type NotificationSettingsFormValues = z.infer<typeof notificationSettingsSchema>;

export const defaultNotificationSettings: NotificationSettingsFormValues = {
  emailNotifications: true,
  appNotifications: true,
  smsNotifications: false,
  alertFrequency: 'immediate',
  warningNotifications: true,
  criticalNotifications: true,
  maintenanceNotifications: false,
  weeklyReports: true,
};
