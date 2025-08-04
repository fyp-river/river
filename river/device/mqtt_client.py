import json
import ssl
import paho.mqtt.client as mqtt
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# === HiveMQ Cloud credentials and connection settings ===
MQTT_BROKER = "92b7e65bda9c471984d325f2818f92b2.s1.eu.hivemq.cloud"  # e.g., "xxxxxx.s1.eu.hivemq.cloud"
MQTT_PORT = 8883  # TLS-secured port
MQTT_USERNAME = "donfrass"
MQTT_PASSWORD = "Monkey1991"
MQTT_TOPIC = "devices/river-watcher-23/telemetry"  # Topic to subscribe to

# === Callback: on successful connection ===
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("[MQTT] Connected successfully.")
        client.subscribe(MQTT_TOPIC)
    else:
        print(f"[MQTT] Connection failed. Code: {rc}")

# === Callback: on receiving message ===
def on_message(client, userdata, msg):
    try:
        # Import models inside function to avoid AppRegistryNotReady
        from .models import Device, Sensor, SensorReading
        
        payload = json.loads(msg.payload.decode())
        print(f"[MQTT] Received from {msg.topic}: {payload}")

        # Extract device name from topic
        topic_parts = msg.topic.split('/')
        device_name = topic_parts[1] if len(topic_parts) > 1 else 'unknown'
        
        # Create or get device
        device, _ = Device.objects.get_or_create(name=device_name)
        
        # Create or get sensors for each sensor type
        sensors = {}
        sensor_types = {
            'ph': 'PH',
            'temperature': 'TEMP', 
            'turbidity': 'TURB',
            'dissolved_oxygen': 'DO',
            'ise_value': 'ISE',
            'conductivity': 'TDS',
            'orp': 'ORP',
            'ec': 'EC'
        }
        
        for payload_key, sensor_type in sensor_types.items():
            if payload.get(payload_key) is not None:
                sensor, _ = Sensor.objects.get_or_create(
                    name=f"{device_name} - {sensor_type}",
                    sensor_type=sensor_type,
                    device=device
                )
                sensors[sensor_type] = sensor
        
        # Save sensor readings to database
        try:
            for sensor_type, sensor in sensors.items():
                # Map sensor types to payload keys
                payload_mapping = {
                    'PH': 'ph',
                    'TEMP': 'temperature',
                    'TURB': 'turbidity', 
                    'DO': 'dissolved_oxygen',
                    'ISE': 'ise_value',
                    'TDS': 'conductivity',
                    'ORP': 'orp',
                    'EC': 'conductivity'  # EC uses conductivity value
                }
                
                payload_key = payload_mapping.get(sensor_type)
                if payload_key and payload.get(payload_key) is not None:
                    SensorReading.objects.create(
                        sensor=sensor,
                        device=device,
                        pH=payload.get("ph") if sensor_type == 'PH' else None,
                        temperature=payload.get("temperature") if sensor_type == 'TEMP' else None,
                        turbidity=payload.get("turbidity") if sensor_type == 'TURB' else None,
                        dissolved_oxygen=payload.get("dissolved_oxygen") if sensor_type == 'DO' else None,
                        ise=payload.get("ise_value") if sensor_type == 'ISE' else None,
                        tds=payload.get("conductivity") if sensor_type == 'TDS' else None,
                        orp=payload.get("orp") if sensor_type == 'ORP' else None,
                        ec=payload.get("conductivity") if sensor_type == 'EC' else None,
                        value=payload.get("mercury_ppb") if sensor_type == 'ISE' else None
                    )
            
            print(f"[MQTT] ✅ Saved sensor readings to database for device {device_name}")
        except Exception as e:
            print(f"[MQTT] ❌ Error saving sensor reading: {e}")

        # Update device online status
        device.is_online = True
        device.save()

        # Send to WebSocket group
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'sensors',
            {
                'type': 'send.sensor.data',
                'data': {
                    'device_id': device_name,
                    'timestamp': payload.get('timestamp'),
                    'data': {
                        'ph': payload.get("ph", 0.0),
                        'temperature': payload.get("temperature", 0.0),
                        'turbidity': payload.get("turbidity", 0.0),
                        'dissolved_oxygen': payload.get("dissolved_oxygen", 0.0),
                        'ise': payload.get("ise_value", 0.0),
                        'tds': payload.get("conductivity", 0.0),
                        'orp': payload.get("orp", 0.0),
                        'ec': payload.get("conductivity", 0.0),
                        'value': payload.get("mercury_ppb", 0.0)
                    }
                }
            }
        )
    except json.JSONDecodeError:
        print("[MQTT] Failed to decode JSON payload.")
    except Exception as e:
        print(f"[MQTT] Error processing message: {e}")

# === Initialize and configure MQTT client ===
def start_mqtt():
    client = mqtt.Client(protocol=mqtt.MQTTv311)
    client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    client.tls_set(tls_version=ssl.PROTOCOL_TLS)

    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    client.loop_start()
