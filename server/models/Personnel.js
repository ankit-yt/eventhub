import mongoose from "mongoose"

const personnelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Coordinator", "Volunteer", "Staff", "Security", "Technical Support"],
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  skills: [String],
  availability: [
    {
      date: Date,
      startTime: String,
      endTime: String,
      isAvailable: Boolean,
    },
  ],
  assignments: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
      role: String,
      assignmentDate: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["Assigned", "Confirmed", "Completed", "Cancelled"],
        default: "Assigned",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Personnel", personnelSchema)
