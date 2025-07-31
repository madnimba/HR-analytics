"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Clock, Target, UserCheck, Star, Award, Heart, GraduationCap } from "lucide-react"
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

// Data generation utilities
const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Support', 'Operations']

// Seeded random function for consistent data generation
const seededRandom = (seed: string) => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  const x = Math.sin(Math.abs(hash)) * 10000
  return x - Math.floor(x)
}

const generateTimelineData = (months: number, baseValue: number, variance: number = 0.1, seed: string = '') => {
  const data = []
  const now = new Date()
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' })
    const randomFactor = 1 + (seededRandom(`${seed}-${i}`) - 0.5) * variance
    data.push({
      month: monthName,
      value: Math.round(baseValue * randomFactor)
    })
  }
  return data
}

const getDepartmentMultiplier = (department: string) => {
  const multipliers = {
    'Engineering': 1.2,
    'Sales': 1.1, 
    'Marketing': 0.9,
    'HR': 0.7,
    'Finance': 0.8,
    'Support': 0.8,
    'Operations': 0.9
  }
  return multipliers[department as keyof typeof multipliers] || 1.0
}

const getTimelineMultiplier = (timeline: string) => {
  const multipliers = {
    'Last 3 months': 0.8,
    'Last 6 months': 0.9,
    'Last year': 1.0
  }
  return multipliers[timeline as keyof typeof multipliers] || 1.0
}

const filterDataByDepartment = (data: any[], selectedDepartment: string) => {
  if (selectedDepartment === 'All Departments') return data
  return data.filter(item => item.department === selectedDepartment)
}

