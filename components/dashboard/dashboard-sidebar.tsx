"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Calendar,
  Settings,
  HelpCircle,
  FolderKanban,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, hasPermission } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1280)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const routes = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: pathname === "/dashboard", show: true, badge: null },
    { label: "Proiecte", icon: FolderKanban, href: "/dashboard/projects", active: pathname === "/dashboard/projects", show: true, badge: null },
    { label: "Taskuri", icon: CheckSquare, href: "/dashboard/tasks", active: pathname === "/dashboard/tasks", show: true, badge: null },
    { label: "Calendar", icon: Calendar, href: "/dashboard/calendar", active: pathname === "/dashboard/calendar", show: true, badge: null },
    { label: "Echipă", icon: Users, href: "/dashboard/team", active: pathname === "/dashboard/team", show: hasPermission("view_team_data"), badge: null },
    { label: "Setări", icon: Settings, href: "/dashboard/settings", active: pathname === "/dashboard/settings", show: true, badge: null },
  ]

  const visibleRoutes = routes.filter((route) => route.show)

  return (
    <div
      className={`hidden md:flex flex-col border-r bg-background h-[calc(100vh-4rem)] transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
    >
      {user && (
        <div className={`flex items-center gap-3 p-4 border-b ${collapsed ? "justify-center" : ""}`}>
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
            <span className="text-sm">
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-medium text-sm truncate max-w-[160px]">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        <TooltipProvider>
          {visibleRoutes.map((route) => (
            <Tooltip key={route.href}>
              <TooltipTrigger asChild>
                <Link href={route.href}>
                  <Button
                    variant={route.active ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2 relative group",
                      route.active
                        ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-600 hover:to-green-500 text-white"
                        : "hover:bg-green-50",
                      collapsed ? "px-3" : ""
                    )}
                  >
                    <route.icon
                      className={`h-5 w-5 ${route.active ? "text-white" : "text-gray-500 group-hover:text-green-600"}`}
                    />
                    {!collapsed && <span>{route.label}</span>}
                    {route.badge && (
                      <Badge
                        className={`ml-auto ${route.active ? "bg-white text-green-600" : "bg-green-100 text-green-600"}`}
                        variant="outline"
                      >
                        {route.badge}
                      </Badge>
                    )}
                    {route.active && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-full"></div>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <div className="flex items-center gap-2">
                    {route.label}
                    {route.badge && (
                      <Badge variant="outline" className="bg-green-100 text-green-600">
                        {route.badge}
                      </Badge>
                    )}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <div className="mt-auto p-2 border-t">
       

        <Button
          variant="ghost"
          className="w-full justify-center mt-2 hover:bg-green-50 hover:text-green-600"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
    </div>
  )
}
