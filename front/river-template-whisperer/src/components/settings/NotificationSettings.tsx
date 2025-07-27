
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import NotificationChannels from './notifications/NotificationChannels';
import AlertTypes from './notifications/AlertTypes';
import { defaultNotificationSettings, NotificationSettingsFormValues } from './notifications/NotificationSettingsSchema';
import { useSettingsPersistence } from '@/hooks/useSettingsPersistence';

const NotificationSettings = () => {
  const form = useForm<NotificationSettingsFormValues>({
    defaultValues: defaultNotificationSettings
  });

  const { saveSettings } = useSettingsPersistence(form, 'notification-settings');

  const onSubmit = (data: NotificationSettingsFormValues) => {
    console.log('Notification settings updated:', data);
    saveSettings(data);
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated and saved."
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NotificationChannels control={form.control} />
        <AlertTypes control={form.control} />
        
        <div className="flex justify-end">
          <Button type="submit">Save Notification Settings</Button>
        </div>
      </form>
    </Form>
  );
};

export default NotificationSettings;
