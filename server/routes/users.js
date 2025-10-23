import express from "express"
import User from "../models/User.js"
import { verifyToken, verifyAdmin } from "../middleware/auth.js"

const router = express.Router()

// Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("registeredEvents")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message })
  }
})

router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("registeredEvents", "title date")
      .sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message })
  }
})

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, avatar } = req.body

    const user = await User.findByIdAndUpdate(req.user.id, { name, avatar }, { new: true })

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message })
  }
})

export default router
