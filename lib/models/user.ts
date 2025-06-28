import mongoose, { Schema, type Document } from "mongoose"

export type UserRole = "admin" | "manager" | "member"

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
  avatar?: string
  status: "online" | "offline"
  tasks: number
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "manager", "member"], default: "member" },
    avatar: { type: String },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    tasks: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// Verific dacă modelul există deja pentru a evita recompilarea în dezvoltare
export const User = (mongoose.models?.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema)
