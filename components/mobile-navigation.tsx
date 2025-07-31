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
    <div className="bg-gradient-to-r from-slate-200/90 to-blue-100/90 dark:from-slate-800/95 dark:to-slate-900/95 backdrop-blur-md border-b border-slate-300/50 dark:border-slate-600/50 p-3 sm:p-4">
      {/* Header with improved spacing and vibrant colors */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h1 className="text-lg sm:text-xl font-bold">
          <span className="sm:text-lg bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            HR Portal By{" "}
          </span>
          <span className="text-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-700 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-500 bg-clip-text text-transparent animate-pulse">
            Arctic Wolves
          </span>
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-full transition-all duration-200"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          ) : (
            <Sun className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          )}
        </Button>
      </div>
      
      {/* Mobile-optimized tab navigation with wrapping */}
      <div className="flex flex-wrap gap-2 pb-2">
        {mobileNavItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 ${
              activeSection === item.id
                ? "bg-gradient-to-r from-blue-600/90 to-cyan-600/90 dark:from-blue-500/90 dark:to-cyan-500/90 text-white shadow-lg shadow-blue-200/50 dark:shadow-cyan-900/50 border border-blue-300/50 dark:border-cyan-400/50 scale-105"
                : "text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:text-slate-800 dark:hover:text-slate-200 hover:scale-105"
            }`}
          >
            <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
