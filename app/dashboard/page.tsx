"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { getUserAnalytics } from "@/lib/analytics"

const DEMO_USER = {
  name: "Alexa",
  baselineMonthly: 120,
  region: "India",
}

const ACTIONS_TODAY = [
  { id: "A001", title: "Walk or cycle for short commutes", saved: 0.9, category: "commute" },
  { id: "A002", title: "Switch one meat meal to plant-based", saved: 3.3, category: "diet" },
  { id: "A003", title: "Delay AC by 1° and use fan", saved: 0.4, category: "energy" },
]

export default function Dashboard() {
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())

  const analytics = getUserAnalytics("demo_alexa")

  const toggleAction = (id: string) => {
    const updated = new Set(completedActions)
    if (updated.has(id)) {
      updated.delete(id)
    } else {
      updated.add(id)
    }
    setCompletedActions(updated)
  }

  const totalSaved = ACTIONS_TODAY.filter((a) => completedActions.has(a.id))
    .reduce((sum, a) => sum + a.saved, 0)
    .toFixed(1)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {DEMO_USER.name}!</h1>
          <p className="text-muted-foreground">Track your carbon footprint and complete daily micro-actions</p>
        </div>

        {/* Summary Cards with Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <p className="text-sm text-muted-foreground mb-2">Current Month</p>
            <p className="text-2xl font-bold text-primary">{analytics.currentMonthEmissions} kg</p>
            <p className="text-xs text-muted-foreground mt-1">vs {analytics.baselineMonthly} kg baseline</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <p className="text-sm text-muted-foreground mb-2">This Week</p>
            <p className="text-2xl font-bold text-secondary">
              {analytics.weeklyTrend.reduce((sum, d) => sum + d.emissions, 0).toFixed(1)} kg
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.weeklyTrend.reduce((sum, d) => sum + d.actions, 0)} actions completed
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
            <p className="text-sm text-muted-foreground mb-2">Total Saved</p>
            <p className="text-2xl font-bold text-accent">{analytics.totalSaved} kg</p>
            <p className="text-xs text-muted-foreground mt-1">{analytics.actionsCompleted} actions done</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
            <p className="text-sm text-muted-foreground mb-2">Green Points</p>
            <p className="text-2xl font-bold text-emerald-600">{analytics.totalPoints}</p>
            <p className="text-xs text-muted-foreground mt-1">Points earned</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Actions & Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Actions */}
            <Card className="p-6 border-primary/20">
              <h2 className="text-xl font-bold mb-4">Today's Micro-Actions</h2>
              <div className="space-y-3">
                {ACTIONS_TODAY.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">Est. saved: {action.saved} kg CO₂</p>
                    </div>
                    <Button
                      onClick={() => toggleAction(action.id)}
                      className={`ml-4 ${
                        completedActions.has(action.id)
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      }`}
                    >
                      {completedActions.has(action.id) ? "✓ Done" : "Mark Done"}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Weekly Trend Chart with Real Data */}
            <Card className="p-6 border-primary/20">
              <h2 className="text-xl font-bold mb-4">Weekly CO₂ Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 142)" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="oklch(0.52 0.16 142)"
                    name="CO₂ (kg)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Right Column - Forecast & Category */}
          <div className="space-y-8">
            {/* Forecast with Real Calculation */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <h2 className="text-lg font-bold mb-3">30-Day Forecast</h2>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">If you continue current pace:</p>
                <p className="text-3xl font-bold text-primary">{analytics.forecast30Days.reduction}%</p>
                <p className="text-xs text-muted-foreground">Estimated reduction from baseline</p>
                <div className="pt-3 border-t border-border/30">
                  <p className="text-sm font-semibold">{analytics.forecast30Days.estimatedEmissions} kg CO₂</p>
                  <p className="text-xs text-muted-foreground">Projected monthly emissions</p>
                </div>
              </div>
            </Card>

            {/* Category Breakdown with Real Data */}
            <Card className="p-6 border-primary/20">
              <h2 className="text-lg font-bold mb-4">Emissions by Category</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {[
                      "oklch(0.52 0.16 142)",
                      "oklch(0.65 0.15 162)",
                      "oklch(0.68 0.18 82)",
                      "oklch(0.45 0.12 142)",
                    ].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-1">
                {analytics.categoryBreakdown.map((cat) => (
                  <div key={cat.name} className="flex justify-between text-xs">
                    <span>{cat.name}</span>
                    <span className="font-semibold">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Progress Stats */}
            <Card className="p-6 border-primary/20">
              <h2 className="text-lg font-bold mb-4">This Month Progress</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Actions Completed</p>
                  <p className="text-2xl font-bold">{analytics.actionsCompleted}</p>
                </div>
                <div className="pt-3 border-t border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Points This Month</p>
                  <p className="text-2xl font-bold text-emerald-600">{analytics.totalPoints}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
