
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Database, CloudOff, Download } from 'lucide-react';
import { Control } from 'react-hook-form';
import { DataSettingsValues } from './DataSettingsSchema';

interface CollectionSettingsProps {
  control: Control<DataSettingsValues>;
}

const CollectionSettings: React.FC<CollectionSettingsProps> = ({ control }) => {
  return (
    <CardContent className="space-y-6">
      <FormField
        control={control}
        name="dataRefreshRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data Refresh Rate (minutes)</FormLabel>
            <FormControl>
              <div className="relative">
                <RefreshCw className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="5" className="pl-10" type="number" min="1" max="60" {...field} />
              </div>
            </FormControl>
            <FormDescription>
              How often to refresh data from monitoring stations (1-60 minutes)
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="historicalDataLimit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Historical Data Display (days)</FormLabel>
            <FormControl>
              <div className="relative">
                <Database className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="30" className="pl-10" type="number" min="1" max="365" {...field} />
              </div>
            </FormControl>
            <FormDescription>
              Number of days of historical data to display in charts (1-365 days)
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="offlineMode"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base flex items-center gap-2">
                <CloudOff className="h-4 w-4" />
                Offline Mode
              </FormLabel>
              <FormDescription>
                Work with cached data when internet connection is unavailable
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
        name="autoSync"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Auto-Sync When Online
              </FormLabel>
              <FormDescription>
                Automatically sync offline changes when connection is restored
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
        name="dataExportFormat"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Data Export Format
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF Report</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Default format for exporting water quality data
            </FormDescription>
          </FormItem>
        )}
      />
    </CardContent>
  );
};

export default CollectionSettings;
