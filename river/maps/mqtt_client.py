import json
import ssl
import paho.mqtt.client as mqtt
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

MQTT_BROKER = "92b7e65bda9c471984d325f2818f92b2.s1.eu.hivemq.cloud"
MQTT_PORT = 8883
MQTT_USERNAME = "donfrass"
MQTT_PASSWORD = "Monkey1991"
MQTT_TOPIC = "devices/river-watcher-23/telemetry"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("[MQTT] Connected to HiveMQ Cloud.")
        client.subscribe(MQTT_TOPIC)
    else:
        print(f"[MQTT] Connection failed with code {rc}")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print(f"[MQTT] Received on {msg.topic}: {payload}")

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'sensor_updates',  # WebSocket group
            {
                'type': 'send_position',
                'message': payload
            }
        )
    except json.JSONDecodeError:
        print("[MQTT] Error decoding payload.")

def start_mqtt():
    client = mqtt.Client(protocol=mqtt.MQTTv311)
    client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    client.tls_set(tls_version=ssl.PROTOCOL_TLS)
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    client.loop_start()
