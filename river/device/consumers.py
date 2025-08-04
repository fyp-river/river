import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from device.utils import save_sensor_data
from django.utils import timezone
from datetime import timedelta


# --- WebSocket Consumer: Device to Backend ---
class DeviceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.device_name = self.scope['url_route']['kwargs']['device_name']
        self.group_name = f'device_{self.device_name.lower()}'

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Notify successful connection
        await self.send(text_data=json.dumps({
            'type': 'heartbeat',
            'data': f'Device {self.device_name} is connected'
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)

        # Save incoming sensor data to the database
        await sync_to_async(save_sensor_data)(self.device_name, data)

        # Broadcast to frontend dashboard
        await self.channel_layer.group_send(
            "sensors",
            {
                "type": "send.sensor.data",
                "data": {
                    "device": self.device_name,
                    "payload": data
                }
            }
        )

        # Optional ack
        await self.send(text_data=json.dumps({"status": "received"}))

    async def send_device_data(self, event):
        await self.send(text_data=json.dumps(event["data"]))


# --- WebSocket Consumer: Dashboard Frontend ---
class SensorDataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("sensors", self.channel_name)
        await self.accept()

        # Send connection confirmation
        await self.send(text_data=json.dumps({
            "type": "heartbeat",
            "data": "Sensor dashboard connected"
        }))

        # Send existing sensor data from database
        await self.send_existing_data()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("sensors", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Dashboard received:", data)  # Optional for debugging

    async def send_sensor_data(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    @sync_to_async
    def get_recent_sensor_data(self):
        """Get recent sensor readings from the database"""
        # Import models here to avoid AppRegistryNotReady error
        from device.models import SensorReading, Device
        
        print("🔍 Querying database for sensor readings...")
        
        # Get all readings first to see what we have
        all_readings = SensorReading.objects.all()
        print(f"📊 Total readings in database: {all_readings.count()}")
        
        if all_readings.count() > 0:
            # Show some sample readings
            sample_readings = all_readings[:3]
            for reading in sample_readings:
                print(f"📋 Sample reading: {reading} - timestamp: {reading.timestamp}")
        
        # Get readings from the last 24 hours (but be more lenient)
        from django.utils import timezone
        recent_time = timezone.now() - timedelta(hours=24)
        print(f"⏰ Looking for readings after: {recent_time}")
        
        readings = SensorReading.objects.filter(
            timestamp__gte=recent_time
        ).select_related('device', 'sensor').order_by('-timestamp')[:50]  # Last 50 readings
        
        print(f"📊 Found {readings.count()} readings in last 24 hours")
        
        # If no recent readings, get all readings (up to 50)
        if readings.count() == 0:
            print("⚠️ No recent readings found, getting all readings...")
            readings = SensorReading.objects.all().select_related('device', 'sensor').order_by('-timestamp')[:50]
            print(f"📊 Found {readings.count()} total readings")
        
        return list(readings)

    async def send_existing_data(self):
        """Send existing sensor data to the newly connected client"""
        try:
            readings = await self.get_recent_sensor_data()
            
            for reading in readings:
                # Helper function to format numbers to max 4 decimal places
                def format_value(val):
                    if val is None:
                        return None
                    return round(val, min(4, len(str(val).split('.')[-1]) if '.' in str(val) else 0))
                
                # Format data to match frontend expectations
                sensor_data = {
                    "type": "sensor_data",
                    "device_id": reading.device.name if reading.device else "unknown",
                    "timestamp": reading.timestamp.isoformat(),
                    "data": {
                        "ph": format_value(reading.pH),
                        "temperature": format_value(reading.temperature),
                        "turbidity": format_value(reading.turbidity),
                        "dissolved_oxygen": format_value(reading.dissolved_oxygen),
                        "ise": format_value(reading.ise),
                        "tds": format_value(reading.tds),
                        "orp": format_value(reading.orp),
                        "ec": format_value(reading.ec),
                        "value": format_value(reading.value)
                    }
                }
                
                await self.send(text_data=json.dumps(sensor_data))
                
        except Exception as e:
            print(f"❌ Error sending existing data: {e}")
            import traceback
            traceback.print_exc()
            # Send error message to client
            await self.send(text_data=json.dumps({
                "type": "error",
                "data": f"Failed to load existing data: {str(e)}"
            }))
