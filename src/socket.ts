import type { Server, Socket } from "socket.io"
import jwt from "jsonwebtoken"

export const socketHandler = (io: Server) => {
  if (!io) return // Early return if no io instance (e.g. on Vercel)

  const userSockets = new Map<string, string>()

  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error("Authentication error"))
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret") as { userId: string }
      socket.data.userId = decoded.userId
      next()
    } catch (error) {
      next(new Error("Authentication error"))
    }
  })

  io.on("connection", (socket: Socket) => {
    console.log("New client connected")
    const userId = socket.data.userId
    userSockets.set(userId, socket.id)

    socket.on("send_message", (data) => {
      const recipientSocket = userSockets.get(data.receiverId)
      if (recipientSocket) {
        io.to(recipientSocket).emit("receive_message", {
          ...data,
          senderId: userId,
        })
      }
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected")
      userSockets.delete(userId)
    })
  })
}

