import express from "express"
import http from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/user"
import messageRoutes from "./routes/message"
import { socketHandler } from "./socket"

dotenv.config()

const app = express()

// Only create server and socket.io instance if not running on Vercel
let server: http.Server | undefined
let io: Server | undefined

if (process.env.VERCEL !== "1") {
  server = http.createServer(app)
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  })

  // Socket.IO
  socketHandler(io)
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  }),
)
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/chat_app")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/messages", messageRoutes)

// Only listen on port if not running on Vercel
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000
  server?.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app

