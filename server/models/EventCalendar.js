import mongoose from "mongoose"

const eventCalendarSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: true,
  },
  allocatedEquipment: [
    {
      equipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
      },
      quantity: Number,
    },
  ],
  assignedPersonnel: [
    {
      personnelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Personnel",
      },
      role: String,
    },
  ],
  status: {
    type: String,
    enum: ["Planned", "Confirmed", "In Progress", "Completed", "Cancelled"],
    default: "Planned",
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("EventCalendar", eventCalendarSchema)
