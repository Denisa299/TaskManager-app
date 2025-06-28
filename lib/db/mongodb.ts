import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not defined")
  console.log(
    "Available environment variables:",
    Object.keys(process.env).filter((key) => key.includes("MONGO")),
  )
  throw new Error("Please define the MONGODB_URI environment variable in .env.local")
}

declare global {
  var _mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

let cached = global._mongoose

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    console.log("Attempting to connect to MongoDB with URI:", MONGODB_URI?.substring(0, 20) + "...")

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ Successfully connected to MongoDB")
        return mongoose
      })
      .catch((error) => {
        console.error("❌ Failed to connect to MongoDB:", error)
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("Error in connectToDatabase:", e)
    throw e
  }

  return cached.conn
}
