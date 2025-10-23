import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import eventRoutes from "./routes/events.js"
import userRoutes from "./routes/users.js"
import resourceRoutes from "./routes/resources.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/event-management")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/users", userRoutes)
app.use("/api/resources", resourceRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
