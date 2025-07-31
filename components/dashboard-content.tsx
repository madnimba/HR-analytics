"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Clock, Target, UserCheck, Star, Award, Heart } from "lucide-react"
import { HRBotChat } from "@/components/hr-bot-chat"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from "recharts"

interface DashboardContentProps {
  activeSection: string
}

// Dashboard Data
const companyStats = [
  { label: "Total Employees", value: "3,000", icon: Users, color: "from-blue-500 to-blue-600" },
  { label: "Avg. Tenure", value: "2.7 Years", icon: Clock, color: "from-emerald-500 to-emerald-600" },
  { label: "HR Health Index", value: "87%", icon: TrendingUp, color: "from-violet-500 to-violet-600" },
]

// Monthly Growth Data
const monthlyGrowthData = [
  { month: "Jan 2024", hires: 45, departures: 32 },
  { month: "Feb 2024", hires: 52, departures: 28 },
  { month: "Mar 2024", hires: 38, departures: 35 },
  { month: "Apr 2024", hires: 61, departures: 29 },
  { month: "May 2024", hires: 48, departures: 41 },
  { month: "Jun 2024", hires: 55, departures: 33 },
  { month: "Jul 2024", hires: 42, departures: 38 },
  { month: "Aug 2024", hires: 58, departures: 31 },
  { month: "Sep 2024", hires: 47, departures: 36 },
  { month: "Oct 2024", hires: 53, departures: 42 },
  { month: "Nov 2024", hires: 49, departures: 34 },
  { month: "Dec 2024", hires: 44, departures: 39 },
]

// Cost Breakdown Data
const costBreakdownData = [
  { quarter: "Q1", training: 0.2, payroll: 2.8, benefits: 0.6, overhead: 0.24 },
  { quarter: "Q2", training: 0.25, payroll: 2.9, benefits: 0.65, overhead: 0.26 },
  { quarter: "Q3", training: 0.22, payroll: 3.0, benefits: 0.62, overhead: 0.28 },
  { quarter: "Q4", training: 0.28, payroll: 3.1, benefits: 0.68, overhead: 0.25 },
]

// Satisfaction Data
const satisfactionData = [
  { department: "HR", score: 4.2 },
  { department: "Marketing", score: 3.8 },
  { department: "Engineering", score: 4.1 },
  { department: "Finance", score: 3.9 },
  { department: "Sales", score: 4.0 },
]

// Employee Timeline Data
const employeeTimelineData = [
  { month: "Jan 2024", employees: 2890 },
  { month: "Feb 2024", employees: 2914 },
  { month: "Mar 2024", employees: 2903 },
  { month: "Apr 2024", employees: 2935 },
  { month: "May 2024", employees: 2942 },
  { month: "Jun 2024", employees: 2964 },
  { month: "Jul 2024", employees: 2968 },
  { month: "Aug 2024", employees: 2995 },
  { month: "Sep 2024", employees: 3006 },
  { month: "Oct 2024", employees: 3017 },
  { month: "Nov 2024", employees: 3032 },
  { month: "Dec 2024", employees: 3000 },
]

// Engagement Data
const engagementTrendsData = [
  { month: "Jan 2024", Support: 3.5, Finance: 4.1, HR: 3.8, Marketing: 4.2, Engineering: 4.0, Sales: 3.6 },
  { month: "Feb 2024", Support: 3.4, Finance: 4.0, HR: 3.9, Marketing: 4.3, Engineering: 4.1, Sales: 3.5 },
  { month: "Mar 2024", Support: 3.6, Finance: 4.2, HR: 4.0, Marketing: 4.1, Engineering: 4.2, Sales: 3.7 },
  { month: "Apr 2024", Support: 3.7, Finance: 4.3, HR: 4.1, Marketing: 4.4, Engineering: 4.3, Sales: 3.8 },
  { month: "May 2024", Support: 3.5, Finance: 4.1, HR: 3.9, Marketing: 4.2, Engineering: 4.1, Sales: 3.6 },
  { month: "Jun 2024", Support: 3.8, Finance: 4.4, HR: 4.2, Marketing: 4.5, Engineering: 4.4, Sales: 3.9 },
  { month: "Jul 2024", Support: 3.6, Finance: 4.2, HR: 4.0, Marketing: 4.3, Engineering: 4.2, Sales: 3.7 },
  { month: "Aug 2024", Support: 3.9, Finance: 4.5, HR: 4.3, Marketing: 4.6, Engineering: 4.5, Sales: 4.0 },
  { month: "Sep 2024", Support: 3.7, Finance: 4.3, HR: 4.1, Marketing: 4.4, Engineering: 4.3, Sales: 3.8 },
  { month: "Oct 2024", Support: 4.0, Finance: 4.6, HR: 4.4, Marketing: 4.7, Engineering: 4.6, Sales: 4.1 },
  { month: "Nov 2024", Support: 3.8, Finance: 4.4, HR: 4.2, Marketing: 4.5, Engineering: 4.4, Sales: 3.9 },
  { month: "Dec 2024", Support: 3.5, Finance: 4.1, HR: 3.9, Marketing: 4.2, Engineering: 4.1, Sales: 3.6 },
]

