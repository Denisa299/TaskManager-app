import { connectToDatabase } from "@/lib/db/mongodb"
import { Document, type IDocument } from "@/lib/models/document"
import { NotificationService } from "./notification-service"
import { writeFile, mkdir, unlink } from "fs/promises"
import path from "path"

export class DocumentService {
  static async getDocuments(options: { projectId?: string; search?: string; limit?: number; page?: number } = {}) {
    await connectToDatabase()

    const { projectId, search, limit = 20, page = 1 } = options
    const query: any = {}

    if (projectId) {
      query.projectId = projectId
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean()

    return documents
  }

  static async uploadDocument(
    file: File,
    userId: string,
    userName: string,
    userEmail: string,
    userAvatar?: string,
    options: { description?: string; tags?: string[]; projectId?: string } = {},
  ) {
    await connectToDatabase()

    const { description, tags, projectId } = options

    // Create upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", "documents")
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const nameWithoutExt = path.basename(file.name, extension)
    const filename = `${timestamp}-${nameWithoutExt}${extension}`
    const filepath = path.join(uploadDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    const fileUrl = `/uploads/documents/${filename}`

    const document = new Document({
      name: nameWithoutExt,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl,
      uploadedBy: {
        _id: userId,
        name: userName,
        email: userEmail,
        avatar: userAvatar,
      },
      projectId,
      description,
      tags,
      isPublic: false,
      downloadCount: 0,
    })

    await document.save()

    // Create notification for project members if this is a project document
    if (projectId) {
      await NotificationService.createNotification({
        type: "document",
        title: "Document nou",
        content: `${userName} a încărcat un document nou: ${nameWithoutExt}`,
        sender: userId,
        recipients: [], // Will be filled by the service with project members
        resourceId: projectId,
        resourceType: "project",
        resourceUrl: `/dashboard/documents?projectId=${projectId}`,
      })
    }

    return document
  }

  static async updateDocument(documentId: string, updates: Partial<IDocument>, userId: string) {
    await connectToDatabase()

    const document = await Document.findById(documentId)
    if (!document) {
      throw new Error("Document not found")
    }

    if (document.uploadedBy._id.toString() !== userId) {
      throw new Error("Unauthorized")
    }

    Object.assign(document, updates)
    await document.save()

    return document
  }

  static async deleteDocument(documentId: string, userId: string) {
    await connectToDatabase()

    const document = await Document.findById(documentId)
    if (!document) {
      throw new Error("Document not found")
    }

    if (document.uploadedBy._id.toString() !== userId) {
      throw new Error("Unauthorized")
    }

    // Delete file from filesystem
    try {
      const filepath = path.join(process.cwd(), "public", document.url)
      await unlink(filepath)
    } catch (error) {
      console.error("Error deleting file:", error)
    }

    await Document.findByIdAndDelete(documentId)

    return { success: true }
  }

  static async incrementDownloadCount(documentId: string) {
    await connectToDatabase()

    const document = await Document.findById(documentId)
    if (!document) {
      throw new Error("Document not found")
    }

    document.downloadCount += 1
    await document.save()

    return document
  }
}
