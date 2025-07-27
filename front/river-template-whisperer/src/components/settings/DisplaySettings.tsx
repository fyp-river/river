
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Droplets, Brush, Moon, Sun, Monitor } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSettingsPersistence } from '@/hooks/useSettingsPersistence';

interface DisplaySettingsValues {
  theme: string;
  dataVisualization: string;
  highContrastMode: boolean;
  animatedTransitions: boolean;
  mapStyle: string;
  fontSize: string;
  colorMode: string;
}

const defaultDisplaySettings: DisplaySettingsValues = {
  theme: 'river',
  dataVisualization: 'charts',
  highContrastMode: false,
  animatedTransitions: true,
  mapStyle: 'satellite',
  fontSize: 'medium',
  colorMode: 'system'
};

const DisplaySettings = () => {
  const form = useForm<DisplaySettingsValues>({
    defaultValues: defaultDisplaySettings
  });

  const { saveSettings } = useSettingsPersistence(form, 'display-settings');

  const onSubmit = (data: DisplaySettingsValues) => {
    console.log('Display settings updated:', data);
    saveSettings(data);
    toast({
      title: "Settings saved",
      description: "Your display preferences have been updated and saved."
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Theme Settings</CardTitle>
            <CardDescription>Customize the appearance of your RiverWatcher dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="colorMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Mode</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="light" aria-label="Light Mode">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </ToggleGroupItem>
                      <ToggleGroupItem value="dark" aria-label="Dark Mode">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </ToggleGroupItem>
                      <ToggleGroupItem value="system" aria-label="System Mode">
                        <Monitor className="h-4 w-4 mr-2" />
                        System
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormDescription>
                    Choose between light, dark, or system preference for the interface
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Theme</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="river" id="theme-river" />
                        <Label htmlFor="theme-river" className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-river-blue-light mr-2"></div>
                          River Blue (Default)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="forest" id="theme-forest" />
                        <Label htmlFor="theme-forest" className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
                          Forest Green
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="sunset" id="theme-sunset" />
                        <Label htmlFor="theme-sunset" className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                          Sunset Orange
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark" className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-gray-800 mr-2"></div>
                          Dark Monochrome
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Select a color theme for the application
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fontSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium (Default)</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="xlarge">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Adjust the text size across the application
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Visualization</CardTitle>
            <CardDescription>Configure how data is displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="dataVisualization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default View</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select view type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="charts">Charts & Graphs</SelectItem>
                      <SelectItem value="tables">Data Tables</SelectItem>
                      <SelectItem value="cards">Cards</SelectItem>
                      <SelectItem value="mixed">Mixed Display</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose your preferred way to visualize water quality data
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="mapStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select map style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the default style for map views
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="highContrastMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Brush className="h-4 w-4" />
                      High Contrast Mode
                    </FormLabel>
                    <FormDescription>
                      Increase contrast for better visibility
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
              control={form.control}
              name="animatedTransitions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      Animated Transitions
                    </FormLabel>
                    <FormDescription>
                      Enable smooth animations throughout the interface
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
        
        <div className="flex justify-end">
          <Button type="submit">Save Display Settings</Button>
        </div>
      </form>
    </Form>
  );
};

export default DisplaySettings;
