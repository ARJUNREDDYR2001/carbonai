import { DAILY_LOGS, USER_PROGRESS, USERS, ACTIONS_CATALOG } from "./data"

export interface DailyEmissions {
  date: string
  total: number
  byCategory: Record<string, number>
}

export interface UserAnalytics {
  userId: string
  currentMonthEmissions: number
  baselineMonthly: number
  percentageChange: number
  totalSaved: number
  actionsCompleted: number
  totalPoints: number
  categoryBreakdown: Array<{ name: string; value: number; percentage: number }>
  weeklyTrend: Array<{ day: string; emissions: number; actions: number }>
  forecast30Days: { reduction: number; estimatedEmissions: number }
}

export function getUserAnalytics(userId: string): UserAnalytics {
  const user = USERS.find((u) => u.user_id === userId)
  if (!user) throw new Error("User not found")

  // Calculate current month emissions
  const userLogs = DAILY_LOGS.filter((log) => log.user_id === userId)
  const currentMonthEmissions = userLogs.reduce((sum, log) => sum + log.estimated_co2_kg, 0)

  // Calculate category breakdown
  const categoryBreakdown: Record<string, number> = {}
  userLogs.forEach((log) => {
    categoryBreakdown[log.event_type] = (categoryBreakdown[log.event_type] || 0) + log.estimated_co2_kg
  })

  const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Math.round(value),
    percentage: Math.round((value / currentMonthEmissions) * 100),
  }))

  // Calculate actions metrics
  const userProgress = USER_PROGRESS.filter((p) => p.user_id === userId)
  const completedActions = userProgress.filter((p) => p.completed)
  const totalSaved = completedActions.reduce((sum, p) => {
    const action = ACTIONS_CATALOG.find((a) => a.action_id === p.action_id)
    return sum + (action?.est_saved_kg || 0)
  }, 0)
  const totalPoints = userProgress.reduce((sum, p) => sum + p.points_earned, 0)

  // Calculate weekly trend
  const weeklyData: Record<string, { emissions: number; actions: number }> = {}
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  days.forEach((day) => {
    weeklyData[day] = { emissions: 0, actions: 0 }
  })

  userLogs.slice(0, 7).forEach((log, index) => {
    const day = days[index]
    weeklyData[day].emissions += log.estimated_co2_kg
  })

  userProgress.slice(0, 7).forEach((p, index) => {
    if (p.completed) {
      const day = days[Math.min(index, 6)]
      weeklyData[day].actions += 1
    }
  })

  const weeklyTrend = days.map((day) => ({
    day,
    emissions: Math.round(weeklyData[day].emissions * 10) / 10,
    actions: weeklyData[day].actions,
  }))

  // Calculate forecast
  const avgDailySavings = totalSaved / (completedActions.length || 1)
  const projectedMonthlySavings = avgDailySavings * 30
  const percentageChange = Math.round(
    ((user.baseline_monthly_kgCO2 - projectedMonthlySavings) / user.baseline_monthly_kgCO2) * 100,
  )
  const estimatedEmissions = Math.max(0, user.baseline_monthly_kgCO2 - projectedMonthlySavings)

  return {
    userId,
    currentMonthEmissions: Math.round(currentMonthEmissions * 10) / 10,
    baselineMonthly: user.baseline_monthly_kgCO2,
    percentageChange: Math.min(percentageChange, 0), // Negative or zero
    totalSaved: Math.round(totalSaved * 100) / 100,
    actionsCompleted: completedActions.length,
    totalPoints,
    categoryBreakdown: categoryData,
    weeklyTrend,
    forecast30Days: {
      reduction: Math.abs(percentageChange),
      estimatedEmissions: Math.round(estimatedEmissions * 10) / 10,
    },
  }
}

export function getComparisonAnalytics() {
  const allUsers = USERS.map((user) => ({
    name: user.first_name,
    baseline: user.baseline_monthly_kgCO2,
    analytics: getUserAnalytics(user.user_id),
  }))

  const avgBaseline = allUsers.reduce((sum, u) => sum + u.baseline, 0) / allUsers.length
  const avgEmissions = allUsers.reduce((sum, u) => sum + u.analytics.currentMonthEmissions, 0) / allUsers.length
  const totalSavedAcrossUsers = allUsers.reduce((sum, u) => sum + u.analytics.totalSaved, 0)

  return {
    userCount: allUsers.length,
    avgBaseline: Math.round(avgBaseline * 10) / 10,
    avgCurrentEmissions: Math.round(avgEmissions * 10) / 10,
    totalSavedAcrossUsers: Math.round(totalSavedAcrossUsers * 100) / 100,
    avgReductionPercentage:
      Math.round(
        (allUsers.reduce((sum, u) => sum + Math.abs(u.analytics.percentageChange), 0) / allUsers.length) * 10,
      ) / 10,
    users: allUsers,
  }
}
