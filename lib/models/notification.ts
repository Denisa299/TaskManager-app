import mongoose, { Schema, type Document } from "mongoose"
import type { IUser } from "./user"

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId | IUser
  sender?: mongoose.Types.ObjectId | IUser
  type: "task_assigned" | "task_updated" | "project_updated" | "comment_added" | "deadline_reminder" | "system"
  title: string
  message: string
  data?: {
    taskId?: string
    projectId?: string
    commentId?: string
    [key: string]: any
  }
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema: Schema = new Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["task_assigned", "task_updated", "project_updated", "comment_added", "deadline_reminder", "system"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Index pentru performanță
NotificationSchema.index({ recipient: 1, createdAt: -1 })
NotificationSchema.index({ recipient: 1, read: 1 })

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)
