import express from "express"
import Message from "../models/Message"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

router.get("/:contactId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: req.params.contactId },
        { sender: req.params.contactId, receiver: req.userId },
      ],
    }).sort("createdAt")
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" })
  }
})

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiverId, content } = req.body
    const message = new Message({
      sender: req.userId,
      receiver: receiverId,
      content,
    })
    await message.save()
    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ message: "Error sending message" })
  }
})

export default router

