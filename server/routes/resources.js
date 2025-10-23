import express from "express"
import Venue from "../models/Venue.js"
import Equipment from "../models/Equipment.js"
import Personnel from "../models/Personnel.js"
import EventCalendar from "../models/EventCalendar.js"
import { verifyToken, verifyAdmin } from "../middleware/auth.js"

const router = express.Router()

// ===== VENUE ROUTES =====
router.get("/venues", async (req, res) => {
  try {
    const venues = await Venue.find()
    res.json(venues)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/venues", verifyToken, verifyAdmin, async (req, res) => {
  const venue = new Venue(req.body)
  try {
    const savedVenue = await venue.save()
    res.status(201).json(savedVenue)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get("/venues/:id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id)
    if (!venue) return res.status(404).json({ message: "Venue not found" })
    res.json(venue)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/venues/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(venue)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete("/venues/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Venue.findByIdAndDelete(req.params.id)
    res.json({ message: "Venue deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ===== EQUIPMENT ROUTES =====
router.get("/equipment", async (req, res) => {
  try {
    const equipment = await Equipment.find()
    res.json(equipment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/equipment", verifyToken, verifyAdmin, async (req, res) => {
  const equipment = new Equipment(req.body)
  try {
    const savedEquipment = await equipment.save()
    res.status(201).json(savedEquipment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get("/equipment/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
    if (!equipment) return res.status(404).json({ message: "Equipment not found" })
    res.json(equipment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/equipment/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(equipment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete("/equipment/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.id)
    res.json({ message: "Equipment deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ===== PERSONNEL ROUTES =====
router.get("/personnel", async (req, res) => {
  try {
    const personnel = await Personnel.find()
    res.json(personnel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/personnel", verifyToken, verifyAdmin, async (req, res) => {
  const person = new Personnel(req.body)
  try {
    const savedPerson = await person.save()
    res.status(201).json(savedPerson)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get("/personnel/:id", async (req, res) => {
  try {
    const person = await Personnel.findById(req.params.id)
    if (!person) return res.status(404).json({ message: "Personnel not found" })
    res.json(person)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/personnel/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const person = await Personnel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(person)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete("/personnel/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Personnel.findByIdAndDelete(req.params.id)
    res.json({ message: "Personnel deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ===== EVENT CALENDAR ROUTES =====
router.get("/calendar", async (req, res) => {
  try {
    const calendar = await EventCalendar.find()
      .populate("eventId")
      .populate("venueId")
      .populate("allocatedEquipment.equipmentId")
      .populate("assignedPersonnel.personnelId")
    res.json(calendar)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/calendar", verifyToken, verifyAdmin, async (req, res) => {
  const calendar = new EventCalendar(req.body)
  try {
    const savedCalendar = await calendar.save()
    const populated = await savedCalendar.populate([
      "eventId",
      "venueId",
      "allocatedEquipment.equipmentId",
      "assignedPersonnel.personnelId",
    ])
    res.status(201).json(populated)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get("/calendar/:id", async (req, res) => {
  try {
    const calendar = await EventCalendar.findById(req.params.id)
      .populate("eventId")
      .populate("venueId")
      .populate("allocatedEquipment.equipmentId")
      .populate("assignedPersonnel.personnelId")
    if (!calendar) return res.status(404).json({ message: "Calendar entry not found" })
    res.json(calendar)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/calendar/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const calendar = await EventCalendar.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("eventId")
      .populate("venueId")
      .populate("allocatedEquipment.equipmentId")
      .populate("assignedPersonnel.personnelId")
    res.json(calendar)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get("/calendar/event/:eventId", async (req, res) => {
  try {
    const calendar = await EventCalendar.findOne({ eventId: req.params.eventId })
    if (!calendar) return res.status(404).json({ message: "Calendar entry not found for this event" })
    res.json(calendar)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete("/calendar/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await EventCalendar.findByIdAndDelete(req.params.id)
    res.json({ message: "Calendar entry deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
