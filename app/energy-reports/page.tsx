"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getEnergyAnalytics } from "@/lib/energy-analytics"
import { HOME_APPLIANCES } from "@/lib/data"
import Navbar from "@/components/navbar"

export default function EnergyReportsPage() {
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "text">("json")
  const analytics = getEnergyAnalytics("demo_alexa")
  const appliances = HOME_APPLIANCES.filter((app) => app.user_id === "demo_alexa")

  const generateReport = () => {
    const report = {
      reportDate: new Date().toISOString(),
      period: "Last 5 days",
      household: {
        userId: "demo_alexa",
        region: "IN",
      },
      summary: {
        totalEnergyKwh: analytics.total_energy_kwh,
        totalCO2kg: analytics.total_co2_kg,
        totalCostUSD: analytics.total_cost_usd,
        dailyAverageKwh: analytics.daily_average_kwh,
        dailyAverageCO2: analytics.daily_average_co2,
        dailyAverageCost: analytics.daily_average_cost,
      },
      topConsumers: analytics.top_consumers.map((app) => ({
        name: app.name,
        type: app.type,
        energyKwh: app.total_energy_kwh,
        co2kg: app.total_co2_kg,
        costUSD: app.total_cost_usd,
        efficiencyRating: app.efficiency_rating,
      })),
      recommendations: analytics.optimization_suggestions.map((sugg) => ({
        appliance: sugg.appliance,
        action: sugg.action,
        potentialCO2SavingsKg: sugg.potential_savings_kg,
        potentialCostSavingsUSD: sugg.potential_savings_usd,
      })),
    }
    return report
  }

  const exportReport = () => {
    const report = generateReport()

    if (exportFormat === "json") {
      const jsonString = JSON.stringify(report, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `energy-report-${new Date().toISOString().split("T")[0]}.json`
      a.click()
    } else if (exportFormat === "csv") {
      let csvContent =
        "Energy Consumption Report\n" +
        `Report Date,${new Date().toISOString()}\n` +
        `Period,Last 5 days\n\n` +
        "SUMMARY\n" +
        `Total Energy (kWh),${analytics.total_energy_kwh}\n` +
        `Total CO2 (kg),${analytics.total_co2_kg}\n` +
        `Total Cost (USD),${analytics.total_cost_usd}\n` +
        `Daily Average (kWh),${analytics.daily_average_kwh}\n` +
        `Daily Average CO2 (kg),${analytics.daily_average_co2}\n` +
        `Daily Average Cost (USD),${analytics.daily_average_cost}\n\n` +
        "TOP CONSUMERS\n" +
        "Appliance,Type,Energy (kWh),CO2 (kg),Cost (USD),Efficiency\n"

      analytics.top_consumers.forEach((app) => {
        csvContent += `${app.name},${app.type},${app.total_energy_kwh},${app.total_co2_kg},${app.total_cost_usd},${app.efficiency_rating}\n`
      })

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `energy-report-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
    } else if (exportFormat === "text") {
      let textContent =
        "ENERGY CONSUMPTION REPORT\n" +
        "========================\n\n" +
        `Report Date: ${new Date().toISOString()}\n` +
        `Period: Last 5 days\n\n` +
        "SUMMARY\n" +
        "-------\n" +
        `Total Energy Consumed: ${analytics.total_energy_kwh} kWh\n` +
        `Total CO2 Emissions: ${analytics.total_co2_kg} kg\n` +
        `Total Cost: $${analytics.total_cost_usd}\n` +
        `Daily Average: ${analytics.daily_average_kwh} kWh\n` +
        `Daily Average CO2: ${analytics.daily_average_co2} kg\n` +
        `Daily Average Cost: $${analytics.daily_average_cost}\n\n` +
        "TOP ENERGY CONSUMERS\n" +
        "-------------------\n"

      analytics.top_consumers.forEach((app, idx) => {
        textContent +=
          `${idx + 1}. ${app.name}\n` +
          `   Type: ${app.type}\n` +
          `   Energy Used: ${app.total_energy_kwh} kWh\n` +
          `   CO2: ${app.total_co2_kg} kg\n` +
          `   Cost: $${app.total_cost_usd}\n` +
          `   Efficiency: ${app.efficiency_rating}\n\n`
      })

      textContent += "RECOMMENDATIONS\n" + "---------------\n"
      analytics.optimization_suggestions.forEach((sugg) => {
        textContent += `• ${sugg.action}\n  Potential Savings: ${sugg.potential_savings_kg} kg CO2 ($${sugg.potential_savings_usd})\n\n`
      })

      const blob = new Blob([textContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `energy-report-${new Date().toISOString().split("T")[0]}.txt`
      a.click()
    }
  }

  return (
    <div>
        <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Energy Reports & Analysis</h1>
          <p className="text-slate-600">Comprehensive energy consumption analysis and recommendations</p>
        </div>

        {/* Executive Summary */}
        <Card className="border-0 shadow-sm mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="text-white">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-100">Total Energy</p>
              <p className="text-3xl font-bold">{analytics.total_energy_kwh}</p>
              <p className="text-sm text-blue-100">kWh (5 days)</p>
            </div>
            <div>
              <p className="text-blue-100">CO₂ Emissions</p>
              <p className="text-3xl font-bold text-red-300">{analytics.total_co2_kg}</p>
              <p className="text-sm text-blue-100">kg</p>
            </div>
            <div>
              <p className="text-blue-100">Total Cost</p>
              <p className="text-3xl font-bold text-green-300">${analytics.total_cost_usd}</p>
              <p className="text-sm text-blue-100">USD</p>
            </div>
            <div>
              <p className="text-blue-100">Avg Daily</p>
              <p className="text-3xl font-bold">{analytics.daily_average_kwh}</p>
              <p className="text-sm text-blue-100">kWh</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Energy Distribution */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Energy by Type</CardTitle>
              <CardDescription>Percentage breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.energy_by_type.map((type) => (
                  <div key={type.type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-900">{type.type}</span>
                      <span className="text-slate-600">{type.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${type.percentage}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{type.co2} kg CO₂</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Export Report</CardTitle>
              <CardDescription>Download analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as "json" | "csv" | "text")}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="json">JSON Format</option>
                <option value="csv">CSV Spreadsheet</option>
                <option value="text">Text File</option>
              </select>
              <button
                onClick={exportReport}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Download Report
              </button>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-slate-600">Avg Daily CO₂</p>
                <p className="text-2xl font-bold text-red-600">{analytics.daily_average_co2} kg</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Avg Daily Cost</p>
                <p className="text-2xl font-bold text-green-600">${analytics.daily_average_cost}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Top Consumer</p>
                <p className="font-semibold text-slate-900">{analytics.top_consumers[0]?.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Trend */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Daily Consumption Trend</CardTitle>
            <CardDescription>5-day energy usage pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                kwh: { label: "kWh", color: "hsl(var(--chart-1))" },
                cost: { label: "Cost ($)", color: "hsl(var(--chart-2))" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.daily_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="kwh" stroke="#3b82f6" name="kWh" strokeWidth={2} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cost"
                    stroke="#10b981"
                    name="Cost ($)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
            <CardDescription>Actions to reduce consumption</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.optimization_suggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.optimization_suggestions.map((sugg, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-orange-200"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="text-2xl font-bold text-orange-600">{idx + 1}</div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{sugg.appliance}</h4>
                        <p className="text-sm text-slate-700 mt-1">{sugg.action}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-3 pt-3 border-t border-orange-200">
                      <div>
                        <p className="text-slate-600">CO₂ Savings</p>
                        <p className="font-bold text-green-600">{sugg.potential_savings_kg} kg</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Cost Savings</p>
                        <p className="font-bold text-green-600">${sugg.potential_savings_usd}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">All appliances are optimized!</p>
            )}
          </CardContent>
        </Card>

        {/* Appliance Comparison */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Appliance Comparison</CardTitle>
            <CardDescription>Side-by-side efficiency analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Appliance</th>
                    <th className="text-right p-3 font-semibold">Power (W)</th>
                    <th className="text-right p-3 font-semibold">Daily Hours</th>
                    <th className="text-right p-3 font-semibold">Efficiency</th>
                    <th className="text-right p-3 font-semibold">Est. Monthly CO₂</th>
                  </tr>
                </thead>
                <tbody>
                  {appliances.map((app) => (
                    <tr key={app.appliance_id} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-900">{app.name}</td>
                      <td className="text-right p-3 text-slate-600">{app.power_watts}</td>
                      <td className="text-right p-3 text-slate-600">{app.usage_hours_daily}</td>
                      <td className="text-right p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            app.efficiency_rating === "5-star"
                              ? "bg-green-100 text-green-800"
                              : app.efficiency_rating === "4-star"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {app.efficiency_rating}
                        </span>
                      </td>
                      <td className="text-right p-3 font-semibold text-slate-900">{app.estimated_monthly_kgCO2} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
     </div>
  )
}
