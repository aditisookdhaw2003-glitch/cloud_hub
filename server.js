require('dotenv').config(); // load .env first

const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config');
const authMiddleware = require('./middleware/auth_middleware');
const cors = require("cors");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const sensorsRoutes = require("./routes/sensors");
const logsRoutes = require("./routes/logs");
const alertsRoutes = require("./routes/alerts");

const app = express();


app.use(cors());
app.use(bodyParser.json());

// Routes
//app.use("/auth", authRoutes);
//app.use("/users", usersRoutes);

//app.use("/logs", logsRoutes);
//app.use("/alerts", alertsRoutes);


//app.use(authMiddleware);
app.use('/sensors', authMiddleware, sensorsRoutes);
app.use('/logs', authMiddleware, logsRoutes);

//const PORT = process.env.PORT || 4001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));