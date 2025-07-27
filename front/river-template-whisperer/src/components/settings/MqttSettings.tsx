
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const mqttConfigSchema = z.object({
  brokerUrl: z.string().min(1, { message: "Broker URL is required" }),
  port: z.string().regex(/^\d+$/, { message: "Port must be a number" }),
  username: z.string().optional(),
  password: z.string().optional(),
  clientId: z.string().min(1, { message: "Client ID is required" }),
  topicPrefix: z.string().min(1, { message: "Topic prefix is required" }),
  useSSL: z.boolean().default(true),
  autoReconnect: z.boolean().default(true),
});

type MqttConfigValues = z.infer<typeof mqttConfigSchema>;

const defaultValues: MqttConfigValues = {
  brokerUrl: "mqtt.example.com",
  port: "8883",
  username: "",
  password: "",
  clientId: "riverwatcher-" + Math.random().toString(16).substring(2, 8),
  topicPrefix: "river/sensors/",
  useSSL: true,
  autoReconnect: true,
};

const MqttSettings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<MqttConfigValues>({
    resolver: zodResolver(mqttConfigSchema),
    defaultValues,
  });

  const onSubmit = async (values: MqttConfigValues) => {
    setIsSaving(true);
    
    try {
      // In a real app, you would store and use these settings
      console.log("MQTT Settings:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("MQTT settings saved successfully");
    } catch (error) {
      toast.error("Failed to save MQTT settings");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>MQTT Configuration</CardTitle>
        <CardDescription>
          Configure the MQTT connection for the device swarm
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="brokerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Broker URL</FormLabel>
                    <FormControl>
                      <Input placeholder="mqtt.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input placeholder="8883" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (optional)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for this connection
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="topicPrefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic Prefix</FormLabel>
                    <FormControl>
                      <Input placeholder="river/sensors/" {...field} />
                    </FormControl>
                    <FormDescription>
                      Prefix for all MQTT topics
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="useSSL"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Use SSL/TLS</FormLabel>
                      <FormDescription>
                        Secure connection to broker
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
                name="autoReconnect"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Auto Reconnect</FormLabel>
                      <FormDescription>
                        Automatically reconnect if disconnected
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
            </div>
            
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save MQTT Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MqttSettings;
