
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { PlusCircle, Trash2, Edit, Save, X, Cpu, Activity, BatteryMedium, Signal } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type Device = {
  id: string;
  name: string;
  type: 'standard' | 'pro' | 'mini';
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  batteryLevel: number;
  signalStrength: number;
  active: boolean;
  lastSeen: string;
};

const DevicesSettings = () => {
  // Mock devices data - in a real app this would come from an API or local storage
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'device-1',
      name: 'Sensor 1',
      type: 'standard',
      location: 'North River',
      status: 'online',
      batteryLevel: 85,
      signalStrength: 92,
      active: true,
      lastSeen: '2025-04-03T14:30:00'
    },
    {
      id: 'device-2',
      name: 'Sensor 2',
      type: 'pro',
      location: 'South Bridge',
      status: 'online',
      batteryLevel: 92,
      signalStrength: 78,
      active: true,
      lastSeen: '2025-04-03T14:25:00'
    },
    {
      id: 'device-3',
      name: 'Sensor 3',
      type: 'mini',
      location: 'East Tributary',
      status: 'offline',
      batteryLevel: 15,
      signalStrength: 30,
      active: false,
      lastSeen: '2025-04-02T09:15:00'
    },
    {
      id: 'device-4',
      name: 'Sensor 4',
      type: 'standard',
      location: 'West Bank',
      status: 'maintenance',
      batteryLevel: 45,
      signalStrength: 60,
      active: false,
      lastSeen: '2025-04-01T16:45:00'
    },
    {
      id: 'device-5',
      name: 'Sensor 5',
      type: 'pro',
      location: 'City Center',
      status: 'online',
      batteryLevel: 78,
      signalStrength: 85,
      active: true,
      lastSeen: '2025-04-03T14:10:00'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDeviceId, setEditDeviceId] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      type: 'standard',
      location: '',
      active: true
    }
  });

  const editForm = useForm({
    defaultValues: {
      name: '',
      type: 'standard',
      location: '',
      active: true
    }
  });

  const handleAddDevice = (data: any) => {
    const newDevice: Device = {
      id: `device-${devices.length + 1}`,
      name: data.name,
      type: data.type as 'standard' | 'pro' | 'mini',
      location: data.location,
      status: 'online',
      batteryLevel: 100,
      signalStrength: 90,
      active: data.active,
      lastSeen: new Date().toISOString()
    };

    setDevices([...devices, newDevice]);
    setIsAddDialogOpen(false);
    form.reset();
    
    toast({
      title: "Device added",
      description: `${newDevice.name} has been added to your network.`
    });
  };

  const beginEditDevice = (device: Device) => {
    setEditDeviceId(device.id);
    setIsEditMode(true);
    editForm.reset({
      name: device.name,
      type: device.type,
      location: device.location,
      active: device.active
    });
  };

  const saveEditDevice = (data: any) => {
    if (!editDeviceId) return;

    const updatedDevices = devices.map(device => {
      if (device.id === editDeviceId) {
        return {
          ...device,
          name: data.name,
          type: data.type as 'standard' | 'pro' | 'mini',
          location: data.location,
          active: data.active
        };
      }
      return device;
    });

    setDevices(updatedDevices);
    setIsEditMode(false);
    setEditDeviceId(null);

    toast({
      title: "Device updated",
      description: `The device settings have been updated.`
    });
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditDeviceId(null);
  };

  const toggleDeviceStatus = (id: string) => {
    const updatedDevices = devices.map(device => {
      if (device.id === id) {
        return {
          ...device,
          active: !device.active
        };
      }
      return device;
    });

    setDevices(updatedDevices);
    
    const device = updatedDevices.find(d => d.id === id);
    toast({
      title: device?.active ? "Device activated" : "Device deactivated",
      description: `${device?.name} is now ${device?.active ? 'active' : 'inactive'}.`
    });
  };

  const deleteDevice = (id: string) => {
    const deviceToDelete = devices.find(device => device.id === id);
    const updatedDevices = devices.filter(device => device.id !== id);
    setDevices(updatedDevices);
    
    toast({
      title: "Device removed",
      description: `${deviceToDelete?.name} has been removed from your network.`,
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-red-500';
      case 'maintenance':
        return 'text-amber-500';
      default:
        return 'text-gray-500';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-500';
    if (level > 20) return 'text-amber-500';
    return 'text-red-500';
  };

  const getSignalColor = (strength: number) => {
    if (strength > 70) return 'text-green-500';
    if (strength > 30) return 'text-amber-500';
    return 'text-red-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Device Management
            </span>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Device</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Device</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new monitoring device.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddDevice)} className="space-y-4 py-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter device name" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select device type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard Sensor</SelectItem>
                              <SelectItem value="pro">Pro Sensor</SelectItem>
                              <SelectItem value="mini">Mini Sensor</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter device location" {...field} required />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Active Status</FormLabel>
                            <FormDescription>
                              Enable this device for monitoring
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
                    
                    <DialogFooter>
                      <Button type="submit">Add Device</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Configure and manage your network of river monitoring devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Signal</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      {isEditMode && editDeviceId === device.id ? (
                        <Input 
                          {...editForm.register('name')} 
                          defaultValue={device.name} 
                          className="w-32"
                        />
                      ) : (
                        device.name
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditMode && editDeviceId === device.id ? (
                        <Select 
                          {...editForm.register('type')}
                          defaultValue={device.type}
                          onValueChange={(value) => editForm.setValue('type', value as 'standard' | 'pro' | 'mini')}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                            <SelectItem value="mini">Mini</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="capitalize">{device.type}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditMode && editDeviceId === device.id ? (
                        <Input 
                          {...editForm.register('location')} 
                          defaultValue={device.location} 
                          className="w-32"
                        />
                      ) : (
                        device.location
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Activity className={`h-4 w-4 ${getStatusColor(device.status)}`} />
                        <span className="capitalize">{device.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BatteryMedium className={`h-4 w-4 ${getBatteryColor(device.batteryLevel)}`} />
                        <span>{device.batteryLevel}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Signal className={`h-4 w-4 ${getSignalColor(device.signalStrength)}`} />
                        <span>{device.signalStrength}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(device.lastSeen)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isEditMode && editDeviceId === device.id ? (
                          <>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => editForm.handleSubmit(saveEditDevice)()}
                            >
                              <Save className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => beginEditDevice(device)}
                            >
                              <Edit className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => toggleDeviceStatus(device.id)}
                            >
                              <Switch 
                                checked={device.active} 
                                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200" 
                              />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => deleteDevice(device.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-5">
          <div className="text-sm text-muted-foreground">
            Total Devices: {devices.length} | Active: {devices.filter(d => d.active).length}
          </div>
          <Button variant="outline">Sync All Devices</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DevicesSettings;