const generateDynamicData = (selectedDepartment: string, selectedTimeline: string) => {
  const timelineMonths = selectedTimeline === 'Last 3 months' ? 3 : 
                        selectedTimeline === 'Last 6 months' ? 6 : 12
  
  const deptMultiplier = getDepartmentMultiplier(selectedDepartment)
  const timeMultiplier = getTimelineMultiplier(selectedTimeline)
  const combinedMultiplier = deptMultiplier * timeMultiplier
  
  // Create consistent seed for deterministic random generation
  const seed = `${selectedDepartment}-${selectedTimeline}`

  return {
    // Company Stats
    companyStats: [
      { 
        label: "Total Employees", 
        value: selectedDepartment === 'All Departments' ? 
          "3,000" : Math.round(3000 * deptMultiplier / 6).toString(), 
        icon: Users, 
        color: "from-blue-500 to-blue-600" 
      },
      { 
        label: "Avg. Tenure", 
        value: `${(2.7 * combinedMultiplier).toFixed(1)} Years`, 
        icon: Clock, 
        color: "from-emerald-500 to-emerald-600" 
      },
      { 
        label: "HR Health Index", 
        value: `${Math.round(87 * combinedMultiplier)}%`, 
        icon: TrendingUp, 
        color: "from-violet-500 to-violet-600" 
      },
    ],

    // Monthly Growth Data
    monthlyGrowthData: generateTimelineData(timelineMonths, 45, 0.3, `${seed}-growth`).map((item, index) => ({
      month: item.month,
      hires: Math.round(item.value * combinedMultiplier),
      departures: Math.round((item.value * 0.7) * combinedMultiplier)
    })),

    // Cost Breakdown Data (quarterly)
    costBreakdownData: Array.from({length: Math.ceil(timelineMonths / 3)}, (_, i) => ({
      quarter: `Q${i + 1}`,
      training: (0.2 * combinedMultiplier).toFixed(2),
      payroll: (2.8 * combinedMultiplier).toFixed(1),
      benefits: (0.6 * combinedMultiplier).toFixed(2),
      overhead: (0.24 * combinedMultiplier).toFixed(2)
    })),

    // Satisfaction Data
    satisfactionData: filterDataByDepartment(departments.map((dept, index) => ({
      department: dept,
      score: (3.5 + seededRandom(`${seed}-satisfaction-${dept}`) * 1.0) * (dept === selectedDepartment ? 1.1 : 1.0)
    })), selectedDepartment),

    // Employee Timeline Data
    employeeTimelineData: generateTimelineData(timelineMonths, 2900, 0.05, `${seed}-timeline`).map(item => ({
      month: item.month,
      employees: selectedDepartment === 'All Departments' ? 
        item.value : Math.round(item.value * deptMultiplier / 6)
    })),

    // Engagement Trends Data
    engagementTrendsData: generateTimelineData(timelineMonths, 4.0, 0.15, `${seed}-engagement`).map(item => {
      const baseScore = item.value / 1000 // Convert to 0-5 scale
      return {
        month: item.month,
        ...(selectedDepartment === 'All Departments' ? 
          Object.fromEntries(departments.map(dept => [
            dept, (baseScore * getDepartmentMultiplier(dept) * 0.9).toFixed(1)
          ])) :
          { [selectedDepartment]: (baseScore * deptMultiplier).toFixed(1) }
        )
      }
    }),

    // NPS Data
    npsData: filterDataByDepartment(departments.map((dept, index) => ({
      department: dept,
      nps: Math.round((30 + seededRandom(`${seed}-nps-${dept}`) * 40) * (dept === selectedDepartment ? 1.1 : 1.0))
    })), selectedDepartment),

    // Heatmap Data
    heatmapData: filterDataByDepartment(departments.map((dept, index) => ({
      department: dept,
      managerRelation: ((3.5 + seededRandom(`${seed}-manager-${dept}`) * 1.5) * (dept === selectedDepartment ? 1.1 : 1.0)).toFixed(1),
      workLifeBalance: ((3.2 + seededRandom(`${seed}-balance-${dept}`) * 1.3) * (dept === selectedDepartment ? 1.1 : 1.0)).toFixed(1)
    })), selectedDepartment),

    // Recruitment Data
    hiringByDepartment: selectedDepartment === 'All Departments' ? [
      { name: "Engineering", value: Math.round(120 * timeMultiplier), color: "#3B82F6" },
      { name: "Sales", value: Math.round(85 * timeMultiplier), color: "#10B981" },
      { name: "Marketing", value: Math.round(65 * timeMultiplier), color: "#8B5CF6" },
      { name: "Operations", value: Math.round(45 * timeMultiplier), color: "#F59E0B" },
      { name: "Support", value: Math.round(35 * timeMultiplier), color: "#EF4444" },
      { name: "Finance", value: Math.round(25 * timeMultiplier), color: "#06B6D4" },
      { name: "HR", value: Math.round(15 * timeMultiplier), color: "#8B5CF6" },
    ] : [
      { name: selectedDepartment, value: Math.round(120 * combinedMultiplier), color: "#3B82F6" }
    ],

    dropoffByStage: [
      { stage: "Application", candidates: Math.round(2500 * combinedMultiplier) },
      { stage: "Screening", candidates: Math.round(1800 * combinedMultiplier) },
      { stage: "Interview", candidates: Math.round(1200 * combinedMultiplier) },
      { stage: "Final", candidates: Math.round(800 * combinedMultiplier) },
      { stage: "Offer", candidates: Math.round(500 * combinedMultiplier) },
      { stage: "Hired", candidates: Math.round(320 * combinedMultiplier) },
    ],

    // Performance Data
    skillGaps: [
      { skill: "Leadership", current: Math.round(65 * combinedMultiplier), required: 85 },
      { skill: "Technical", current: Math.round(80 * combinedMultiplier), required: 90 },
      { skill: "Communication", current: Math.round(70 * combinedMultiplier), required: 85 },
      { skill: "Problem Solving", current: Math.round(75 * combinedMultiplier), required: 88 },
      { skill: "Teamwork", current: Math.round(85 * combinedMultiplier), required: 90 },
      { skill: "Innovation", current: Math.round(60 * combinedMultiplier), required: 80 },
    ],

    performanceMetrics: [
      { title: "eNPS Score", value: `+${Math.round(42 * combinedMultiplier)}`, trend: "+5", color: "emerald" },
      { title: "Attrition Risk", value: `${Math.round(12 * (2 - combinedMultiplier))}%`, trend: "-3%", color: "red" },
      { title: "Performance Rating", value: `${(4.2 * combinedMultiplier).toFixed(1)}/5`, trend: "+0.3", color: "blue" },
      { title: "Goal Achievement", value: `${Math.round(89 * combinedMultiplier)}%`, trend: "+7%", color: "violet" },
    ],

    goalAchievementData: [
      { name: "Achieved", value: Math.round(75 * combinedMultiplier), color: "#8B5CF6" },
      { name: "In Progress", value: Math.round(20 * (2 - combinedMultiplier)), color: "#A78BFA" },
      { name: "Not Started", value: Math.round(5 * (2 - combinedMultiplier)), color: "#E0E7FF" },
    ],

    hoursVsOutputData: filterDataByDepartment(departments.map((dept, index) => ({
      department: dept,
      hoursWorked: Math.round((120 + seededRandom(`${seed}-hours-${dept}`) * 20) * (dept === selectedDepartment ? 1.1 : 1.0)),
      outputScore: Math.round((75 + seededRandom(`${seed}-output-${dept}`) * 20) * (dept === selectedDepartment ? 1.1 : 1.0))
    })), selectedDepartment),

    departmentRatingsData: filterDataByDepartment(departments.map((dept, index) => ({
      department: dept,
      rating: ((3.0 + seededRandom(`${seed}-rating-${dept}`) * 1.5) * (dept === selectedDepartment ? 1.1 : 1.0)).toFixed(2)
    })), selectedDepartment),

    performanceOverTimeData: generateTimelineData(timelineMonths, 4200, 0.1, `${seed}-performance`).map(item => ({
      month: item.month,
      rating: (item.value / 1000 * combinedMultiplier).toFixed(1)
    })),

    // Learning & Development Data
    learningMetrics: [
      {
        title: "Training Participation Rate",
        value: `${Math.round(76 * combinedMultiplier)}%`,
        change: "5.5%",
        previous: `${Math.round(72 * combinedMultiplier)}%`,
        trend: "up",
      },
      {
        title: "Training Hours per Employee",
        value: `${(14.2 * combinedMultiplier).toFixed(1)} hours`,
        change: "-6.0%",
        previous: `${(15.1 * combinedMultiplier).toFixed(1)} hours`,
        trend: "down",
      },
      {
        title: "Training Completion Rate",
        value: `${Math.round(85 * combinedMultiplier)}%`,
        change: "-2.3%",
        previous: `${Math.round(87 * combinedMultiplier)}%`,
        trend: "down",
      },
      {
        title: "Internal Promotion Rate",
        value: `${Math.round(18 * combinedMultiplier)}%`,
        change: "20%",
        previous: `${Math.round(15 * combinedMultiplier)}%`,
        trend: "up",
      },
    ],

    roiTrainingData: generateTimelineData(timelineMonths, 120, 0.2, `${seed}-roi`).map(item => ({
      month: item.month,
      roi: Math.round(item.value * combinedMultiplier)
    })),

    skillsImprovementData: filterDataByDepartment(departments.map((dept, index) => ({
      department: dept,
      preTraining: ((3.0 + seededRandom(`${seed}-pre-${dept}`) * 0.8) * (dept === selectedDepartment ? 1.1 : 1.0)).toFixed(1),
      postTraining: ((3.8 + seededRandom(`${seed}-post-${dept}`) * 0.7) * (dept === selectedDepartment ? 1.1 : 1.0)).toFixed(1)
    })), selectedDepartment),

    allTrainingsData: [
      { training: "Onboarding", attendees: Math.round(1056 * combinedMultiplier) },
      { training: "Soft Skills", attendees: Math.round(924 * combinedMultiplier) },
      { training: "Security", attendees: Math.round(448 * combinedMultiplier) },
      { training: "Technical", attendees: Math.round(387 * combinedMultiplier) },
      { training: "Sales", attendees: Math.round(345 * combinedMultiplier) },
      { training: "Product", attendees: Math.round(298 * combinedMultiplier) },
      { training: "Communication", attendees: Math.round(287 * combinedMultiplier) },
      { training: "Industry", attendees: Math.round(94 * combinedMultiplier) },
      { training: "Reskilling", attendees: Math.round(84 * combinedMultiplier) },
    ],

    incompleteTrainingsData: [
      { training: "Onboarding", employees: Math.round(34 * combinedMultiplier), deadline: "5/20/2025", status: "See more information" },
      { training: "Soft Skills", employees: Math.round(28 * combinedMultiplier), deadline: "4/23/2025", status: "See more information" },
      { training: "Security", employees: Math.round(20 * combinedMultiplier), deadline: "7/13/2025", status: "See more information" },
      { training: "Technical", employees: Math.round(173 * combinedMultiplier), deadline: "8/30/2025", status: "See more information" },
      { training: "Sales", employees: Math.round(38 * combinedMultiplier), deadline: "4/30/2025", status: "See more information" },
      { training: "Product", employees: Math.round(40 * combinedMultiplier), deadline: "6/7/2025", status: "See more information" },
      { training: "Communication", employees: Math.round(231 * combinedMultiplier), deadline: "4/25/2025", status: "See more information" },
      { training: "Industry", employees: Math.round(425 * combinedMultiplier), deadline: "9/1/2025", status: "See more information" },
      { training: "Reskilling", employees: Math.round(287 * combinedMultiplier), deadline: "10/1/2025", status: "See more information" },
    ],

    // Employee productivity data (sample subset based on filters)
    employeeProductivityData: Array.from({length: Math.min(7, Math.ceil(7 * combinedMultiplier))}, (_, i) => ({
      employee: `Employee ${i + 1}`,
      productivity: `$${(10000 + seededRandom(`${seed}-prod-${i}`) * 8000).toLocaleString()}`,
      goalAchieved: seededRandom(`${seed}-goal-${i}`) > 0.4 ? "YES" : "NO",
      performanceTrend: Array.from({length: 7}, (_, j) => (3.0 + seededRandom(`${seed}-trend-${i}-${j}`) * 2.0).toFixed(1)),
      outputTrend: Array.from({length: 7}, (_, j) => Math.round(60 + seededRandom(`${seed}-output-${i}-${j}`) * 40)),
    })),


  }
}





