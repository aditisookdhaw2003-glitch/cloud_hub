// mqttClient.js
const mqtt = require("mqtt");

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
});

client.on("error", (err) => {
  console.error("❌ MQTT connection error:", err);
});

function publishCommand(command) {
  const topic = "matter/light/command";
  client.publish(topic, command, { qos: 1 }, (err) => {
    if (err) console.error("MQTT publish error:", err);
    else console.log(`📤 Published command: ${command}`);
  });
}

module.exports = { publishCommand };