import type React from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { ProjectProvider } from "@/contexts/project-context"
import { TaskProvider } from "@/contexts/task-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { DocumentProvider } from "@/contexts/document-context"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProjectProvider>
        <TaskProvider>
          <NotificationProvider>
            <DocumentProvider>
              <div className="flex h-screen overflow-hidden">
                <DashboardSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <DashboardHeader />
                  <main className="flex-1 overflow-auto p-6">{children}</main>
                </div>
              </div>
            </DocumentProvider>
          </NotificationProvider>
        </TaskProvider>
      </ProjectProvider>
    </AuthProvider>
  )
}
