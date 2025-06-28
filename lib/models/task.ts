import mongoose, { Schema, type Document } from "mongoose"
import type { IUser } from "./user"
import type { IProject } from "./project"

export interface ITask extends Document {
  title: string
  description?: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  project: mongoose.Types.ObjectId | IProject
  assignees: mongoose.Types.ObjectId[] | IUser[]
  dueDate?: Date
  comments: number
  attachments: number
  subtasks: {
    total: number
    completed: number
  }
  createdBy: mongoose.Types.ObjectId | IUser
  createdAt: Date
  updatedAt: Date
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dueDate: { type: Date },
    comments: { type: Number, default: 0 },
    attachments: { type: Number, default: 0 },
    subtasks: {
      total: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

export const Task = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema)
