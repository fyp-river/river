
import React, { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { defaultDataSettings, DataSettingsValues } from './data/DataSettingsSchema';
import CollectionSettings from './data/CollectionSettings';
import ParametersSettings from './data/ParametersSettings';
import AdvancedFilteringSettings from './data/AdvancedFilteringSettings';
import { useSettingsPersistence } from '@/hooks/useSettingsPersistence';

const DataSettings = () => {
  const form = useForm<DataSettingsValues>({
    defaultValues: defaultDataSettings
  });

  const { saveSettings } = useSettingsPersistence(form, 'data-settings');

  const onSubmit = (data: DataSettingsValues) => {
    console.log('Data settings updated:', data);
    saveSettings(data);
    toast({
      title: "Settings saved",
      description: "Your data collection and display settings have been updated and saved."
    });
  };

  const [isOpenAdvanced, setIsOpenAdvanced] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Collection Settings</CardTitle>
            <CardDescription>Configure how data is collected and displayed</CardDescription>
          </CardHeader>
          <CollectionSettings control={form.control} />
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monitored Parameters</CardTitle>
            <CardDescription>Select which water quality parameters to track</CardDescription>
          </CardHeader>
          <ParametersSettings control={form.control} />
        </Card>
        
        <Collapsible open={isOpenAdvanced} onOpenChange={setIsOpenAdvanced} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="outline" type="button" className="flex w-full justify-between">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced Data Filtering
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpenAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Card>
              <AdvancedFilteringSettings control={form.control} />
            </Card>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="flex justify-end">
          <Button type="submit">Save Data Settings</Button>
        </div>
      </form>
    </Form>
  );
};

export default DataSettings;
