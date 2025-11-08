"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { getUserAnalytics, getComparisonAnalytics } from "@/lib/analytics"

export default function Analytics() {
  const [selectedUser, setSelectedUser] = useState("demo_alexa")
  const [timeRange, setTimeRange] = useState("7days")

  const userAnalytics = getUserAnalytics(selectedUser)
  const comparisonData = getComparisonAnalytics()

  const chartColors = {
    primary: "oklch(0.52 0.16 142)",
    secondary: "oklch(0.65 0.15 162)",
    accent: "oklch(0.68 0.18 82)",
    success: "oklch(0.65 0.20 142)",
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Detailed carbon footprint insights and trends</p>
        </div>

        {/* User Selection & Time Range */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            {comparisonData.users.map((u) => (
              <Button
                key={u.analytics.userId}
                onClick={() => setSelectedUser(u.analytics.userId)}
                className={
                  selectedUser === u.analytics.userId
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/30"
                }
              >
                {u.name}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            {["7days", "30days", "90days"].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? "bg-primary text-primary-foreground" : "bg-card border border-border"}
              >
                {range === "7days" ? "7 Days" : range === "30days" ? "30 Days" : "90 Days"}
              </Button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <p className="text-sm text-muted-foreground mb-2">Current Emissions</p>
            <p className="text-3xl font-bold text-primary">{userAnalytics.currentMonthEmissions}</p>
            <p className="text-xs text-muted-foreground mt-2">kg CO₂ this month</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <p className="text-sm text-muted-foreground mb-2">Baseline</p>
            <p className="text-3xl font-bold text-secondary">{userAnalytics.baselineMonthly}</p>
            <p className="text-xs text-muted-foreground mt-2">kg CO₂ monthly average</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
            <p className="text-sm text-muted-foreground mb-2">Total Saved</p>
            <p className="text-3xl font-bold text-accent">{userAnalytics.totalSaved}</p>
            <p className="text-xs text-muted-foreground mt-2">kg CO₂ reduced</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
            <p className="text-sm text-muted-foreground mb-2">Green Points</p>
            <p className="text-3xl font-bold text-emerald-600">{userAnalytics.totalPoints}</p>
            <p className="text-xs text-muted-foreground mt-2">Points earned</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Weekly Trend */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-primary/20">
              <h2 className="text-xl font-bold mb-4">Weekly Emissions Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userAnalytics.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 142)" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke={chartColors.primary}
                    name="CO₂ (kg)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* 30-Day Forecast */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <h2 className="text-lg font-bold mb-4">30-Day Forecast</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Projected Reduction</p>
                <p className="text-4xl font-bold text-primary">{userAnalytics.forecast30Days.reduction}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estimated Emissions</p>
                <p className="text-2xl font-bold text-secondary">
                  {userAnalytics.forecast30Days.estimatedEmissions} kg
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Based on completing {userAnalytics.actionsCompleted} actions at current pace
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 border-primary/20">
            <h2 className="text-xl font-bold mb-4">Emissions by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userAnalytics.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {[chartColors.primary, chartColors.secondary, chartColors.accent, chartColors.success].map(
                    (color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ),
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {userAnalytics.categoryBreakdown.map((cat, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-muted-foreground">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* User Comparison */}
          <Card className="p-6 border-primary/20">
            <h2 className="text-xl font-bold mb-4">User Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData.users}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 142)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseline" fill={chartColors.secondary} name="Baseline" radius={[8, 8, 0, 0]} />
                <Bar
                  dataKey={(u) => u.analytics.currentMonthEmissions}
                  fill={chartColors.primary}
                  name="Current"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Avg Baseline:</span>
                <span className="font-bold">{comparisonData.avgBaseline} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Users:</span>
                <span className="font-bold">{comparisonData.userCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Saved:</span>
                <span className="font-bold text-emerald-600">{comparisonData.totalSavedAcrossUsers} kg</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
