"use client"

import { Users, UserPlus, TrendingUp, GraduationCap, Heart, Building2, BarChart3, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const navigationItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: BarChart3,
  },
  {
    id: "recruitment",
    title: "Recruitment",
    icon: UserPlus,
  },
  {
    id: "onboarding",
    title: "Onboarding",
    icon: Users,
  },
  {
    id: "performance",
    title: "Performance & Feedback",
    icon: TrendingUp,
  },
  {
    id: "learning",
    title: "Learning & Development",
    icon: GraduationCap,
  },
  {
    id: "engagement",
    title: "Engagement & Exit",
    icon: Heart,
  },
]

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Sidebar className="border-r border-slate-300/40 dark:border-slate-600/40 backdrop-blur-sm">
      <SidebarHeader className="p-6 border-b border-slate-300/40 dark:border-slate-600/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                FutureTech
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">HR Analytics Portal</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 hover:bg-white/40 dark:hover:bg-slate-700/40"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <Sun className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            )}
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full justify-start px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeSection === item.id
                        ? "bg-white/80 dark:bg-slate-700/80 shadow-lg shadow-blue-200/50 dark:shadow-slate-900/50 text-blue-700 dark:text-cyan-400 border border-blue-200/50 dark:border-cyan-500/50 transform scale-[1.02]"
                        : "hover:bg-white/40 dark:hover:bg-slate-700/40 hover:shadow-md text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 mr-3 ${activeSection === item.id ? "text-blue-600 dark:text-cyan-400" : "text-slate-600 dark:text-slate-400"}`}
                    />
                    <span className="font-medium text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