// Generate base onboarding data once (independent of filters)
const generateBaseOnboardingData = () => {
  const seed = 'onboarding-base'
  
  // Base data for 1 year
  const baseData = {
    // Core metrics for full year
    totalNewHires: {
      year: 45,
      sixMonths: 28,
      threeMonths: 15
    },
    
    // Department distribution (should add up to totals)
    departmentData: departments.map((dept, index) => {
      const multiplier = getDepartmentMultiplier(dept)
      return {
        department: dept,
        yearlyHires: Math.round(45 * multiplier / 6),
        sixMonthHires: Math.round(28 * multiplier / 6),
        threeMonthHires: Math.round(15 * multiplier / 6),
        completionRate: 85 + seededRandom(`${seed}-completion-${dept}`) * 15,
        avgDuration: 16 + seededRandom(`${seed}-duration-${dept}`) * 8,
        satisfactionScore: 4.2 + seededRandom(`${seed}-satisfaction-${dept}`) * 0.6,
        costPerHire: 2800 + seededRandom(`${seed}-cost-${dept}`) * 800,
      }
    }),
    
    // Pipeline stages (percentages of total new hires)
    pipelineStages: [
      { stage: "Background Check", percentage: 18, avgDays: 3 },
      { stage: "Paperwork", percentage: 27, avgDays: 2 },
      { stage: "IT Setup", percentage: 22, avgDays: 1 },
      { stage: "Training", percentage: 33, avgDays: 8 },
      { stage: "Team Integration", percentage: 11, avgDays: 4 },
      { stage: "Complete", percentage: 56, avgDays: 18 },
    ],
    
    // Checklist completion (static percentages)
    checklistData: [
      { category: "Legal Documents", percentage: 92, color: "#3B82F6" },
      { category: "IT Setup", percentage: 88, color: "#10B981" },
      { category: "Training Modules", percentage: 85, color: "#8B5CF6" },
      { category: "Team Introductions", percentage: 94, color: "#F59E0B" },
      { category: "Equipment Setup", percentage: 90, color: "#EF4444" },
    ],
    
    // Timeline data for trends (12 months of data)
    monthlyData: generateTimelineData(12, 45, 0.25, `${seed}-monthly`).map((item, index) => ({
      month: item.month,
      newHires: Math.round(item.value),
      completions: Math.round(item.value * 0.75),
      dropoffs: Math.round(item.value * 0.12),
      npsScore: Math.round((3.5 + seededRandom(`${seed}-nps-${index}`) * 1.5) * 10),
      trainingRating: (3.5 + seededRandom(`${seed}-training-${index}`) * 1.5).toFixed(1),
      managerSupport: (3.2 + seededRandom(`${seed}-manager-${index}`) * 1.3).toFixed(1),
      totalCost: Math.round(2800 + seededRandom(`${seed}-cost-${index}`) * 800),
      trainingCost: Math.round((2800 + seededRandom(`${seed}-cost-${index}`) * 800) * 0.4),
      equipmentCost: Math.round((2800 + seededRandom(`${seed}-cost-${index}`) * 800) * 0.3),
      administrativeCost: Math.round((2800 + seededRandom(`${seed}-cost-${index}`) * 800) * 0.2),
      otherCost: Math.round((2800 + seededRandom(`${seed}-cost-${index}`) * 800) * 0.1),
    })),
    
    // Core metrics
    avgCompletionTime: 18,
    successRate: 94,
    costPerOnboarding: 3200,
    timeToProductivity: 18,
    retentionRate: 96,
    npsScore: 42,
    goalAchievementRate: 89,
  }
  
  return baseData
}

