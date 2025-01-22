const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const http = require("http");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use("/api/users", authRoutes);
app.use("/api/questions", questionRoutes);

// Timer Management
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("startTimer", () => {
    let timeLeft = 60; // 60 seconds per question

    const interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1;
        socket.emit("timerUpdate", timeLeft);
      } else {
        clearInterval(interval);
        socket.emit("timeUp");
      }
    }, 1000);

    socket.on("disconnect", () => {
      clearInterval(interval);
      console.log("Client disconnected");
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

