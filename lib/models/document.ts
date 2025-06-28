import mongoose from "mongoose"

export interface IDocument {
  _id?: string
  name: string
  originalName: string
  size: number
  type: string
  url: string
  uploadedBy: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  projectId?: string
  teamId?: string
  description?: string
  tags?: string[]
  version: number
  isPublic: boolean
  downloadCount: number
  createdAt: Date
  updatedAt: Date
}

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    uploadedBy: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      avatar: String,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    description: {
      type: String,
      trim: true,
    },
    tags: [String],
    version: {
      type: Number,
      default: 1,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

documentSchema.index({ projectId: 1, createdAt: -1 })
documentSchema.index({ teamId: 1, createdAt: -1 })
documentSchema.index({ uploadedBy: 1 })
documentSchema.index({ name: "text", description: "text" })

export const Document = mongoose.models.Document || mongoose.model<IDocument>("Document", documentSchema)