// Filter the base data based on current selections
const getFilteredOnboardingData = (baseData: any, selectedDepartment: string, selectedTimeline: string) => {
  const timelineMap = {
    'Last 3 months': 'threeMonths',
    'Last 6 months': 'sixMonths', 
    'Last year': 'year'
  }
  
  const timelineKey = timelineMap[selectedTimeline as keyof typeof timelineMap] || 'year'
  const timelineMonths = selectedTimeline === 'Last 3 months' ? 3 : 
                        selectedTimeline === 'Last 6 months' ? 6 : 12
  
  // Get department data first
  const departmentHires = selectedDepartment === 'All Departments' ? 
    baseData.departmentData.map((dept: any) => ({
      department: dept.department,
      newHires: timelineKey === 'threeMonths' ? dept.threeMonthHires :
               timelineKey === 'sixMonths' ? dept.sixMonthHires :
               dept.yearlyHires,
      completionRate: dept.completionRate,
      avgDuration: dept.avgDuration,
      satisfactionScore: dept.satisfactionScore,
      costPerHire: dept.costPerHire,
    })) :
    baseData.departmentData.filter((dept: any) => dept.department === selectedDepartment)
      .map((dept: any) => ({
        department: dept.department,
        newHires: timelineKey === 'threeMonths' ? dept.threeMonthHires :
                 timelineKey === 'sixMonths' ? dept.sixMonthHires :
                 dept.yearlyHires,
        completionRate: dept.completionRate,
        avgDuration: dept.avgDuration,
        satisfactionScore: dept.satisfactionScore,
        costPerHire: dept.costPerHire,
      }))
  
  // Calculate current total hires based on filtered departments
  const currentTotalHires = selectedDepartment === 'All Departments' ? 
    (timelineKey === 'threeMonths' ? baseData.totalNewHires.threeMonths :
     timelineKey === 'sixMonths' ? baseData.totalNewHires.sixMonths :
     baseData.totalNewHires.year) :
    departmentHires.reduce((sum: number, dept: any) => sum + dept.newHires, 0)
  
  // Get timeline data (slice based on months) and filter by department if needed
  const baseTimelineData = baseData.monthlyData.slice(-timelineMonths)
  const timelineData = selectedDepartment === 'All Departments' ? 
    baseTimelineData :
    baseTimelineData.map((item: any) => {
      // For specific department, scale down the data proportionally
      const deptMultiplier = getDepartmentMultiplier(selectedDepartment) / 6 // Divide by number of departments
      return {
        ...item,
        newHires: Math.round(item.newHires * deptMultiplier),
        completions: Math.round(item.completions * deptMultiplier),
        dropoffs: Math.round(item.dropoffs * deptMultiplier),
        npsScore: item.npsScore, // Keep satisfaction metrics same
        trainingRating: item.trainingRating,
        managerSupport: item.managerSupport,
        totalCost: Math.round(item.totalCost * deptMultiplier),
        trainingCost: Math.round(item.trainingCost * deptMultiplier),
        equipmentCost: Math.round(item.equipmentCost * deptMultiplier),
        administrativeCost: Math.round(item.administrativeCost * deptMultiplier),
        otherCost: Math.round(item.otherCost * deptMultiplier),
      }
    })
  
  // Calculate dynamic metrics based on filters
  const getTimelineAdjustment = (baseValue: number) => {
    // Adjust metrics based on timeline - shorter periods might have different performance
    const timelineAdjustment = selectedTimeline === 'Last 3 months' ? 0.95 : // Slightly better in recent months
                              selectedTimeline === 'Last 6 months' ? 0.98 : // Slightly better
                              1.0 // Full year baseline
    return Math.round(baseValue * timelineAdjustment)
  }

  const dynamicMetrics = {
    avgCompletionTime: selectedDepartment === 'All Departments' ? 
      getTimelineAdjustment(baseData.avgCompletionTime) :
      departmentHires.length > 0 ? 
        getTimelineAdjustment(Math.round(departmentHires[0].avgDuration)) : 
        getTimelineAdjustment(baseData.avgCompletionTime),
    
    successRate: selectedDepartment === 'All Departments' ? 
      getTimelineAdjustment(baseData.successRate) :
      departmentHires.length > 0 ? 
        getTimelineAdjustment(Math.round(departmentHires[0].completionRate)) : 
        getTimelineAdjustment(baseData.successRate),
    
    costPerOnboarding: selectedDepartment === 'All Departments' ? 
      getTimelineAdjustment(baseData.costPerOnboarding) :
      departmentHires.length > 0 ? 
        getTimelineAdjustment(Math.round(departmentHires[0].costPerHire)) : 
        getTimelineAdjustment(baseData.costPerOnboarding),
  }

  return {
    currentTotalHires,
    departmentHires,
    timelineData,
    timelineMonths,
    dynamicMetrics
  }
}

// Generate dynamic performance metrics based on filters
const getDynamicPerformanceMetrics = (selectedDepartment: string, selectedTimeline: string) => {
  const seed = 'performance-metrics'
  
  // Base performance metrics
  const baseMetrics = {
    avgPerformance: 4.1,
    productivityPerEmployee: 12750,
    highPerformingRatio: 28
  }
  
  // Department-specific adjustments
  const getDepartmentPerformance = (dept: string) => {
    const deptMultiplier = getDepartmentMultiplier(dept)
    return {
      avgPerformance: (4.0 + seededRandom(`${seed}-perf-${dept}`) * 0.4) * (deptMultiplier / 6),
      productivityPerEmployee: (12000 + seededRandom(`${seed}-prod-${dept}`) * 2000) * (deptMultiplier / 6),
      highPerformingRatio: (25 + seededRandom(`${seed}-high-${dept}`) * 10) * (deptMultiplier / 6)
    }
  }
  
  // Timeline adjustments
  const getTimelineAdjustment = (baseValue: number) => {
    const timelineAdjustment = selectedTimeline === 'Last 3 months' ? 1.05 : // Slightly better in recent months
                              selectedTimeline === 'Last 6 months' ? 1.02 : // Slightly better
                              1.0 // Full year baseline
    return Math.round(baseValue * timelineAdjustment * 100) / 100
  }
  
  if (selectedDepartment === 'All Departments') {
    return {
      avgPerformance: getTimelineAdjustment(baseMetrics.avgPerformance),
      productivityPerEmployee: Math.round(getTimelineAdjustment(baseMetrics.productivityPerEmployee)),
      highPerformingRatio: Math.round(getTimelineAdjustment(baseMetrics.highPerformingRatio))
    }
  } else {
    const deptMetrics = getDepartmentPerformance(selectedDepartment)
    return {
      avgPerformance: getTimelineAdjustment(deptMetrics.avgPerformance),
      productivityPerEmployee: Math.round(getTimelineAdjustment(deptMetrics.productivityPerEmployee)),
      highPerformingRatio: Math.round(getTimelineAdjustment(deptMetrics.highPerformingRatio))
    }
  }
}

