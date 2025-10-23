import mongoose from "mongoose"

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Audio", "Visual", "Lighting", "Furniture", "Other"],
  },
  quantity: {
    type: Number,
    required: true,
  },
  availableQuantity: {
    type: Number,
    required: true,
  },
  description: String,
  condition: {
    type: String,
    enum: ["Excellent", "Good", "Fair", "Needs Repair"],
    default: "Good",
  },
  lastMaintenanceDate: Date,
  allocations: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
      quantityAllocated: Number,
      allocationDate: {
        type: Date,
        default: Date.now,
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

export default mongoose.model("Equipment", equipmentSchema)