const npsData = [
  { department: "Sales", nps: 45 },
  { department: "Engineering", nps: 62 },
  { department: "Marketing", nps: 38 },
  { department: "HR", nps: 41 },
  { department: "Support", nps: 44 },
  { department: "Finance", nps: 39 },
]

const heatmapData = [
  { department: "Engineering", managerRelation: 4.5, workLifeBalance: 4.2 },
  { department: "Support", managerRelation: 3.8, workLifeBalance: 3.6 },
  { department: "Marketing", managerRelation: 4.2, workLifeBalance: 4.0 },
  { department: "HR", managerRelation: 4.0, workLifeBalance: 3.9 },
  { department: "Finance", managerRelation: 3.9, workLifeBalance: 3.7 },
  { department: "Sales", managerRelation: 4.3, workLifeBalance: 4.1 },
]

// Recruitment Data
const hiringByDepartment = [
  { name: "Engineering", value: 45, color: "#3B82F6" },
  { name: "Sales", value: 30, color: "#10B981" },
  { name: "Marketing", value: 15, color: "#8B5CF6" },
  { name: "Operations", value: 10, color: "#F59E0B" },
]

const dropoffByStage = [
  { stage: "Application", candidates: 1200 },
  { stage: "Screening", candidates: 800 },
  { stage: "Interview", candidates: 400 },
  { stage: "Final", candidates: 200 },
  { stage: "Offer", candidates: 120 },
  { stage: "Hired", candidates: 90 },
]

// Performance Data
const skillGaps = [
  { skill: "Leadership", current: 65, required: 85 },
  { skill: "Technical", current: 80, required: 90 },
  { skill: "Communication", current: 70, required: 85 },
  { skill: "Problem Solving", current: 75, required: 88 },
  { skill: "Teamwork", current: 85, required: 90 },
  { skill: "Innovation", current: 60, required: 80 },
]

const performanceMetrics = [
  { title: "eNPS Score", value: "+42", trend: "+5", color: "emerald" },
  { title: "Attrition Risk", value: "12%", trend: "-3%", color: "red" },
  { title: "Performance Rating", value: "4.2/5", trend: "+0.3", color: "blue" },
  { title: "Goal Achievement", value: "89%", trend: "+7%", color: "violet" },
]

// New Performance Data
const goalAchievementData = [
  { name: "Achieved", value: 75, color: "#8B5CF6" },
  { name: "In Progress", value: 20, color: "#A78BFA" },
  { name: "Not Started", value: 5, color: "#E0E7FF" },
]

const hoursVsOutputData = [
  { department: "Sales", hoursWorked: 120, outputScore: 85 },
  { department: "Engineering", hoursWorked: 140, outputScore: 92 },
  { department: "HR", hoursWorked: 110, outputScore: 78 },
  { department: "Marketing", hoursWorked: 125, outputScore: 88 },
  { department: "Support", hoursWorked: 135, outputScore: 82 },
  { department: "Finance", hoursWorked: 130, outputScore: 90 },
]

const departmentRatingsData = [
  { department: "Engineering", rating: 3.16 },
  { department: "Sales", rating: 3.5 },
  { department: "HR", rating: 3.95 },
  { department: "Marketing", rating: 4.6 },
  { department: "Support", rating: 3.12 },
  { department: "Finance", rating: 3.2 },
]

