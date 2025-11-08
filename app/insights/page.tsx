"use client"

import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserAnalytics, getComparisonAnalytics } from "@/lib/analytics"
import { DAILY_LOGS, USER_PROGRESS, ACTIONS_CATALOG } from "@/lib/data"

export default function Insights() {
  const demoAnalytics = getUserAnalytics("demo_alexa")
  const comparisonData = getComparisonAnalytics()

  const exportToCSV = () => {
    const csvContent = [
      ["Analytics Export Report"],
      ["Generated on:", new Date().toLocaleDateString()],
      [],
      ["User Metrics"],
      ["User", "Current Emissions (kg)", "Baseline (kg)", "Total Saved (kg)", "Actions Completed", "Points"],
      ...comparisonData.users.map((u) => [
        u.name,
        u.analytics.currentMonthEmissions,
        u.analytics.baselineMonthly,
        u.analytics.totalSaved,
        u.analytics.actionsCompleted,
        u.analytics.totalPoints,
      ]),
      [],
      ["Summary"],
      ["Total Users", comparisonData.userCount],
      ["Average Baseline", comparisonData.avgBaseline],
      ["Total CO₂ Saved Across Users", comparisonData.totalSavedAcrossUsers],
      ["Avg Reduction %", comparisonData.avgReductionPercentage],
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "carbon-analytics.csv"
    a.click()
  }

  const exportToJSON = () => {
    const jsonData = {
      exportDate: new Date().toISOString(),
      summary: {
        totalUsers: comparisonData.userCount,
        avgBaseline: comparisonData.avgBaseline,
        totalSaved: comparisonData.totalSavedAcrossUsers,
        avgReduction: comparisonData.avgReductionPercentage,
      },
      users: comparisonData.users.map((u) => ({
        name: u.name,
        analytics: u.analytics,
      })),
      dailyLogs: DAILY_LOGS,
      actionsCatalog: ACTIONS_CATALOG,
      userProgress: USER_PROGRESS,
    }

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "carbon-data.json"
    a.click()
  }

  const topInsights = [
    {
      title: "Most Impactful Action",
      value: "Switch to plant-based meals",
      description: "Saves 3.3 kg CO₂ per action",
    },
    {
      title: "Highest Emitting Category",
      value: `${demoAnalytics.categoryBreakdown[0]?.name || "Diet"}`,
      description: `${demoAnalytics.categoryBreakdown[0]?.percentage || 45}% of total emissions`,
    },
    {
      title: "User Average Reduction",
      value: `${comparisonData.avgReductionPercentage}%`,
      description: "Compared to baseline",
    },
    {
      title: "Team Impact",
      value: `${comparisonData.totalSavedAcrossUsers} kg`,
      description: "Total CO₂ saved across all users",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Insights & Reports</h1>
          <p className="text-muted-foreground">Deep dive into your carbon data and export reports</p>
        </div>

        {/* Top Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {topInsights.map((insight, i) => (
            <Card key={i} className="p-6 bg-gradient-to-br from-card to-muted hover:shadow-lg transition-shadow">
              <p className="text-sm text-muted-foreground mb-2">{insight.title}</p>
              <p className="text-2xl font-bold text-primary mb-2">{insight.value}</p>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </Card>
          ))}
        </div>

        {/* Data Export Section */}
        <Card className="p-8 border-primary/20 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Export Your Data</h2>
              <p className="text-muted-foreground">
                Download analytics data in CSV or JSON format for further analysis
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportToCSV} className="bg-primary hover:bg-primary/90">
                Export CSV
              </Button>
              <Button onClick={exportToJSON} className="bg-secondary hover:bg-secondary/90">
                Export JSON
              </Button>
            </div>
          </div>
        </Card>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 border-primary/20">
            <h2 className="text-xl font-bold mb-4">User Performance Summary</h2>
            <div className="space-y-4">
              {comparisonData.users.map((user, idx) => (
                <div key={idx} className="pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{user.name}</h3>
                    <span className="text-sm font-bold text-primary">{user.analytics.totalSaved} kg saved</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Current</p>
                      <p className="font-semibold">{user.analytics.currentMonthEmissions} kg</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Baseline</p>
                      <p className="font-semibold">{user.baseline} kg</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Actions Completed</p>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(user.analytics.actionsCompleted, 5) }).map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full" />
                      ))}
                      {user.analytics.actionsCompleted > 5 && (
                        <span className="text-xs text-muted-foreground">+{user.analytics.actionsCompleted - 5}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-primary/20">
            <h2 className="text-xl font-bold mb-4">Key Metrics & Goals</h2>
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Platform Wide Reduction</p>
                <p className="text-3xl font-bold text-primary">{comparisonData.avgReductionPercentage}%</p>
                <p className="text-xs text-muted-foreground mt-1">Average reduction from baseline</p>
              </div>

              <div className="p-4 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Environmental Impact</p>
                <p className="text-3xl font-bold text-secondary">{comparisonData.totalSavedAcrossUsers} kg</p>
                <p className="text-xs text-muted-foreground mt-1">CO₂ saved collectively</p>
              </div>

              <div className="p-4 bg-accent/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                <p className="text-3xl font-bold text-accent">{comparisonData.userCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Tracking their carbon footprint</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Data Quality Notes */}
        <Card className="p-6 border-primary/20 mt-8 bg-muted/30">
          <h3 className="font-semibold mb-2">Data Quality & Transparency</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Emission factors sourced from DEFRA, IEA, and EPA databases</li>
            <li>✓ All calculations use standardized methodologies</li>
            <li>✓ Data is anonymized and privacy-preserving</li>
            <li>✓ Real-time calculations with automated validation</li>
          </ul>
        </Card>
      </div>
    </main>
  )
}
