import mongoose from "mongoose"

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  amenities: [String],
  availability: [
    {
      date: Date,
      startTime: String,
      endTime: String,
      isAvailable: Boolean,
    },
  ],
  contactPerson: String,
  contactPhone: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Venue", venueSchema)
