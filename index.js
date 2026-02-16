const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const connectDB = require("./config/db.js");
const setupSocket = require("./socket.js");
const routes = require("./routes");
const socketAuth = require("./middlewares/socketAuth");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

connectDB();

io.use(socketAuth);

setupSocket(io);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Madad API Documentation"
}));

app.use("/api", routes);
app.use('/uploads', express.static('uploads'));
app.use('/patientFiles', express.static('patientFiles'));
app.use('/doctorFiles', express.static('doctorFiles'));
app.use('/image', express.static('image'));

app.use('/dashboard', express.static('../Madad-Dashboard'));

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});