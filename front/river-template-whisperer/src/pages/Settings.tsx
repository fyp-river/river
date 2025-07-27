
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Globe, Shield, Droplets, Zap, Wifi, Cpu, Download } from 'lucide-react';
import AccountSettings from '@/components/settings/AccountSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import DataSettings from '@/components/settings/DataSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import MqttSettings from '@/components/settings/MqttSettings';
import DevicesSettings from '@/components/settings/DevicesSettings';
import ExportSettings from '@/components/settings/ExportSettings';
import AlertBanner from '@/components/alerts/AlertBanner';
import { alertsData } from '@/types/alerts';
import { useNavigate, useLocation } from 'react-router-dom';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  
  // Parse tab from URL if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['account', 'notifications', 'display', 'data', 'privacy', 'devices', 'mqtt', 'export'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/settings?tab=${value}`, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-river">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-6 text-2xl font-bold text-river-foreground">Settings</h1>
          
          {/* Show alert banner if there are critical alerts */}
          <AlertBanner alerts={alertsData} />
          
          <Card className="river-card">
            <CardHeader className="pb-4">
              <CardTitle>Configuration Settings</CardTitle>
              <CardDescription>
                Manage your RiverWatcher preferences and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="account" 
                value={activeTab} 
                onValueChange={handleTabChange} 
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 md:grid-cols-8 mb-8 overflow-x-auto">
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="display" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">Display</span>
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    <span className="hidden sm:inline">Data</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                  <TabsTrigger value="devices" className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span className="hidden sm:inline">Devices</span>
                  </TabsTrigger>
                  <TabsTrigger value="mqtt" className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span className="hidden sm:inline">MQTT</span>
                  </TabsTrigger>
                  <TabsTrigger value="export" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="account">
                  <AccountSettings />
                </TabsContent>
                
                <TabsContent value="notifications">
                  <NotificationSettings />
                </TabsContent>
                
                <TabsContent value="display">
                  <DisplaySettings />
                </TabsContent>
                
                <TabsContent value="data">
                  <DataSettings />
                </TabsContent>
                
                <TabsContent value="privacy">
                  <PrivacySettings />
                </TabsContent>
                
                <TabsContent value="devices">
                  <DevicesSettings />
                </TabsContent>
                
                <TabsContent value="mqtt">
                  <MqttSettings />
                </TabsContent>
                
                <TabsContent value="export">
                  <ExportSettings />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
