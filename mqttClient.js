// mqttClient.js
const mqtt = require("mqtt");
const fs = require("fs");

const options = {
  host: "363e40fb3d254c41b0846ec024374fe6.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "finaldesign",
  password: "Aditi.s15103",
};

const client = mqtt.connect(options);

client.on("connect", () => {
  console.log("✅ Connected to HiveMQ Broker");

  // Subscribe to command and sensor topics
  client.subscribe("matter/light/command", { qos: 1 });
  client.subscribe("matter/sensors/bme280", { qos: 1 });

  console.log("📡 Subscribed to: matter/light/command and matter/sensors/bme280");
});

client.on("error", (err) => {
  console.error("❌ MQTT connection error:", err);
});

// Handle incoming MQTT messages
client.on("message", (topic, message) => {
  try {
    if (topic === "matter/light/command") {
      const command = message.toString();
      console.log(`📩 Received light command: ${command}`);
      // You can keep your existing publish logic in /sendCommand route
      // or add any immediate local processing here if needed
    }

    if (topic === "matter/sensors/bme280") {
      const sensorData = JSON.parse(message.toString());
      console.log("📥 Received sensor data:", sensorData);

      // Load db.json
      const db = JSON.parse(fs.readFileSync("db.json", "utf8"));

      // Ensure sensors table exists
      if (!db.sensors || !Array.isArray(db.sensors)) {
        db.sensors = [
          { sensor_id: 1, endpoint_id: 1, type: "temperature", last_value: null, units: "°C" },
          { sensor_id: 2, endpoint_id: 1, type: "humidity", last_value: null, units: "%" },
          { sensor_id: 3, endpoint_id: 1, type: "pressure", last_value: null, units: "hPa" },
        ];
      }

      // Update the sensors table with latest values
      db.sensors[0].last_value = sensorData.temperature;
      db.sensors[1].last_value = sensorData.humidity;
      db.sensors[2].last_value = sensorData.pressure;

      // Save db.json
      fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
      console.log("✅ Updated db.json with latest sensor values");
    }
  } catch (err) {
    console.error("⚠️ Error processing MQTT message:", err);
  }
});

// Publish helper for light commands
function publishCommand(command) {
  const topic = "matter/light/command";
  client.publish(topic, command, { qos: 1 }, (err) => {
    if (err) console.error("MQTT publish error:", err);
    else console.log(`📤 Published command: ${command}`);
  });
}

module.exports = { publishCommand };