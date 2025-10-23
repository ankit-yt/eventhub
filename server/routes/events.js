import express from "express"
import Event from "../models/Event.js"
import User from "../models/User.js"
import { verifyToken, verifyAdmin } from "../middleware/auth.js"

const router = express.Router()

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .populate("attendees", "name email")
      .sort({ date: 1 })
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message })
  }
})

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("attendees", "name email")

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    res.json(event)
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error: error.message })
  }
})

router.get("/:id/attendees", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("attendees", "name email role createdAt")

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    res.json({
      eventId: event._id,
      eventTitle: event.title,
      eventDate: event.date,
      totalAttendees: event.attendees.length,
      attendees: event.attendees,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendees", error: error.message })
  }
})

router.get("/analytics/registration-trend", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const events = await Event.find().populate("attendees.userId", "name email")

    // Step 1️⃣: Prepare map for last 7 days (today + past 6 days)
    const registrationsByDate = new Map()
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      days.push(dateKey)
      registrationsByDate.set(dateKey, 0)
    }

    // Step 2️⃣: Count registrations
    events.forEach((event) => {
      event.attendees.forEach((attendee) => {
        // Use attendee.registeredAt if exists, else event.createdAt
        const rawDate = attendee.registeredAt || event.createdAt
        const localDate = new Date(rawDate)

        // Convert to readable short format (matches keys)
        const dateKey = localDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

        if (registrationsByDate.has(dateKey)) {
          registrationsByDate.set(dateKey, registrationsByDate.get(dateKey) + 1)
        }
      })
    })

    // Step 3️⃣: Build array output
    const trend = days.map((date) => ({
      date,
      registrations: registrationsByDate.get(date) || 0,
    }))

    res.json(trend)
  } catch (error) {
    res.status(500).json({
      message: "Error fetching registration trend",
      error: error.message,
    })
  }
})


// Create event (Admin only)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, category, date, venue, bannerUrl, resources, personnel } = req.body

    const event = new Event({
      title,
      description,
      category,
      date,
      venue,
      bannerUrl,
      resources: resources || [],
      personnel: personnel || [],
      createdBy: req.user.id,
    })

    await event.save()
    res.status(201).json(event)
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error: error.message })
  }
})

// Update event (Admin only)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true })

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    res.json(event)
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message })
  }
})

// Delete event (Admin only)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    res.json({ message: "Event deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message })
  }
})

// Register for event (Student)
router.post("/:id/register", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // Check if already registered
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: "Already registered for this event" })
    }

    event.attendees.push(req.user.id)
    await event.save()

    // Update user's registered events
    await User.findByIdAndUpdate(req.user.id, { $push: { registeredEvents: event._id } })

    res.json({ message: "Registered successfully", event })
  } catch (error) {
    res.status(500).json({ message: "Error registering for event", error: error.message })
  }
})

// Unregister from event
router.post("/:id/unregister", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    event.attendees = event.attendees.filter((id) => id.toString() !== req.user.id)
    await event.save()

    // Update user's registered events
    await User.findByIdAndUpdate(req.user.id, { $pull: { registeredEvents: event._id } })

    res.json({ message: "Unregistered successfully", event })
  } catch (error) {
    res.status(500).json({ message: "Error unregistering from event", error: error.message })
  }
})

export default router
