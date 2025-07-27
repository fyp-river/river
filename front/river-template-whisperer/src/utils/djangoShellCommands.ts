
/**
 * Django Shell Commands for WebSocket Testing
 * 
 * Copy and paste these commands into your Django shell to test WebSocket functionality:
 * 
 * python manage.py shell
 */

export const DJANGO_SHELL_COMMANDS = `
# Import required modules
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import json
from datetime import datetime

# Get the channel layer
channel_layer = get_channel_layer()

# Test 1: Send a simple test message
def send_test_message():
    message = {
        "type": "websocket_message",
        "data": {
            "type": "test",
            "data": {
                "message": "Hello from Django backend!",
                "backend_timestamp": datetime.now().isoformat(),
                "source": "django_shell"
            },
            "timestamp": datetime.now().isoformat()
        }
    }
    
    print("🚀 Sending test message to WebSocket group...")
    print(f"📋 Message: {json.dumps(message, indent=2)}")
    
    async_to_sync(channel_layer.group_send)(
        "sensor_data",  # Make sure this matches your group name
        message
    )
    print("✅ Message sent successfully!")

# Test 2: Send sensor data simulation
def send_sensor_data():
    sensor_message = {
        "type": "websocket_message", 
        "data": {
            "type": "sensor_data",
            "device_id": "test_device_001",
            "data": {
                "ph": 7.2,
                "temperature": 25.6,
                "turbidity": 12.3,
                "dissolved_oxygen": 8.1,
                "timestamp": datetime.now().isoformat()
            },
            "timestamp": datetime.now().isoformat()
        }
    }
    
    print("📡 Sending sensor data to WebSocket group...")
    print(f"📊 Sensor Data: {json.dumps(sensor_message, indent=2)}")
    
    async_to_sync(channel_layer.group_send)(
        "sensor_data",
        sensor_message
    )
    print("✅ Sensor data sent successfully!")

# Test 3: Send ping message
def send_ping():
    ping_message = {
        "type": "websocket_message",
        "data": {
            "type": "ping",
            "data": {"ping": True},
            "timestamp": datetime.now().isoformat(),
            "message_id": f"ping_{int(datetime.now().timestamp())}"
        }
    }
    
    print("🏓 Sending ping to WebSocket group...")
    async_to_sync(channel_layer.group_send)(
        "sensor_data",
        ping_message
    )
    print("✅ Ping sent successfully!")

# Test 4: Check channel layer info
def check_channel_layer():
    print("🔍 Channel Layer Information:")
    print(f"Backend: {channel_layer}")
    print(f"Channel Layer Class: {type(channel_layer)}")
    
    # Try to get channel layer capacity info if available
    try:
        capacity = getattr(channel_layer, 'capacity', 'Unknown')
        expiry = getattr(channel_layer, 'expiry', 'Unknown')
        print(f"Capacity: {capacity}")
        print(f"Expiry: {expiry}")
    except Exception as e:
        print(f"Could not get capacity info: {e}")

# Test 5: Continuous sensor data simulation
def simulate_continuous_data(count=5, interval=2):
    import time
    import random
    
    for i in range(count):
        sensor_data = {
            "type": "websocket_message",
            "data": {
                "type": "sensor_data", 
                "device_id": f"sensor_{random.randint(1, 5):03d}",
                "data": {
                    "ph": round(random.uniform(6.5, 8.5), 2),
                    "temperature": round(random.uniform(18.0, 32.0), 1),
                    "turbidity": round(random.uniform(0.5, 25.0), 1),
                    "dissolved_oxygen": round(random.uniform(4.0, 12.0), 1),
                    "timestamp": datetime.now().isoformat()
                },
                "timestamp": datetime.now().isoformat()
            }
        }
        
        print(f"📡 Sending batch {i+1}/{count}...")
        async_to_sync(channel_layer.group_send)("sensor_data", sensor_data)
        
        if i < count - 1:  # Don't sleep after the last message
            time.sleep(interval)
    
    print(f"✅ Sent {count} sensor data messages!")

# Run tests
print("🧪 WebSocket Testing Commands Loaded!")
print("Available commands:")
print("- send_test_message()      # Send a simple test message")
print("- send_sensor_data()       # Send mock sensor data")  
print("- send_ping()              # Send a ping message")
print("- check_channel_layer()    # Check channel layer info")
print("- simulate_continuous_data(count=5, interval=2)  # Send multiple messages")
print("")
print("Example usage:")
print(">>> send_test_message()")
print(">>> send_sensor_data()")
print(">>> simulate_continuous_data(10, 1)  # Send 10 messages, 1 second apart")
`;

// Export as a function to copy to clipboard
export const copyDjangoCommands = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(DJANGO_SHELL_COMMANDS);
    console.log('📋 Django shell commands copied to clipboard!');
    return true;
  } else {
    console.log('📋 Django shell commands:');
    console.log(DJANGO_SHELL_COMMANDS);
    return false;
  }
};
