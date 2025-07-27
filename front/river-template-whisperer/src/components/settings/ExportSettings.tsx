
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Database } from 'lucide-react';
import { exportSettings, exportToCSV } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';

const ExportSettings = () => {
  const handleExportSettings = () => {
    try {
      const allSettings = {
        notification: JSON.parse(localStorage.getItem('notification-settings') || '{}'),
        data: JSON.parse(localStorage.getItem('data-settings') || '{}'),
        display: JSON.parse(localStorage.getItem('display-settings') || '{}'),
        exportedAt: new Date().toISOString()
      };
      
      exportSettings(allSettings);
      toast({
        title: "Settings exported",
        description: "Your settings have been downloaded as a JSON file."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your settings.",
        variant: "destructive"
      });
    }
  };

  const handleExportSampleData = () => {
    const sampleData = [
      { timestamp: '2024-01-01T10:00:00Z', pH: 7.2, temperature: 18.5, turbidity: 2.1, station: 'Alpha' },
      { timestamp: '2024-01-01T11:00:00Z', pH: 7.1, temperature: 18.8, turbidity: 2.3, station: 'Beta' },
      { timestamp: '2024-01-01T12:00:00Z', pH: 7.3, temperature: 19.1, turbidity: 1.9, station: 'Gamma' },
    ];
    
    exportToCSV(sampleData, 'water-quality-sample-data.csv');
    toast({
      title: "Sample data exported",
      description: "Sample water quality data has been downloaded as CSV."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data & Settings
          </CardTitle>
          <CardDescription>Download your configuration and monitoring data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-river-blue-light" />
                <span className="font-medium">Settings Export</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Export all your application settings as a JSON file for backup or transfer.
              </p>
              <Button onClick={handleExportSettings} variant="outline" className="w-full">
                Export Settings
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-river-success" />
                <span className="font-medium">Data Export</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Export water quality monitoring data in CSV format for analysis.
              </p>
              <Button onClick={handleExportSampleData} variant="outline" className="w-full">
                Export Sample Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportSettings;
