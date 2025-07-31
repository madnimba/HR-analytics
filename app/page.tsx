"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { MobileNavigation } from "@/components/mobile-navigation"
import { ThemeProvider } from "@/contexts/theme-context"
import { useIsMobile } from "@/hooks/use-mobile"

function HRDashboardContent() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {isMobile ? (
        <div className="flex flex-col h-screen">
          <MobileNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
          <main className="flex-1 overflow-auto">
            <DashboardContent activeSection={activeSection} />
          </main>
        </div>
      ) : (
        <SidebarProvider defaultOpen={true}>
          <div className="flex h-screen w-full">
            <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              <DashboardContent activeSection={activeSection} />
            </main>
          </div>
        </SidebarProvider>
      )}
    </div>
  )
}

export default function HRDashboard() {
  return (
    <ThemeProvider>
      <HRDashboardContent />
    </ThemeProvider>
  )
}
