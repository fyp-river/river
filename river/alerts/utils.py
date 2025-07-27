from .models import Alert

def check_for_alerts(sensor_reading):
    thresholds = {
        "temperature": (0, 40),
        "pH": (6.5, 8.5),
        "turbidity": (0, 500),
        "dissolved_oxygen": (5, 14),
    }

    for param, (min_val, max_val) in thresholds.items():
        value = getattr(sensor_reading, param, None)
        if value is not None and (value < min_val or value > max_val):
            Alert.objects.create(
                device=sensor_reading.device,
                reading=sensor_reading,
                parameter=param,
                message=f"{param.capitalize()} out of range: {value}",
            )