const performanceOverTimeData = [
  { month: "Jan 2024", rating: 4.0 },
  { month: "Feb 2024", rating: 4.1 },
  { month: "Mar 2024", rating: 4.3 },
  { month: "Apr 2024", rating: 4.5 },
  { month: "May 2024", rating: 4.2 },
  { month: "Jun 2024", rating: 4.1 },
  { month: "Jul 2024", rating: 4.6 },
  { month: "Aug 2024", rating: 4.4 },
  { month: "Sep 2024", rating: 4.3 },
  { month: "Oct 2024", rating: 4.2 },
  { month: "Nov 2024", rating: 4.4 },
  { month: "Dec 2024", rating: 4.5 },
]

const employeeProductivityData = [
  {
    employee: "Employee 1",
    productivity: "$11,800",
    goalAchieved: "NO",
    performanceTrend: [4.1, 4.0, 4.2, 4.1, 3.9, 4.0, 4.1],
    outputTrend: [85, 82, 88, 86, 84, 87, 89],
  },
  {
    employee: "Employee 2",
    productivity: "$13,250",
    goalAchieved: "YES",
    performanceTrend: [3.8, 3.9, 4.1, 4.2, 4.3, 4.1, 4.2],
    outputTrend: [78, 80, 85, 88, 90, 87, 89],
  },
  {
    employee: "Employee 3",
    productivity: "$9,700",
    goalAchieved: "NO",
    performanceTrend: [3.5, 3.4, 3.6, 3.5, 3.3, 3.4, 3.5],
    outputTrend: [65, 68, 70, 69, 67, 68, 70],
  },
  {
    employee: "Employee 4",
    productivity: "$15,600",
    goalAchieved: "YES",
    performanceTrend: [4.5, 4.4, 4.6, 4.5, 4.7, 4.6, 4.5],
    outputTrend: [92, 94, 96, 95, 98, 96, 94],
  },
  {
    employee: "Employee 5",
    productivity: "$12,450",
    goalAchieved: "YES",
    performanceTrend: [4.0, 4.1, 4.0, 4.2, 4.1, 4.0, 4.1],
    outputTrend: [82, 84, 83, 86, 85, 83, 84],
  },
  {
    employee: "Employee 6",
    productivity: "$14,800",
    goalAchieved: "YES",
    performanceTrend: [4.3, 4.2, 4.4, 4.3, 4.5, 4.4, 4.3],
    outputTrend: [88, 87, 90, 89, 92, 90, 88],
  },
  {
    employee: "Employee 7",
    productivity: "$14,200",
    goalAchieved: "YES",
    performanceTrend: [4.2, 4.1, 4.3, 4.2, 4.4, 4.3, 4.2],
    outputTrend: [86, 85, 88, 87, 90, 89, 87],
  },
]

// Learning & Development Data
const learningMetrics = [
  {
    title: "Training Participation Rate",
    value: "76%",
    change: "5.5%",
    previous: "72%",
    trend: "up",
  },
  {
    title: "Training Hours per Employee",
    value: "14.2 hours",
    change: "-6.0%",
    previous: "15.1 hours",
    trend: "down",
  },
  {
    title: "Training Completion Rate",
    value: "85%",
    change: "-2.3%",
    previous: "87%",
    trend: "down",
  },
  {
    title: "Internal Promotion Rate",
    value: "18%",
    change: "20%",
    previous: "15%",
    trend: "up",
  },
]

const roiTrainingData = [
  { month: "Jan 2024", roi: 120 },
  { month: "Feb 2024", roi: 110 },
  { month: "Mar 2024", roi: 125 },
  { month: "Apr 2024", roi: 135 },
  { month: "May 2024", roi: 140 },
  { month: "Jun 2024", roi: 130 },
  { month: "Jul 2024", roi: 145 },
  { month: "Aug 2024", roi: 150 },
  { month: "Sep 2024", roi: 155 },
  { month: "Oct 2024", roi: 160 },
  { month: "Nov 2024", roi: 165 },
]

const skillsImprovementData = [
  { department: "Sales", preTraining: 3.2, postTraining: 4.1 },
  { department: "Support", preTraining: 3.5, postTraining: 4.3 },
  { department: "Engineering", preTraining: 3.8, postTraining: 4.5 },
  { department: "Marketing", preTraining: 3.4, postTraining: 4.2 },
  { department: "HR", preTraining: 3.6, postTraining: 4.0 },
]

const allTrainingsData = [
  { training: "Onboarding", attendees: 1056 },
  { training: "Soft Skills", attendees: 924 },
  { training: "Security", attendees: 448 },
  { training: "Technical", attendees: 387 },
  { training: "Sales", attendees: 345 },
  { training: "Product", attendees: 298 },
  { training: "Communication", attendees: 287 },
  { training: "Industry", attendees: 94 },
  { training: "Reskilling", attendees: 84 },
]

