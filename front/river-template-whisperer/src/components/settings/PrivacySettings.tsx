
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const PrivacySettings = () => {
  const form = useForm({
    defaultValues: {
      dataSharingConsent: false,
      trackUsage: true,
      privacyLevel: 'standard',
      autoLogout: true,
      logoutTime: '30',
      deleteDataAfter: 'never'
    }
  });

  const onSubmit = (data: any) => {
    console.log('Privacy settings updated:', data);
    toast({
      title: "Settings saved",
      description: "Your privacy and security settings have been updated."
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-4 w-4 text-river-purple-light" />
              Privacy Settings
            </CardTitle>
            <CardDescription>Manage how your data is shared and used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="dataSharingConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Data Sharing Consent
                    </FormLabel>
                    <FormDescription>
                      Allow your data to be used for research and improving water quality monitoring
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
              name="trackUsage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Usage Analytics
                    </FormLabel>
                    <FormDescription>
                      Allow collection of anonymous usage data to improve the application
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
              name="privacyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2 space-y-0 rounded-md border p-3">
                        <RadioGroupItem value="minimal" id="privacy-minimal" />
                        <Label htmlFor="privacy-minimal" className="font-normal flex-1">
                          <div className="font-medium flex items-center gap-2 mb-1">
                            <Eye className="h-4 w-4" />
                            Minimal Privacy
                          </div>
                          <span className="text-muted-foreground text-xs">
                            Share station locations and readings publicly to contribute to open data efforts
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-y-0 rounded-md border p-3">
                        <RadioGroupItem value="standard" id="privacy-standard" />
                        <Label htmlFor="privacy-standard" className="font-normal flex-1">
                          <div className="font-medium flex items-center gap-2 mb-1">
                            <Shield className="h-4 w-4" />
                            Standard Privacy
                          </div>
                          <span className="text-muted-foreground text-xs">
                            Share anonymized data with trusted research partners only
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-y-0 rounded-md border p-3">
                        <RadioGroupItem value="maximum" id="privacy-maximum" />
                        <Label htmlFor="privacy-maximum" className="font-normal flex-1">
                          <div className="font-medium flex items-center gap-2 mb-1">
                            <EyeOff className="h-4 w-4" />
                            Maximum Privacy
                          </div>
                          <span className="text-muted-foreground text-xs">
                            Keep all data private and do not share with any third parties
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-4 w-4 text-river-purple-light" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure security options for your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="autoLogout"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Auto Logout
                    </FormLabel>
                    <FormDescription>
                      Automatically log out after period of inactivity
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
            
            {form.watch('autoLogout') && (
              <FormField
                control={form.control}
                name="logoutTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logout After Inactivity (minutes)</FormLabel>
                    <FormControl>
                      <Input placeholder="30" type="number" min="5" max="120" {...field} />
                    </FormControl>
                    <FormDescription>
                      Number of minutes before automatic logout (5-120)
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="deleteDataAfter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Data Retention Period
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2 space-y-0">
                        <RadioGroupItem value="never" id="retention-never" />
                        <Label htmlFor="retention-never">Never delete data</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-y-0">
                        <RadioGroupItem value="1year" id="retention-1year" />
                        <Label htmlFor="retention-1year">After 1 year</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-y-0">
                        <RadioGroupItem value="6months" id="retention-6months" />
                        <Label htmlFor="retention-6months">After 6 months</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-y-0">
                        <RadioGroupItem value="custom" id="retention-custom" />
                        <Label htmlFor="retention-custom">Custom period</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Choose how long to retain your historical water quality data
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Export Request</CardTitle>
            <CardDescription>Request a copy of all your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can request an export of all your data at any time. This will include your personal information,
              preferences, and all water quality data you've collected.
            </p>
            <Button variant="outline" type="button">Request Data Export</Button>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit">Save Privacy Settings</Button>
        </div>
      </form>
    </Form>
  );
};

export default PrivacySettings;
