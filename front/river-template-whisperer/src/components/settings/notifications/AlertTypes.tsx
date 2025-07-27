
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Control } from 'react-hook-form';

interface AlertTypesProps {
  control: Control<any>;
}

const AlertTypes: React.FC<AlertTypesProps> = ({ control }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alert Types</CardTitle>
        <CardDescription>Select which types of alerts you want to receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="warningNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-yellow-200">
              <div className="space-y-0.5">
                <FormLabel className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-river-warning" />
                  Warning Level Alerts
                </FormLabel>
                <FormDescription>
                  When water quality parameters reach warning thresholds
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="criticalNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-red-200">
              <div className="space-y-0.5">
                <FormLabel className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-river-danger" />
                  Critical Condition Alerts
                </FormLabel>
                <FormDescription>
                  When water quality parameters reach critical thresholds
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="maintenanceNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Maintenance Notifications
                </FormLabel>
                <FormDescription>
                  Updates about system maintenance and downtime
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="weeklyReports"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Weekly Summary Reports
                </FormLabel>
                <FormDescription>
                  Receive weekly summary of water quality trends
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default AlertTypes;
