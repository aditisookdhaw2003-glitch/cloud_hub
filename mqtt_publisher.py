import json
import paho.mqtt.client as mqtt

# HiveMQ connection details
broker = "363e40fb3d254c41b0846ec024374fe6.s1.eu.hivemq.cloud"
port = 8883
username = "finaldesign"
password = "Aditi.s15103"

# Topic for Pi 0 2W hub
topic = "matter/light/command"

# Connect to HiveMQ
client = mqtt.Client()
client.tls_set()  # Use TLS for security
client.username_pw_set(username, password)
client.connect(broker, port)

with open("db.json", "r") as f:
    data = json.load(f)

# Handle both cases: either list or { "logs": [...] }
logs = data.get("logs", data)

if isinstance(logs, list) and len(logs) > 0:
    last_log = logs[-1]
else:
    raise ValueError("No logs found in db.json")

# Example: send ON/OFF based on last action
action = last_log.get("action", "").lower()

action = last_log.get("action", "").lower()

if "on" in action:
    client.publish(topic, "ON")
elif "off" in action:
    client.publish(topic, "OFF")

print(f"Published command based on log: {action}")
client.disconnect()