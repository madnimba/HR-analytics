"use client"

import { BarChart3, UserPlus, Users, TrendingUp, GraduationCap, Heart, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"

interface MobileNavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const mobileNavItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "recruitment", label: "Recruitment", icon: UserPlus },
  { id: "onboarding", label: "Onboarding", icon: Users },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "learning", label: "Learning", icon: GraduationCap },
  { id: "engagement", label: "Engagement", icon: Heart },
]

export function MobileNavigation({ activeSection, setActiveSection }: MobileNavigationProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="bg-gradient-to-r from-slate-200/80 to-blue-100/80 dark:bg-slate-800 backdrop-blur-sm border-b border-slate-300/40 dark:border-slate-600/40 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
          Prism Inc. HR Portal
        </h1>
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
      <div className="flex gap-2 overflow-x-auto pb-2">
        {mobileNavItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl transition-all duration-300 ${
              activeSection === item.id
                ? "bg-white/80 dark:bg-slate-700/80 text-blue-700 dark:text-cyan-400 shadow-lg shadow-blue-200/50 dark:shadow-slate-900/50 border border-blue-200/50 dark:border-cyan-500/50"
                : "text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-700/40 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
