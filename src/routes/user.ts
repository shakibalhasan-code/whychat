import express from "express"
import User from "../models/User"
import { authMiddleware } from "../middleware/auth"

const router = express.Router()

router.get("/contacts", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("contacts", "name email avatar")
    res.json(user?.contacts || [])
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts" })
  }
})

router.post("/contacts", authMiddleware, async (req, res) => {
  try {
    const { email } = req.body
    const contact = await User.findOne({ email })
    if (!contact) {
      return res.status(404).json({ message: "User not found" })
    }
    const user = await User.findById(req.userId)
    if (user?.contacts.includes(contact._id)) {
      return res.status(400).json({ message: "Contact already added" })
    }
    user?.contacts.push(contact._id)
    await user?.save()
    res.json(contact)
  } catch (error) {
    res.status(500).json({ message: "Error adding contact" })
  }
})

export default router

