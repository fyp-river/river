
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { DataSettingsValues } from './DataSettingsSchema';

interface AdvancedFilteringSettingsProps {
  control: Control<DataSettingsValues>;
}

const AdvancedFilteringSettings: React.FC<AdvancedFilteringSettingsProps> = ({ control }) => {
  return (
    <CardContent className="pt-6 space-y-4">
      <FormField
        control={control}
        name="advancedFiltering"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Enable Advanced Filtering
              </FormLabel>
              <FormDescription>
                Show advanced data filtering options in dashboard
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
      
      <div className="space-y-4">
        <Label>Custom Alert Thresholds</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ph-min" className="text-xs text-muted-foreground">pH Min</Label>
            <Input id="ph-min" placeholder="6.5" type="number" step="0.1" />
          </div>
          <div>
            <Label htmlFor="ph-max" className="text-xs text-muted-foreground">pH Max</Label>
            <Input id="ph-max" placeholder="8.5" type="number" step="0.1" />
          </div>
          <div>
            <Label htmlFor="temp-min" className="text-xs text-muted-foreground">Temp Min (°C)</Label>
            <Input id="temp-min" placeholder="10" type="number" />
          </div>
          <div>
            <Label htmlFor="temp-max" className="text-xs text-muted-foreground">Temp Max (°C)</Label>
            <Input id="temp-max" placeholder="25" type="number" />
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default AdvancedFilteringSettings;
