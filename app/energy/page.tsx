"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getEnergyAnalytics } from "@/lib/energy-analytics"
import Navbar from "@/components/navbar"

export default function EnergyDashboard() {
  const [selectedUser] = useState("demo_alexa")
  const analytics = getEnergyAnalytics(selectedUser)

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  return (
    <div>
        <Navbar />

    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Energy Consumption Dashboard</h1>
          <p className="text-slate-600">Track your household energy usage and carbon footprint</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Energy Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{analytics.total_energy_kwh} kWh</div>
              <p className="text-xs text-slate-500 mt-1">Last 5 days</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">CO₂ Emissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{analytics.total_co2_kg} kg</div>
              <p className="text-xs text-slate-500 mt-1">Carbon footprint</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Daily Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{analytics.daily_average_kwh} kWh</div>
              <p className="text-xs text-slate-500 mt-1">Per day usage</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">${analytics.total_cost_usd}</div>
              <p className="text-xs text-slate-500 mt-1">Electricity bill</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Trend Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Daily Energy Consumption Trend</CardTitle>
              <CardDescription>Energy usage over the last 5 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ kwh: { label: "kWh", color: "hsl(var(--chart-1))" } }} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.daily_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="kwh" stroke="#3b82f6" name="kWh Used" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Energy by Type Pie Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Energy Distribution by Appliance Type</CardTitle>
              <CardDescription>Percentage of total consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.energy_by_type}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {analytics.energy_by_type.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Consumers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top 5 Energy Consumers */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Top 5 Energy Consumers</CardTitle>
              <CardDescription>Appliances using the most power</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  co2: { label: "CO₂ (kg)", color: "hsl(var(--chart-2))" },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.top_consumers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total_co2_kg" fill="#ef4444" name="CO₂ (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Energy Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Daily Avg CO₂</p>
                <p className="text-2xl font-bold text-red-600">{analytics.daily_average_co2} kg</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Daily Avg Cost</p>
                <p className="text-2xl font-bold text-green-600">${analytics.daily_average_cost}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Top Appliance</p>
                <p className="text-lg font-semibold text-slate-900">{analytics.top_consumers[0]?.name || "N/A"}</p>
                <p className="text-xs text-slate-500">{analytics.top_consumers[0]?.type}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Optimization Suggestions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Optimization Suggestions</CardTitle>
            <CardDescription>Ways to reduce energy consumption and save money</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.optimization_suggestions.length > 0 ? (
                analytics.optimization_suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                  >
                    <h4 className="font-semibold text-slate-900 mb-2">{suggestion.appliance}</h4>
                    <p className="text-sm text-slate-700 mb-3">{suggestion.action}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-600">Potential Savings</p>
                        <p className="font-bold text-green-600">{suggestion.potential_savings_kg} kg CO₂</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Save</p>
                        <p className="font-bold text-green-600">${suggestion.potential_savings_usd}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 col-span-full">All your appliances are running efficiently!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
        </div>
  )
}
