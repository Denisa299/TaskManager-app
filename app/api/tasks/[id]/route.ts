import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/mongodb"
import { Task } from "@/lib/models/task"
import { getUserFromToken } from "@/lib/auth/auth-utils"
import { hasPermission } from "@/lib/auth/permissions"
import { NotificationService } from "@/lib/services/notification-service"
import type { IUser } from "@/lib/models/user"

// Actualizează un task
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromToken(req) as Partial<IUser>
    if (!user || !user._id) {
      return NextResponse.json({ error: "Autentificare necesară" }, { status: 401 })
    }

    const userId = typeof user._id === "string" ? user._id : user._id.toString()

    const { title, description, status, priority, assignees, dueDate, subtasks } = await req.json()

    await connectToDatabase()

    const task = await Task.findById(params.id)
      .populate("assignees", "firstName lastName email")
      .populate("createdBy", "firstName lastName email")

    if (!task) {
      return NextResponse.json({ error: "Taskul nu a fost găsit" }, { status: 404 })
    }

    const isAssignee = task.assignees.some((assignee: any) => assignee._id.toString() === userId)
    const isCreator = task.createdBy._id.toString() === userId

    const canFullyUpdateTask =
      hasPermission(user as IUser, "manage_all_tasks") ||
      hasPermission(user as IUser, "assign_tasks") ||
      isCreator

    const canUpdateStatus = isAssignee && hasPermission(user as IUser, "update_own_tasks")

    if (!canFullyUpdateTask && !canUpdateStatus) {
      return NextResponse.json({ error: "Nu ai permisiunea de a actualiza acest task" }, { status: 403 })
    }

    if (!canFullyUpdateTask && canUpdateStatus) {
      if (title || description || priority || assignees || dueDate) {
        return NextResponse.json(
          { error: "Nu ai permisiunea de a modifica alte câmpuri în afară de status" },
          { status: 403 }
        )
      }
    }

    const oldStatus = task.status
    const oldAssignees = task.assignees.map((a: any) => a._id.toString())

    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignees && { assignees }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(subtasks && { subtasks }),
      },
      { new: true }
    )
      .populate("assignees", "firstName lastName email avatar status")
      .populate("project", "name")
      .populate("createdBy", "firstName lastName email")

    if (updatedTask) {
      if (status && status !== oldStatus) {
        const statusMessages = {
          todo: "mutat în To Do",
          "in-progress": "mutat în progres",
          completed: "finalizat",
        }

        for (const assignee of updatedTask.assignees) {
          if (assignee._id.toString() !== userId) {
            await NotificationService.createTaskUpdatedNotification(
              updatedTask._id.toString(),
              updatedTask.title,
              assignee._id.toString(),
              userId,
              statusMessages[status as keyof typeof statusMessages] || "actualizat"
            )
          }
        }
      }

      if (assignees) {
        const newAssignees = assignees.filter((id: string) => !oldAssignees.includes(id))
        for (const assigneeId of newAssignees) {
          if (assigneeId !== userId) {
            await NotificationService.createTaskAssignedNotification(
              updatedTask._id.toString(),
              updatedTask.title,
              assigneeId,
              userId
            )
          }
        }
      }
    }

    return NextResponse.json(updatedTask, { status: 200 })
  } catch (error) {
    console.error("Eroare la actualizarea taskului:", error)
    return NextResponse.json({ error: "Eroare la actualizarea taskului" }, { status: 500 })
  }
}