const incompleteTrainingsData = [
  { training: "Onboarding", employees: 34, deadline: "5/20/2025", status: "See more information" },
  { training: "Soft Skills", employees: 28, deadline: "4/23/2025", status: "See more information" },
  { training: "Security", employees: 20, deadline: "7/13/2025", status: "See more information" },
  { training: "Technical", employees: 173, deadline: "8/30/2025", status: "See more information" },
  { training: "Sales", employees: 38, deadline: "4/30/2025", status: "See more information" },
  { training: "Product", employees: 40, deadline: "6/7/2025", status: "See more information" },
  { training: "Communication", employees: 231, deadline: "4/25/2025", status: "See more information" },
  { training: "Industry", employees: 425, deadline: "9/1/2025", status: "See more information" },
  { training: "Reskilling", employees: 287, deadline: "10/1/2025", status: "See more information" },
]

const renderLearning = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
          Learning & Development Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Track training programs and employee skill development
        </p>
      </div>
      <div className="flex items-center gap-4">
        <select className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200">
          <option>Last year</option>
          <option>Last 6 months</option>
          <option>Last 3 months</option>
        </select>
      </div>
    </div>

    {/* Key Learning Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {learningMetrics.map((metric, index) => (
        <Card
          key={index}
          className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl"
        >
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">{metric.title}</h3>
            <div className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">{metric.value}</div>
            <div className="flex items-center text-sm">
              <Badge
                className={`mr-2 ${metric.trend === "up" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"}`}
              >
                {metric.change}
              </Badge>
              <span className="text-slate-600 dark:text-slate-400">Versus</span>
              <span className="ml-2 font-medium text-slate-800 dark:text-slate-200">{metric.previous}</span>
              <span className="ml-1 text-slate-600 dark:text-slate-400">Previous period</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Main Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ROI in Training */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-200">ROI in Training (Monthly Overview)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roiTrainingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[80, 180]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="roi" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Employee Skills Improvement */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-200">Employee Skills Improvement</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-slate-600 dark:text-slate-400">Pre-Training Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded"></div>
              <span className="text-slate-600 dark:text-slate-400">Post-Training Rating</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsImprovementData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="department" tick={{ fontSize: 12 }} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="preTraining" fill="#8b5cf6" radius={[0, 2, 2, 0]} />
              <Bar dataKey="postTraining" fill="#06b6d4" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Employee Feedback Heatmap */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-200">Employee Feedback On Training Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div></div>
              <div className="text-center font-medium text-slate-600 dark:text-slate-400">Not Satisfied</div>
              <div className="text-center font-medium text-slate-600 dark:text-slate-400">Slightly Satisfied</div>
              <div className="text-center font-medium text-slate-600 dark:text-slate-400">Neutral</div>
              <div className="text-center font-medium text-slate-600 dark:text-slate-400">Very Satisfied</div>
            </div>

            {/* Onboarding */}
            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Onboarding</div>
              <div className="h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                15%
              </div>
              <div className="h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                25%
              </div>
              <div className="h-8 bg-gradient-to-r from-green-400 to-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                35%
              </div>
              <div className="h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded flex items-center justify-center text-white text-xs font-bold">
                25%
              </div>
            </div>

            {/* Security */}
            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Security</div>
              <div className="h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                10%
              </div>
              <div className="h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                20%
              </div>
              <div className="h-8 bg-gradient-to-r from-green-400 to-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                40%
              </div>
              <div className="h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded flex items-center justify-center text-white text-xs font-bold">
                30%
              </div>
            </div>

            {/* Communication */}
            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Communication</div>
              <div className="h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                8%
              </div>
              <div className="h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                18%
              </div>
              <div className="h-8 bg-gradient-to-r from-green-400 to-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                42%
              </div>
              <div className="h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded flex items-center justify-center text-white text-xs font-bold">
                32%
              </div>
            </div>

            {/* Soft Skills */}
            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Soft Skills</div>
              <div className="h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                5%
              </div>
              <div className="h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                15%
              </div>
              <div className="h-8 bg-gradient-to-r from-green-400 to-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                45%
              </div>
              <div className="h-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded flex items-center justify-center text-white text-xs font-bold">
                35%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Bottom Section - Training Tables */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* All Trainings */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-200">All Trainings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={allTrainingsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 1200]} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="training" tick={{ fontSize: 12 }} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="attendees" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Attendees</span>
          </div>
        </CardContent>
      </Card>

      {/* Incomplete Trainings */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-200">Incomplete Trainings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-2 font-medium text-slate-600 dark:text-slate-400 text-sm">
                    Training
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-slate-600 dark:text-slate-400 text-sm">
                    Employees
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-slate-600 dark:text-slate-400 text-sm">
                    Deadline
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-slate-600 dark:text-slate-400 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {incompleteTrainingsData.map((training, index) => (
                  <tr key={index} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-3 px-2 font-medium text-slate-800 dark:text-slate-200 text-sm">
                      {training.training}
                    </td>
                    <td className="py-3 px-2 text-slate-700 dark:text-slate-300 text-sm">{training.employees}</td>
                    <td className="py-3 px-2 text-slate-700 dark:text-slate-300 text-sm">
                      <span
                        className={`${
                          new Date(training.deadline) < new Date()
                            ? "text-red-600 dark:text-red-400 font-medium"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {training.deadline}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button className="text-blue-600 dark:text-cyan-400 hover:underline text-sm">
                        {training.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)

// Update the main return statement to use renderLearning instead of renderComingSoon
export function DashboardContent({ activeSection }: DashboardContentProps) {
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Prism Inc. HR Reporting Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Comprehensive workforce analytics and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200">
            <option>Last year</option>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
          </select>
          <select className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>Marketing</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-200" />
              <Badge className="bg-green-500 text-white">+3.6%</Badge>
            </div>
            <h3 className="text-sm font-medium text-blue-100 mb-1">Total Number of Employees</h3>
            <div className="text-4xl font-bold mb-2">3,000</div>
            <div className="flex items-center text-sm text-blue-200">
              <span>2,890</span>
              <span className="mx-2">Versus</span>
              <span>Previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-indigo-200" />
              <Badge className="bg-green-500 text-white">-6.5%</Badge>
            </div>
            <h3 className="text-sm font-medium text-indigo-100 mb-1">Average Time to Fill a Position</h3>
            <div className="text-4xl font-bold mb-2">29 days</div>
            <div className="flex items-center text-sm text-indigo-200">
              <span>31 days</span>
              <span className="mx-2">Versus</span>
              <span>Previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-200" />
              <Badge className="bg-green-500 text-white">-2.1%</Badge>
            </div>
            <h3 className="text-sm font-medium text-purple-100 mb-1">Turnover Rate</h3>
            <div className="text-4xl font-bold mb-2">13.8%</div>
            <div className="flex items-center text-sm text-purple-200">
              <span>14.1%</span>
              <span className="mx-2">Versus</span>
              <span>Previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-violet-200" />
              <Badge className="bg-green-500 text-white">+2.4%</Badge>
            </div>
            <h3 className="text-sm font-medium text-violet-100 mb-1">Total Employee Cost</h3>
            <div className="text-4xl font-bold mb-2">$3.84M</div>
            <div className="flex items-center text-sm text-violet-200">
              <span>$3.75M</span>
              <span className="mx-2">Versus</span>
              <span>Previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Employee Growth Chart */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              Net Employee Growth: Hires vs. Departures
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">New Hires</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Departures</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="hires" fill="#ec4899" radius={[2, 2, 0, 0]} />
                <Bar dataKey="departures" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Total Employee Cost Breakdown */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-600 dark:text-cyan-400" />
              Total Employee Cost
            </CardTitle>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Training</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Payroll</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Benefits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Overhead</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="training" stackId="cost" fill="#ec4899" />
                <Bar dataKey="payroll" stackId="cost" fill="#3b82f6" />
                <Bar dataKey="benefits" stackId="cost" fill="#4f46e5" />
                <Bar dataKey="overhead" stackId="cost" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Satisfaction Rate */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-600 dark:text-cyan-400" />
              Employee Satisfaction Rate
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Rating Score by Department</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {satisfactionData.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dept.department}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{dept.score}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-pink-600 dark:from-cyan-400 dark:to-cyan-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(dept.score / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Count Over Time */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-cyan-400" />
              Total Number of Employees Over Time
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Monthly employee count trends</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={employeeTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[2800, 3100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{ fill: "#ec4899", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#ec4899", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional HR Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-cyan-500 dark:to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">94.2%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Attendance Rate</div>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">+2.1%</Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-cyan-500 dark:to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">4.2/5</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Performance Rating</div>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">+0.3</Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 dark:from-cyan-500 dark:to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">+42</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">eNPS Score</div>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">+5</Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-cyan-500 dark:to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">89%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Goal Achievement</div>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">+7%</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderEngagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Employee Engagement Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitor employee satisfaction and engagement metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200">
            <option>Last year</option>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
          </select>
          <select className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>Marketing</option>
          </select>
        </div>
      </div>

      {/* Key Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-slate-300" />
              <Badge className="bg-green-500 text-white">+6%</Badge>
            </div>
            <h3 className="text-sm font-medium text-slate-300 mb-1">Participation Rate Engagement Surveys</h3>
            <div className="text-4xl font-bold mb-2">72%</div>
            <div className="flex items-center text-sm text-slate-300">
              <span>68%</span>
              <span className="mx-2">Versus</span>
              <span>Previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-slate-300" />
              <Badge className="bg-green-500 text-white">+2.4%</Badge>
            </div>
            <h3 className="text-sm font-medium text-slate-300 mb-1">Employee Engagement Score</h3>
            <div className="text-4xl font-bold mb-2">4.2</div>
            <div className="flex items-center text-sm text-slate-300">
              <span>4.1</span>
              <span className="mx-2">Versus</span>
              <span>Previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-slate-300" />
              <Badge className="bg-green-500 text-white">+2.6%</Badge>
            </div>
            <h3 className="text-sm font-medium text-slate-300 mb-1">Employee Satisfaction Score</h3>
            <div className="text-4xl font-bold mb-2">4.0</div>
            <div className="flex items-center text-sm text-slate-300">
              <span>3.9</span>
              <span className="mx-2">Versus</span>
              <span>Previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-slate-300" />
              <Badge className="bg-green-500 text-white">+2.7%</Badge>
            </div>
            <h3 className="text-sm font-medium text-slate-300 mb-1">Work-Life Balance Score</h3>
            <div className="text-4xl font-bold mb-2">3.8</div>
            <div className="flex items-center text-sm text-slate-300">
              <span>3.7</span>
              <span className="mx-2">Versus</span>
              <span>Previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trends Chart */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              Employee Engagement Score Trends by Department
            </CardTitle>
            <div className="flex items-center gap-4 text-xs flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-400 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Finance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">HR</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Marketing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Engineering</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Sales</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={engagementTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis domain={[3, 5]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Line type="monotone" dataKey="Support" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Finance" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="HR" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Marketing" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Engineering" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Sales" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Heatmap */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-600 dark:text-cyan-400" />
              Department Engagement Heatmap
            </CardTitle>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Rating:</span>
              <div className="flex items-center gap-4">
                <span className="text-slate-600 dark:text-slate-400">0</span>
                <span className="text-slate-600 dark:text-slate-400">5</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div>Departments</div>
                <div className="text-center">Manager-Employee Relationship Score</div>
                <div className="text-center">Work-Life Balance Score</div>
              </div>
              {heatmapData.map((dept, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{dept.department}</div>
                  <div className="flex items-center justify-center">
                    <div
                      className="h-8 rounded flex items-center justify-center text-white text-xs font-bold min-w-[60px]"
                      style={{
                        backgroundColor: `rgba(6, 182, 212, ${dept.managerRelation / 5})`,
                      }}
                    >
                      {dept.managerRelation}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div
                      className="h-8 rounded flex items-center justify-center text-white text-xs font-bold min-w-[60px]"
                      style={{
                        backgroundColor: `rgba(6, 182, 212, ${dept.workLifeBalance / 5})`,
                      }}
                    >
                      {dept.workLifeBalance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NPS Chart */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 dark:text-cyan-400" />
            Net Promoter Score (NPS)
          </CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">Employee advocacy by department</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={npsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 70]} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="department" tick={{ fontSize: 12 }} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="nps" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  const renderRecruitment = () => (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Recruitment Analytics</h2>
        <p className="text-slate-600 dark:text-slate-400">Track hiring performance and candidate pipeline</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring by Department */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200">Hiring by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={hiringByDepartment}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {hiringByDepartment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Drop-off by Stage */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200">Candidate Drop-off by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dropoffByStage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="candidates" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <UserCheck className="w-8 h-8 text-blue-600 dark:text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">90</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">New Hires (This Month)</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-emerald-600 dark:text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">18</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Avg. Days to Hire</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-violet-600 dark:text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">75%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Offer Acceptance Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-amber-600 dark:text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">4.6</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Candidate Experience</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Employee Performance Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Monitor employee performance and skill development</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200">
            <option>Last year</option>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
          </select>
          <select className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>Marketing</option>
          </select>
        </div>
      </div>

      {/* Top Row - Key Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Average Performance by Department */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
              Average Performance by Department
            </h3>
            <div className="text-5xl font-bold text-slate-800 dark:text-slate-200 mb-2">4.1</div>
            <div className="flex items-center text-sm">
              <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mr-2">+2.5%</Badge>
              <span className="text-slate-600 dark:text-slate-400">Versus</span>
              <span className="ml-2 font-medium text-slate-800 dark:text-slate-200">4.0</span>
              <span className="ml-1 text-slate-600 dark:text-slate-400">Previous period</span>
            </div>
          </CardContent>
        </Card>

        {/* Productivity per Employee */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">Productivity per Employee</h3>
            <div className="text-5xl font-bold text-slate-800 dark:text-slate-200 mb-2">$12,750</div>
            <div className="flex items-center text-sm">
              <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mr-2">+2.8%</Badge>
              <span className="text-slate-600 dark:text-slate-400">Versus</span>
              <span className="ml-2 font-medium text-slate-800 dark:text-slate-200">$12,400</span>
              <span className="ml-1 text-slate-600 dark:text-slate-400">Previous period</span>
            </div>
          </CardContent>
        </Card>

        {/* High-performing Employee Ratio */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
              High-performing Employee Ratio
            </h3>
            <div className="text-5xl font-bold text-slate-800 dark:text-slate-200 mb-2">28%</div>
            <div className="flex items-center text-sm">
              <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mr-2">+12%</Badge>
              <span className="text-slate-600 dark:text-slate-400">Versus</span>
              <span className="ml-2 font-medium text-slate-800 dark:text-slate-200">25%</span>
              <span className="ml-1 text-slate-600 dark:text-slate-400">Previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Achievement Rate */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200">Goal Achievement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalAchievementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {goalAchievementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hours worked vs. Output by Departments */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200">Hours worked vs. Output by Departments</CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Hours Worked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-400 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Output Score</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hoursVsOutputData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="hoursWorked" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="outputScore" fill="#06b6d4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - More Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Performance Rating by Department */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200">
              Average Performance Rating by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentRatingsData.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dept.department}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{dept.rating}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-6">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${(dept.rating / 5) * 100}%` }}
                    >
                      <span className="text-white text-xs font-bold">{dept.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Over Time */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200">Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis domain={[3.8, 4.8]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Employee Productivity Table */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-200">Productivity per Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Employee</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Average Employee Productivity
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">Goal Achieved</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Performance Over Time
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Outputs Over Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {employeeProductivityData.map((employee, index) => (
                  <tr key={index} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{employee.employee}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{employee.productivity}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          employee.goalAchieved === "YES"
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                        }
                      >
                        {employee.goalAchieved}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={employee.performanceTrend.map((value, i) => ({ value, index: i }))}>
                            <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={employee.outputTrend.map((value, i) => ({ value, index: i }))}>
                            <Bar dataKey="value" fill="#eab308" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Original Performance Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Gaps Radar Chart */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200">Skill Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillGaps}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Radar name="Required" dataKey="required" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance KPIs */}
        <div className="space-y-4">
          {performanceMetrics.map((metric, index) => (
            <Card
              key={index}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{metric.title}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{metric.value}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${
                      metric.color === "emerald"
                        ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                        : metric.color === "red"
                          ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                          : metric.color === "blue"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                            : "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300"
                    }`}
                  >
                    {metric.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const renderComingSoon = (title: string) => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-cyan-500 dark:to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">This section is under development</p>
      </div>
    </div>
  )

  return (
    <div className="p-6 relative">
      {activeSection === "dashboard" && renderDashboard()}
      {activeSection === "recruitment" && renderRecruitment()}
      {activeSection === "onboarding" && renderComingSoon("Onboarding")}
      {activeSection === "performance" && renderPerformance()}
      {activeSection === "learning" && renderLearning()}
      {activeSection === "engagement" && renderEngagement()}

      {/* HR Bot Chat Component */}
      <HRBotChat currentSection={activeSection} />
    </div>
  )
}
