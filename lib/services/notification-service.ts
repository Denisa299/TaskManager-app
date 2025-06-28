import { Notification } from "@/lib/models/notification"
import { connectToDatabase } from "@/lib/db/mongodb"

export interface CreateNotificationData {
  recipient: string
  sender?: string
  type: "task_assigned" | "task_updated" | "project_updated" | "comment_added" | "deadline_reminder" | "system" | "document"
  title: string
  message: string
  data?: {
    taskId?: string
    projectId?: string
    commentId?: string
    [key: string]: any
  }
}

export class NotificationService {
  static async createNotification(data: CreateNotificationData) {
    try {
      await connectToDatabase()

      const notification = new Notification(data)
      await notification.save()

      return notification
    } catch (error) {
      console.error("Eroare la crearea notificării:", error)
      throw error
    }
  }

  static async createTaskAssignedNotification(
    taskId: string,
    taskTitle: string,
    assigneeId: string,
    assignerId: string,
  ) {
    return this.createNotification({
      recipient: assigneeId,
      sender: assignerId,
      type: "task_assigned",
      title: "Task nou asignat",
      message: `Ai primit un task nou: "${taskTitle}"`,
      data: { taskId },
    })
  }

  static async createTaskUpdatedNotification(
    taskId: string,
    taskTitle: string,
    recipientId: string,
    updaterId: string,
    updateType: string,
  ) {
    return this.createNotification({
      recipient: recipientId,
      sender: updaterId,
      type: "task_updated",
      title: "Task actualizat",
      message: `Taskul "${taskTitle}" a fost ${updateType}`,
      data: { taskId },
    })
  }

  static async createProjectUpdatedNotification(
    projectId: string,
    projectName: string,
    recipientId: string,
    updaterId: string,
  ) {
    return this.createNotification({
      recipient: recipientId,
      sender: updaterId,
      type: "project_updated",
      title: "Proiect actualizat",
      message: `Proiectul "${projectName}" a fost actualizat`,
      data: { projectId },
    })
  }

  static async createCommentNotification(
    taskId: string,
    taskTitle: string,
    recipientId: string,
    commenterId: string,
    commenterName: string,
  ) {
    return this.createNotification({
      recipient: recipientId,
      sender: commenterId,
      type: "comment_added",
      title: "Comentariu nou",
      message: `${commenterName} a comentat la taskul "${taskTitle}"`,
      data: { taskId },
    })
  }

  static async createDeadlineReminderNotification(taskId: string, taskTitle: string, recipientId: string) {
    return this.createNotification({
      recipient: recipientId,
      type: "deadline_reminder",
      title: "Reminder deadline",
      message: `Taskul "${taskTitle}" are deadline-ul aproape`,
      data: { taskId },
    })
  }

  static async getUserNotifications(userId: string, limit = 20, offset = 0) {
    try {
      await connectToDatabase()

      const notifications = await Notification.find({ recipient: userId })
        .populate("sender", "firstName lastName avatar")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)

      return notifications
    } catch (error) {
      console.error("Eroare la obținerea notificărilor:", error)
      throw error
    }
  }

  static async getUnreadCount(userId: string) {
    try {
      await connectToDatabase()

      const count = await Notification.countDocuments({
        recipient: userId,
        read: false,
      })

      return count
    } catch (error) {
      console.error("Eroare la numărarea notificărilor necitite:", error)
      throw error
    }
  }

  static async markAsRead(notificationId: string, userId: string) {
    try {
      await connectToDatabase()

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { read: true },
        { new: true },
      )

      return notification
    } catch (error) {
      console.error("Eroare la marcarea notificării ca citită:", error)
      throw error
    }
  }

  static async markAllAsRead(userId: string) {
    try {
      await connectToDatabase()

      await Notification.updateMany({ recipient: userId, read: false }, { read: true })

      return true
    } catch (error) {
      console.error("Eroare la marcarea tuturor notificărilor ca citite:", error)
      throw error
    }
  }

  static async deleteNotification(notificationId: string, userId: string) {
    try {
      await connectToDatabase()

      await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId,
      })

      return true
    } catch (error) {
      console.error("Eroare la ștergerea notificării:", error)
      throw error
    }
  }
}
