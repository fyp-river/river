
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, BatteryMedium, Cpu, MapPin, Signal, X } from 'lucide-react';
import { formatDistance } from 'date-fns';

export type DeviceDetails = {
  id: string;
  name: string;
  type: 'standard' | 'pro' | 'mini';
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  batteryLevel: number;
  signalStrength: number;
  active: boolean;
  lastSeen: string;
  ipAddress?: string;
  firmwareVersion?: string;
  serialNumber?: string;
  installDate?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

interface DeviceDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  device: DeviceDetails | null;
}

export const DeviceDetailsDrawer: React.FC<DeviceDetailsDrawerProps> = ({
  open,
  onClose,
  device,
}) => {
  if (!device) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500 text-white';
      case 'offline':
        return 'bg-red-500 text-white';
      case 'maintenance':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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

  const getDeviceTypeLabel = (type: string) => {
    switch (type) {
      case 'pro':
        return 'Professional Sensing Unit';
      case 'mini':
        return 'Mini Monitoring Node';
      default:
        return 'Standard Sensor';
    }
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              <DrawerTitle>{device.name}</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button size="icon" variant="ghost" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {device.type}
            </Badge>
            <Badge className={getStatusColor(device.status)}>
              <Activity className="mr-1 h-3 w-3" />
              {device.status}
            </Badge>
            {device.active ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">
                Inactive
              </Badge>
            )}
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Device Information</h4>
              
              <div>
                <div className="text-sm text-muted-foreground">Device Type</div>
                <div className="font-medium">{getDeviceTypeLabel(device.type)}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  {device.location}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Last Seen</div>
                <div className="font-medium">
                  {formatDistance(new Date(device.lastSeen), new Date(), { addSuffix: true })}
                </div>
              </div>

              {device.serialNumber && (
                <div>
                  <div className="text-sm text-muted-foreground">Serial Number</div>
                  <div className="font-medium">{device.serialNumber}</div>
                </div>
              )}
              
              {device.installDate && (
                <div>
                  <div className="text-sm text-muted-foreground">Installation Date</div>
                  <div className="font-medium">
                    {new Date(device.installDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold border-b pb-2">Status & Connectivity</h4>
              
              <div>
                <div className="text-sm text-muted-foreground">Battery Level</div>
                <div className="font-medium flex items-center">
                  <BatteryMedium className={`h-4 w-4 mr-1 ${getBatteryColor(device.batteryLevel)}`} />
                  {device.batteryLevel}%
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Signal Strength</div>
                <div className="font-medium flex items-center">
                  <Signal className={`h-4 w-4 mr-1 ${getSignalColor(device.signalStrength)}`} />
                  {device.signalStrength}%
                </div>
              </div>
              
              {device.ipAddress && (
                <div>
                  <div className="text-sm text-muted-foreground">IP Address</div>
                  <div className="font-medium">{device.ipAddress}</div>
                </div>
              )}
              
              {device.firmwareVersion && (
                <div>
                  <div className="text-sm text-muted-foreground">Firmware Version</div>
                  <div className="font-medium">{device.firmwareVersion}</div>
                </div>
              )}
            </div>
          </div>

          {device.coordinates && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold border-b pb-2 mb-4">GPS Coordinates</h4>
              <div className="bg-muted p-4 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono">
                    Lat: {device.coordinates.latitude.toFixed(6)}, Long: {device.coordinates.longitude.toFixed(6)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Map view available in device management
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="border-t pt-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="default">
              View Data Stream
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeviceDetailsDrawer;
