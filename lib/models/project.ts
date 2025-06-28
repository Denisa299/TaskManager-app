import mongoose, { Schema, type Document } from "mongoose"
import type { IUser } from "./user"

export interface IProject extends Document {
  name: string
  description?: string
  members: mongoose.Types.ObjectId[] | IUser[]
  createdBy: mongoose.Types.ObjectId | IUser
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
