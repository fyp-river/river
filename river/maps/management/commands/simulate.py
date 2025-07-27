# device/management/commands/simulate.py

import asyncio
import time
from django.core.management.base import BaseCommand
from channels.layers import get_channel_layer

class Command(BaseCommand):
    help = "Simulate sending periodic WebSocket data to the frontend"

    def handle(self, *args, **kwargs):
        print("[SIMULATE] Sending dummy WebSocket data...")
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.send_loop())

    async def send_loop(self):
        channel_layer = get_channel_layer()
        counter = 1

        while True:
            data = {
                "type": "send_position",
                "message": {
                    "id": counter,
                    "lat": 5.60 + (counter * 0.001),
                    "lng": -0.20 - (counter * 0.001),
                    "name": f"Sensor #{counter}",
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
                }
            }

            await channel_layer.group_send("map_updates", data)
            print(f"[SENT] {data['message']}")
            counter += 1
            await asyncio.sleep(5)  # every 5 seconds