// Update the main return statement to use renderLearning instead of renderComingSoon
export function DashboardContent({ activeSection }: DashboardContentProps) {
  // State management for filters
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [selectedTimeline, setSelectedTimeline] = useState('Last year')

  // Generate base data once (never changes)
  const baseOnboardingData = useMemo(() => generateBaseOnboardingData(), [])

  // Generate dynamic data based on current filters
  const dynamicData = useMemo(() => 
    generateDynamicData(selectedDepartment, selectedTimeline), 
    [selectedDepartment, selectedTimeline]
  )
  
  // Get filtered onboarding data
  const filteredOnboardingData = useMemo(() => 
    getFilteredOnboardingData(baseOnboardingData, selectedDepartment, selectedTimeline),
    [baseOnboardingData, selectedDepartment, selectedTimeline]
  )

  const renderLearning = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Learning & Development Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track training programs and employee skill development
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <select 
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200"
            value={selectedTimeline}
            onChange={(e) => setSelectedTimeline(e.target.value)}
          >
            <option>Last year</option>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>

      {/* Key Learning Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicData.learningMetrics.map((metric: any, index: number) => (
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
              <BarChart data={dynamicData.roiTrainingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
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

        {/* Training Completion by Department */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200">Training Completion by Department</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Completion rates and training hours by department</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={(() => {
                const baseData = [
                  { department: "Engineering", completionRate: 92, avgHours: 18, participants: 85 },
                  { department: "Sales", completionRate: 88, avgHours: 15, participants: 65 },
                  { department: "Marketing", completionRate: 95, avgHours: 12, participants: 45 },
                  { department: "Operations", completionRate: 90, avgHours: 14, participants: 55 },
                  { department: "Support", completionRate: 87, avgHours: 16, participants: 35 },
                  { department: "Finance", completionRate: 93, avgHours: 13, participants: 25 },
                  { department: "HR", completionRate: 89, avgHours: 11, participants: 15 },
                ]
                
                const timelineMultiplier = getTimelineMultiplier(selectedTimeline)
                const deptMultiplier = getDepartmentMultiplier(selectedDepartment)
                
                return baseData.map(item => ({
                  ...item,
                  completionRate: Math.round(item.completionRate * timelineMultiplier),
                  avgHours: Math.round(item.avgHours * timelineMultiplier),
                  participants: Math.round(item.participants * deptMultiplier * timelineMultiplier / 6)
                }))
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="completionRate" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Completion Rate %" />
                <Bar dataKey="avgHours" fill="#10b981" radius={[2, 2, 0, 0]} name="Avg Hours" />
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
        {/* Learning Impact Assessment */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200">Learning Impact Assessment</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Training impact on performance and productivity</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((85 + seededRandom('performance-improvement') * 10) * getTimelineMultiplier(selectedTimeline) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Performance Improvement</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round((78 + seededRandom('productivity-gain') * 12) * getTimelineMultiplier(selectedTimeline) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Productivity Gain</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((92 + seededRandom('skill-retention') * 6) * getTimelineMultiplier(selectedTimeline) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Skill Retention</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round((320 + seededRandom('roi-percentage') * 80) * getTimelineMultiplier(selectedTimeline) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Training ROI</div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={(() => {
                const timelineData = generateTimelineData(12, 85, 0.15, 'learning-impact')
                const timelineMultiplier = getTimelineMultiplier(selectedTimeline)
                const deptMultiplier = getDepartmentMultiplier(selectedDepartment)
                
                return timelineData.map((item, index) => ({
                  month: item.month,
                  performance: Math.round(item.value * timelineMultiplier * deptMultiplier / 6),
                  productivity: Math.round((item.value * 0.9) * timelineMultiplier * deptMultiplier / 6),
                  satisfaction: Math.round((item.value * 0.95) * timelineMultiplier * deptMultiplier / 6)
                }))
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line type="monotone" dataKey="performance" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }} name="Performance" />
                <Line type="monotone" dataKey="productivity" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }} name="Productivity" />
                <Line type="monotone" dataKey="satisfaction" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }} name="Satisfaction" />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
              {selectedDepartment === 'All Departments' ? 
                `Showing learning impact across all departments for ${selectedTimeline}` :
                `Showing learning impact for ${selectedDepartment} department for ${selectedTimeline}`
              }
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
                  {dynamicData.incompleteTrainingsData.map((training: any, index: number) => (
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

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Reporting Dashboard
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <select 
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200"
            value={selectedTimeline}
            onChange={(e) => setSelectedTimeline(e.target.value)}
          >
            <option>Last year</option>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
          </select>
          <select 
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Support</option>
            <option>Operations</option>
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
            <div className="text-4xl font-bold mb-2">{dynamicData.companyStats[0].value}</div>
            <div className="flex items-center text-sm text-blue-200">
              <span>{selectedDepartment === 'All Departments' ? '2,890' : Math.round(2890 * getDepartmentMultiplier(selectedDepartment) / 6).toString()}</span>
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
            <div className="text-4xl font-bold mb-2">{Math.round(29 * (2 - getTimelineMultiplier(selectedTimeline)))} days</div>
            <div className="flex items-center text-sm text-indigo-200">
              <span>{Math.round(31 * (2 - getTimelineMultiplier(selectedTimeline)))} days</span>
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
            <div className="text-4xl font-bold mb-2">{(13.8 * (2 - getDepartmentMultiplier(selectedDepartment) * getTimelineMultiplier(selectedTimeline))).toFixed(1)}%</div>
            <div className="flex items-center text-sm text-purple-200">
              <span>{(14.1 * (2 - getDepartmentMultiplier(selectedDepartment) * getTimelineMultiplier(selectedTimeline))).toFixed(1)}%</span>
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
            <div className="text-4xl font-bold mb-2">${((3.84 * getDepartmentMultiplier(selectedDepartment) * getTimelineMultiplier(selectedTimeline))).toFixed(2)}M</div>
            <div className="flex items-center text-sm text-violet-200">
              <span>${((3.75 * getDepartmentMultiplier(selectedDepartment) * getTimelineMultiplier(selectedTimeline))).toFixed(2)}M</span>
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
              <BarChart data={dynamicData.monthlyGrowthData}>
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
              <BarChart data={dynamicData.costBreakdownData}>
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
              {dynamicData.satisfactionData.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dept.department}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{dept.score.toFixed(1)}</span>
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
              <LineChart data={dynamicData.employeeTimelineData}>
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

      {/* Additional Analysis Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Productivity Trends */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              Employee Productivity Trends
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Productivity metrics over time by department</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateTimelineData(12, 92, 0.2, 'productivity').map(item => ({
                month: item.month,
                productivity: Math.round(item.value * getDepartmentMultiplier(selectedDepartment) / 6),
                target: 85,
                efficiency: Math.round((item.value * 0.95) * getDepartmentMultiplier(selectedDepartment) / 6)
              }))}>
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
                <Line type="monotone" dataKey="productivity" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }} name="Productivity %" />
                <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }} name="Efficiency %" />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Performance Comparison */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Department Performance Comparison
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Key performance indicators across departments</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departments.map(dept => ({
                department: dept,
                performance: Math.round((82 + seededRandom(`perf-${dept}`) * 25) * getDepartmentMultiplier(dept) / 6),
                satisfaction: Math.round((88 + seededRandom(`sat-${dept}`) * 20) * getDepartmentMultiplier(dept) / 6),
                retention: Math.round((92 + seededRandom(`ret-${dept}`) * 15) * getDepartmentMultiplier(dept) / 6)
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="performance" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Performance %" />
                <Bar dataKey="satisfaction" fill="#10b981" radius={[2, 2, 0, 0]} name="Satisfaction %" />
                <Bar dataKey="retention" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Retention %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Additional Analysis Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Development Metrics */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Employee Development Metrics
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Training and development progress tracking</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((78 + seededRandom('training-completion') * 15) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Training Completion</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round((65 + seededRandom('skill-improvement') * 20) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Skill Improvement</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((22 + seededRandom('promotion-rate') * 8) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Promotion Rate</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round((85 + seededRandom('certification') * 10) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Certification Rate</div>
              </div>
            </div>
            
            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              {selectedDepartment === 'All Departments' ? 
                `Showing development metrics across all departments for ${selectedTimeline}` :
                `Showing development metrics for ${selectedDepartment} department for ${selectedTimeline}`
              }
            </div>
          </CardContent>
        </Card>

        {/* Workforce Analytics */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Workforce Analytics
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Comprehensive workforce insights and trends</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Full-time", value: Math.round(78 * getDepartmentMultiplier(selectedDepartment) / 6), color: "#3b82f6" },
                    { name: "Part-time", value: Math.round(12 * getDepartmentMultiplier(selectedDepartment) / 6), color: "#10b981" },
                    { name: "Contract", value: Math.round(8 * getDepartmentMultiplier(selectedDepartment) / 6), color: "#8b5cf6" },
                    { name: "Intern", value: Math.round(2 * getDepartmentMultiplier(selectedDepartment) / 6), color: "#f59e0b" },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {[
                    { name: "Full-time", value: Math.round(78 * getDepartmentMultiplier(selectedDepartment) / 6), color: "#3b82f6" },
                    { name: "Part-time", value: Math.round(12 * getDepartmentMultiplier(selectedDepartment) / 6), color: "#10b981" },
                    { name: "Contract", value: Math.round(8 * getDepartmentMultiplier(selectedDepartment) / 6), color: "#8b5cf6" },
                    { name: "Intern", value: Math.round(2 * getDepartmentMultiplier(selectedDepartment) / 6), color: "#f59e0b" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
              {selectedDepartment === 'All Departments' ? 
                `Showing workforce distribution across all departments for ${selectedTimeline}` :
                `Showing workforce distribution for ${selectedDepartment} department for ${selectedTimeline}`
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderEngagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Employee Engagement Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitor employee satisfaction and engagement metrics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <select 
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200"
            value={selectedTimeline}
            onChange={(e) => setSelectedTimeline(e.target.value)}
          >
            <option>Last year</option>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
          </select>
          <select 
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Support</option>
            <option>Operations</option>
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
              <LineChart data={(() => {
                const timelineData = generateTimelineData(12, 4.2, 0.15, 'engagement-trends')
                const timelineMultiplier = getTimelineMultiplier(selectedTimeline)
                const deptMultiplier = getDepartmentMultiplier(selectedDepartment)
                
                return timelineData.map((item, index) => {
                  const baseEngagement = item.value
                  const timelineAdjustment = timelineMultiplier
                  const deptAdjustment = selectedDepartment === 'All Departments' ? 1 : deptMultiplier / 6
                  
                  return {
                    month: item.month,
                    Support: Math.round((baseEngagement * 0.95 + seededRandom('support-engagement') * 0.2) * timelineAdjustment * 100) / 100,
                    Finance: Math.round((baseEngagement * 1.05 + seededRandom('finance-engagement') * 0.2) * timelineAdjustment * 100) / 100,
                    HR: Math.round((baseEngagement * 1.02 + seededRandom('hr-engagement') * 0.2) * timelineAdjustment * 100) / 100,
                    Marketing: Math.round((baseEngagement * 0.98 + seededRandom('marketing-engagement') * 0.2) * timelineAdjustment * 100) / 100,
                    Engineering: Math.round((baseEngagement * 1.08 + seededRandom('engineering-engagement') * 0.2) * timelineAdjustment * 100) / 100,
                    Sales: Math.round((baseEngagement * 0.92 + seededRandom('sales-engagement') * 0.2) * timelineAdjustment * 100) / 100,
                    Operations: Math.round((baseEngagement * 1.01 + seededRandom('operations-engagement') * 0.2) * timelineAdjustment * 100) / 100,
                  }
                })
              })()}>
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
                {selectedDepartment === 'All Departments' ? (
                  <>
                    <Line type="monotone" dataKey="Support" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Finance" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="HR" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Marketing" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Engineering" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Sales" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Operations" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  </>
                ) : (
                  <Line type="monotone" dataKey={selectedDepartment} stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                )}
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
              {dynamicData.heatmapData.map((dept, index) => (
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

      {/* Employee Satisfaction & NPS Dashboard */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 dark:text-cyan-400" />
            Employee Satisfaction & NPS Dashboard
          </CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">Comprehensive employee advocacy and satisfaction metrics</p>
        </CardHeader>
        <CardContent>
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round((68 + seededRandom('company-nps') * 8) * getTimelineMultiplier(selectedTimeline))}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Company NPS</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round((82 + seededRandom('promoter-pct') * 6) * getTimelineMultiplier(selectedTimeline))}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Promoters</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {Math.round((14 + seededRandom('passive-pct') * 4) * getTimelineMultiplier(selectedTimeline))}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Passives</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {Math.round((4 + seededRandom('detractor-pct') * 3) * getTimelineMultiplier(selectedTimeline))}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Detractors</div>
            </div>
          </div>

          {/* Department NPS Chart */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">NPS by Department</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { department: "Engineering", nps: 72, satisfaction: 4.3, retention: 94, color: "#3b82f6" },
                { department: "Sales", nps: 65, satisfaction: 3.9, retention: 88, color: "#ef4444" },
                { department: "Marketing", nps: 78, satisfaction: 4.6, retention: 96, color: "#10b981" },
                { department: "Operations", nps: 68, satisfaction: 4.1, retention: 91, color: "#f59e0b" },
                { department: "Support", nps: 62, satisfaction: 3.8, retention: 86, color: "#8b5cf6" },
                { department: "Finance", nps: 75, satisfaction: 4.4, retention: 95, color: "#06b6d4" },
                { department: "HR", nps: 80, satisfaction: 4.7, retention: 97, color: "#ec4899" },
              ].map(item => ({
                ...item,
                nps: Math.round(item.nps * getTimelineMultiplier(selectedTimeline)),
                satisfaction: Math.round(item.satisfaction * getTimelineMultiplier(selectedTimeline) * 100) / 100,
                retention: Math.round(item.retention * getTimelineMultiplier(selectedTimeline))
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="nps" fill="#06b6d4" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Satisfaction Trends */}
          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Satisfaction Trends</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={generateTimelineData(12, 4.2, 0.15, 'satisfaction-trends').map((item, index) => ({
                month: item.month,
                satisfaction: Math.round((item.value * getTimelineMultiplier(selectedTimeline)) * 100) / 100,
                engagement: Math.round(((item.value * 0.95) * getTimelineMultiplier(selectedTimeline)) * 100) / 100,
                retention: Math.round(((item.value * 0.98) * getTimelineMultiplier(selectedTimeline)) * 100) / 100
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis domain={[3, 5]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line type="monotone" dataKey="satisfaction" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }} name="Satisfaction" />
                <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }} name="Engagement" />
                <Line type="monotone" dataKey="retention" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }} name="Retention" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Filter Status */}
          <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            {selectedDepartment === 'All Departments' ? 
              `Showing company-wide satisfaction data for ${selectedTimeline}` :
              `Showing satisfaction data for ${selectedDepartment} department for ${selectedTimeline}`
            }
          </div>
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
                  data={dynamicData.hiringByDepartment}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {dynamicData.hiringByDepartment.map((entry, index) => (
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
              <BarChart data={dynamicData.dropoffByStage}>
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
    

      {/* Additional Recruitment Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruitment Channel Effectiveness */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              Recruitment Channel Effectiveness
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hiring success rate by recruitment source</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { channel: "LinkedIn", hires: Math.round(85 * getDepartmentMultiplier(selectedDepartment) / 6), successRate: 85 },
                { channel: "Referrals", hires: Math.round(65 * getDepartmentMultiplier(selectedDepartment) / 6), successRate: 92 },
                { channel: "Job Boards", hires: Math.round(45 * getDepartmentMultiplier(selectedDepartment) / 6), successRate: 78 },
                { channel: "Campus", hires: Math.round(35 * getDepartmentMultiplier(selectedDepartment) / 6), successRate: 88 },
                { channel: "Agencies", hires: Math.round(25 * getDepartmentMultiplier(selectedDepartment) / 6), successRate: 82 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="hires" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Hires" />
                <Bar dataKey="successRate" fill="#10b981" radius={[2, 2, 0, 0]} name="Success Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time-to-Fill Trends */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Time-to-Fill Trends
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Average days to fill positions over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateTimelineData(12, 25, 0.3, 'time-to-fill').map((item, index) => ({
                month: item.month,
                days: Math.round(item.value * getDepartmentMultiplier(selectedDepartment) / 6),
                target: 20,
                industry: Math.round(28 + seededRandom(`industry-${index}`) * 8),
                benchmark: 22
              }))}>
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
                <Line type="monotone" dataKey="days" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }} name="Our Time-to-Fill" />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                <Line type="monotone" dataKey="industry" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" name="Industry Average" />
                <Line type="monotone" dataKey="benchmark" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="1 1" name="Best Practice" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Additional Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruitment Funnel Analysis */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Recruitment Funnel Analysis
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Conversion rates through recruitment stages</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { stage: "Applications", candidates: 2500, conversions: 85, rate: 3.4 },
                { stage: "Screening", candidates: 850, conversions: 680, rate: 80.0 },
                { stage: "Interview", candidates: 680, conversions: 408, rate: 60.0 },
                { stage: "Final Round", candidates: 408, conversions: 245, rate: 60.0 },
                { stage: "Offer", candidates: 245, conversions: 196, rate: 80.0 },
                { stage: "Hired", candidates: 196, conversions: 196, rate: 100.0 },
              ].map(item => ({
                ...item,
                candidates: Math.round(item.candidates * getDepartmentMultiplier(selectedDepartment) / 6),
                conversions: Math.round(item.conversions * getDepartmentMultiplier(selectedDepartment) / 6)
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="stage" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="candidates" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Candidates" />
                <Bar dataKey="conversions" fill="#10b981" radius={[2, 2, 0, 0]} name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((3.4 + seededRandom('application-rate') * 2) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Application Rate</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {Math.round((60 + seededRandom('interview-rate') * 15) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Interview Success</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((80 + seededRandom('offer-rate') * 10) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Offer Acceptance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidate Quality Metrics */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Candidate Quality Metrics
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Quality assessment of hired candidates</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((92 + seededRandom('quality-score') * 6) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Quality Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round((96 + seededRandom('retention-rate') * 3) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">6-Month Retention</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((88 + seededRandom('performance-rating') * 10) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Performance Rating</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {Math.round((94 + seededRandom('satisfaction') * 4) * getDepartmentMultiplier(selectedDepartment) / 6)}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Manager Satisfaction</div>
              </div>
            </div>
            
            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              {selectedDepartment === 'All Departments' ? 
                `Showing quality metrics across all departments for ${selectedTimeline}` :
                `Showing quality metrics for ${selectedDepartment} department for ${selectedTimeline}`
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Employee Performance Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Monitor employee performance and skill development</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <select 
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200"
            value={selectedTimeline}
            onChange={(e) => setSelectedTimeline(e.target.value)}
          >
            <option>Last year</option>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
          </select>
          <select 
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Support</option>
            <option>Operations</option>
          </select>
        </div>
      </div>

      {/* Top Row - Key Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(() => {
          const performanceMetrics = getDynamicPerformanceMetrics(selectedDepartment, selectedTimeline)
          const previousMetrics = {
            avgPerformance: Math.round((performanceMetrics.avgPerformance * 0.975) * 100) / 100,
            productivityPerEmployee: Math.round(performanceMetrics.productivityPerEmployee * 0.972),
            highPerformingRatio: Math.round(performanceMetrics.highPerformingRatio * 0.88)
          }
          
          return [
            {
              title: "Average Performance by Department",
              value: performanceMetrics.avgPerformance.toFixed(1),
              change: "+2.5%",
              previous: previousMetrics.avgPerformance.toFixed(1),
              trend: "up",
            },
            {
              title: "Productivity per Employee",
              value: `$${performanceMetrics.productivityPerEmployee.toLocaleString()}`,
              change: "+2.8%",
              previous: `$${previousMetrics.productivityPerEmployee.toLocaleString()}`,
              trend: "up",
            },
            {
              title: "High-performing Employee Ratio",
              value: `${performanceMetrics.highPerformingRatio}%`,
              change: "+12%",
              previous: `${previousMetrics.highPerformingRatio}%`,
              trend: "up",
            },
          ].map((metric: any, index: number) => (
            <Card
              key={index}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl"
            >
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">{metric.title}</h3>
                <div className="text-5xl font-bold text-slate-800 dark:text-slate-200 mb-2">{metric.value}</div>
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
          ))
        })()}
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
                  data={dynamicData.goalAchievementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {dynamicData.goalAchievementData.map((entry, index) => (
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
              <BarChart data={dynamicData.hoursVsOutputData}>
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
              {dynamicData.departmentRatingsData.map((dept, index) => (
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
              <LineChart data={dynamicData.performanceOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
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
                {dynamicData.employeeProductivityData.map((employee, index) => (
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
              <RadarChart data={dynamicData.skillGaps}>
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
          {dynamicData.performanceMetrics.map((metric, index) => (
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

  const renderOnboarding = () => {
    const onboardingData = filteredOnboardingData
    const baseData = baseOnboardingData

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              Onboarding Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Track new hire progress and onboarding effectiveness
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select 
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200"
              value={selectedTimeline}
              onChange={(e) => setSelectedTimeline(e.target.value)}
            >
              <option>Last year</option>
              <option>Last 6 months</option>
              <option>Last 3 months</option>
            </select>
            <select 
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm dark:text-slate-200"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Sales</option>
              <option>Marketing</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Support</option>
              <option>Operations</option>
            </select>
          </div>
        </div>

      {/* Key Onboarding Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "New Hires in Onboarding",
            value: onboardingData.currentTotalHires.toString(),
            change: "+12%",
            previous: Math.round(onboardingData.currentTotalHires * 0.89).toString(),
            trend: "up",
          },
          {
            title: "Average Completion Time",
            value: `${onboardingData.dynamicMetrics.avgCompletionTime} days`,
            change: "-8%",
            previous: `${Math.round(onboardingData.dynamicMetrics.avgCompletionTime * 1.08)} days`,
            trend: "down",
          },
          {
            title: "Onboarding Success Rate",
            value: `${onboardingData.dynamicMetrics.successRate}%`,
            change: "+3%",
            previous: `${Math.round(onboardingData.dynamicMetrics.successRate * 0.97)}%`,
            trend: "up",
          },
          {
            title: "Cost per Onboarding",
            value: `$${onboardingData.dynamicMetrics.costPerOnboarding.toLocaleString()}`,
            change: "-5%",
            previous: `$${Math.round(onboardingData.dynamicMetrics.costPerOnboarding * 1.05).toLocaleString()}`,
            trend: "down",
          },
        ].map((metric: any, index: number) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding Pipeline Status */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              Onboarding Pipeline Status
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Current employees at each onboarding stage</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={baseData.pipelineStages.map(stage => ({
                stage: stage.stage,
                employees: Math.round((onboardingData.currentTotalHires * stage.percentage / 100)),
                avgDays: stage.avgDays
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="stage" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="employees" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="text-center">
                <div className="font-bold text-slate-800 dark:text-slate-200">Avg. Days per Stage</div>
                <div className="text-slate-600 dark:text-slate-400">{(baseData.pipelineStages.reduce((sum, stage) => sum + stage.avgDays, 0) / baseData.pipelineStages.length).toFixed(1)} days</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-800 dark:text-slate-200">Total in Pipeline</div>
                <div className="text-slate-600 dark:text-slate-400">{baseData.pipelineStages.reduce((sum, stage) => sum + Math.round((onboardingData.currentTotalHires * stage.percentage / 100)), 0)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Performance Metrics */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              Onboarding Performance Metrics
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Key performance indicators for onboarding success</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {onboardingData.dynamicMetrics.successRate}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Avg. Completion Rate</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {onboardingData.dynamicMetrics.avgCompletionTime} days
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Avg. Duration</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {onboardingData.departmentHires.length > 0 ? 
                    (onboardingData.departmentHires.reduce((sum: number, dept: any) => sum + dept.satisfactionScore, 0) / onboardingData.departmentHires.length).toFixed(1) : 
                    "4.2"
                  }/5
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Avg. Satisfaction</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  ${onboardingData.dynamicMetrics.costPerOnboarding.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Avg. Cost per Hire</div>
              </div>
            </div>
            
            {/* Performance Comparison Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={onboardingData.departmentHires.length > 0 ? onboardingData.departmentHires : baseData.departmentData.slice(0, 4)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="completionRate" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Completion Rate %" />
                <Bar dataKey="satisfactionScore" fill="#10b981" radius={[2, 2, 0, 0]} name="Satisfaction /5" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
              {selectedDepartment === 'All Departments' ? 
                `Showing performance metrics across all departments for ${selectedTimeline}` :
                `Showing performance metrics for ${selectedDepartment} department for ${selectedTimeline}`
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding Checklist Completion */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600 dark:text-cyan-400" />
              Onboarding Checklist Completion
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">Progress on mandatory onboarding tasks</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {baseData.checklistData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.category}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {Math.round(item.percentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* New Hire Satisfaction & Feedback */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-600 dark:text-cyan-400" />
              New Hire Satisfaction Trends
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">NPS Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Training Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Manager Support</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={onboardingData.timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line type="monotone" dataKey="npsScore" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="trainingRating" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="managerSupport" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Cost Analysis and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding Cost Analysis */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-cyan-400" />
              Onboarding Cost Analysis
            </CardTitle>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Training</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Equipment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Administrative</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Other</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={onboardingData.timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="trainingCost" stackId="cost" fill="#3b82f6" />
                <Bar dataKey="equipmentCost" stackId="cost" fill="#10b981" />
                <Bar dataKey="administrativeCost" stackId="cost" fill="#8b5cf6" />
                <Bar dataKey="otherCost" stackId="cost" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Onboarding Trends */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              Onboarding Trends
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">New Hires</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Completions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-slate-600 dark:text-slate-400">Drop-offs</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={onboardingData.timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line type="monotone" dataKey="newHires" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="completions" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="dropoffs" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-cyan-500 dark:to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
              {baseData.timeToProductivity} days
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Avg. Time to Productivity</div>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">-2 days</Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-cyan-500 dark:to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
              {baseData.retentionRate}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Retention Rate (90 days)</div>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">+4%</Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 dark:from-cyan-500 dark:to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
              {baseData.npsScore}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">NPS Score</div>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">+8</Badge>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-cyan-500 dark:to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
              {baseData.goalAchievementRate}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Goal Achievement Rate</div>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">+7%</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
  }

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
      {activeSection === "onboarding" && renderOnboarding()}
      {activeSection === "performance" && renderPerformance()}
      {activeSection === "learning" && renderLearning()}
      {activeSection === "engagement" && renderEngagement()}

      {/* HR Bot Chat Component */}
      <HRBotChat currentSection={activeSection} />
    </div>
  )
}
