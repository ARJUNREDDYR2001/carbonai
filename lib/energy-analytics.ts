import { HOME_APPLIANCES, ENERGY_LOGS } from "./data"

export interface ApplianceStats {
  appliance_id: string
  name: string
  type: string
  total_energy_kwh: number
  total_co2_kg: number
  total_cost_usd: number
  avg_daily_hours: number
  efficiency_rating: string
  co2_percentage: number
  cost_percentage: number
}

export interface EnergyAnalytics {
  userId: string
  total_energy_kwh: number
  total_co2_kg: number
  total_cost_usd: number
  daily_average_kwh: number
  daily_average_co2: number
  daily_average_cost: number
  top_consumers: ApplianceStats[]
  energy_by_type: Array<{ type: string; kwh: number; co2: number; percentage: number }>
  daily_trend: Array<{ date: string; kwh: number; co2: number; cost: number }>
  optimization_suggestions: Array<{
    appliance: string
    current_co2_kg: number
    potential_savings_kg: number
    potential_savings_usd: number
    action: string
  }>
}

export function getEnergyAnalytics(userId: string): EnergyAnalytics {
  const userLogs = ENERGY_LOGS.filter((log) => log.user_id === userId)
  const userAppliances = HOME_APPLIANCES.filter((app) => app.user_id === userId)

  if (userLogs.length === 0) {
    return {
      userId,
      total_energy_kwh: 0,
      total_co2_kg: 0,
      total_cost_usd: 0,
      daily_average_kwh: 0,
      daily_average_co2: 0,
      daily_average_cost: 0,
      top_consumers: [],
      energy_by_type: [],
      daily_trend: [],
      optimization_suggestions: [],
    }
  }

  // Calculate totals
  const total_energy_kwh = userLogs.reduce((sum, log) => sum + log.energy_consumed_kwh, 0)
  const total_co2_kg = userLogs.reduce((sum, log) => sum + log.estimated_co2_kg, 0)
  const total_cost_usd = userLogs.reduce((sum, log) => sum + log.cost_usd, 0)

  // Get unique days
  const uniqueDays = [...new Set(userLogs.map((log) => log.date))].length
  const daily_average_kwh = total_energy_kwh / uniqueDays
  const daily_average_co2 = total_co2_kg / uniqueDays
  const daily_average_cost = total_cost_usd / uniqueDays

  // Calculate per-appliance stats
  const applianceStats: Record<string, ApplianceStats> = {}
  userLogs.forEach((log) => {
    const appliance = userAppliances.find((a) => a.appliance_id === log.appliance_id)
    if (!appliance) return

    if (!applianceStats[log.appliance_id]) {
      applianceStats[log.appliance_id] = {
        appliance_id: log.appliance_id,
        name: appliance.name,
        type: appliance.type,
        total_energy_kwh: 0,
        total_co2_kg: 0,
        total_cost_usd: 0,
        avg_daily_hours: 0,
        efficiency_rating: appliance.efficiency_rating,
        co2_percentage: 0,
        cost_percentage: 0,
      }
    }

    applianceStats[log.appliance_id].total_energy_kwh += log.energy_consumed_kwh
    applianceStats[log.appliance_id].total_co2_kg += log.estimated_co2_kg
    applianceStats[log.appliance_id].total_cost_usd += log.cost_usd
    applianceStats[log.appliance_id].avg_daily_hours += log.hours_used
  })

  // Calculate percentages
  Object.values(applianceStats).forEach((stat) => {
    stat.avg_daily_hours = stat.avg_daily_hours / uniqueDays
    stat.co2_percentage = (stat.total_co2_kg / total_co2_kg) * 100
    stat.cost_percentage = (stat.total_cost_usd / total_cost_usd) * 100
  })

  const top_consumers = Object.values(applianceStats)
    .sort((a, b) => b.total_co2_kg - a.total_co2_kg)
    .slice(0, 5)

  // Calculate energy by type
  const energyByTypeMap: Record<string, { type: string; kwh: number; co2: number; count: number }> = {}
  Object.values(applianceStats).forEach((stat) => {
    if (!energyByTypeMap[stat.type]) {
      energyByTypeMap[stat.type] = { type: stat.type, kwh: 0, co2: 0, count: 0 }
    }
    energyByTypeMap[stat.type].kwh += stat.total_energy_kwh
    energyByTypeMap[stat.type].co2 += stat.total_co2_kg
    energyByTypeMap[stat.type].count += 1
  })

  const energy_by_type = Object.values(energyByTypeMap)
    .map((item) => ({
      type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
      kwh: Math.round(item.kwh * 10) / 10,
      co2: Math.round(item.co2 * 100) / 100,
      percentage: Math.round((item.co2 / total_co2_kg) * 100),
    }))
    .sort((a, b) => b.co2 - a.co2)

  // Calculate daily trend
  const dailyTrendMap: Record<string, { kwh: number; co2: number; cost: number }> = {}
  userLogs.forEach((log) => {
    if (!dailyTrendMap[log.date]) {
      dailyTrendMap[log.date] = { kwh: 0, co2: 0, cost: 0 }
    }
    dailyTrendMap[log.date].kwh += log.energy_consumed_kwh
    dailyTrendMap[log.date].co2 += log.estimated_co2_kg
    dailyTrendMap[log.date].cost += log.cost_usd
  })

  const daily_trend = Object.entries(dailyTrendMap)
    .map(([date, data]) => ({
      date,
      kwh: Math.round(data.kwh * 10) / 10,
      co2: Math.round(data.co2 * 100) / 100,
      cost: Math.round(data.cost * 100) / 100,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Generate optimization suggestions
  const optimization_suggestions = top_consumers
    .filter((app) => app.efficiency_rating !== "5-star")
    .map((app) => {
      const savingsPercentage = app.efficiency_rating === "3-star" ? 0.3 : app.efficiency_rating === "4-star" ? 0.15 : 0
      return {
        appliance: app.name,
        current_co2_kg: Math.round(app.total_co2_kg * 100) / 100,
        potential_savings_kg: Math.round(app.total_co2_kg * savingsPercentage * 100) / 100,
        potential_savings_usd: Math.round(app.total_cost_usd * savingsPercentage * 100) / 100,
        action:
          app.efficiency_rating === "3-star"
            ? `Upgrade ${app.name} to a 5-star model - save ~${Math.round(app.total_co2_kg * 0.3)}kg CO2`
            : `Consider eco-friendly usage of ${app.name} - save ~${Math.round(app.total_co2_kg * 0.15)}kg CO2`,
      }
    })

  return {
    userId,
    total_energy_kwh: Math.round(total_energy_kwh * 10) / 10,
    total_co2_kg: Math.round(total_co2_kg * 100) / 100,
    total_cost_usd: Math.round(total_cost_usd * 100) / 100,
    daily_average_kwh: Math.round(daily_average_kwh * 10) / 10,
    daily_average_co2: Math.round(daily_average_co2 * 100) / 100,
    daily_average_cost: Math.round(daily_average_cost * 100) / 100,
    top_consumers,
    energy_by_type,
    daily_trend,
    optimization_suggestions,
  }
}
