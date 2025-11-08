"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { HOME_APPLIANCES, ENERGY_LOGS } from "@/lib/data";
import Navbar from "@/components/navbar";

export default function AppliancesPage() {
  const [selectedAppliance, setSelectedAppliance] = useState<string | null>(
    null
  );
  const userAppliances = HOME_APPLIANCES.filter(
    (app) => app.user_id === "demo_alexa"
  );
  const userLogs = ENERGY_LOGS.filter((log) => log.user_id === "demo_alexa");

  // Get usage data for selected appliance
  const getApplianceUsageData = (applianceId: string) => {
    return userLogs
      .filter((log) => log.appliance_id === applianceId)
      .map((log) => ({
        date: log.date,
        kwh: log.energy_consumed_kwh,
        co2: log.estimated_co2_kg,
        cost: log.cost_usd,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getOptimizationTips = (appliance: any) => {
    const tips: string[] = [];
    if (appliance.efficiency_rating === "3-star") {
      tips.push("Consider upgrading to a newer energy-efficient model");
    }
    if (appliance.age_years > 7) {
      tips.push(
        "This appliance is older - newer models use significantly less energy"
      );
    }
    if (appliance.usage_hours_daily > 8) {
      tips.push("Try to reduce daily usage hours to save energy");
    }
    if (appliance.type === "cooling" && appliance.usage_hours_daily > 4) {
      tips.push(
        "Use fans for cooler days and increase AC temperature by 1-2 degrees"
      );
    }
    if (appliance.type === "heating") {
      tips.push("Use blankets or layer clothing to reduce heater dependency");
    }
    return tips.length > 0
      ? tips
      : ["This appliance is already optimized for energy efficiency"];
  };

  const getEfficiencyColor = (rating: string) => {
    if (rating === "5-star") return "bg-green-100 text-green-800";
    if (rating === "4-star") return "bg-blue-100 text-blue-800";
    if (rating === "3-star") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const calculateTotalStats = (applianceId: string) => {
    const logs = userLogs.filter((log) => log.appliance_id === applianceId);
    return {
      kwh: logs.reduce((sum, log) => sum + log.energy_consumed_kwh, 0),
      co2: logs.reduce((sum, log) => sum + log.estimated_co2_kg, 0),
      cost: logs.reduce((sum, log) => sum + log.cost_usd, 0),
    };
  };

  return (
    <div>
      {" "}
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Home Appliances Inventory
            </h1>
            <p className="text-slate-600">
              Manage and optimize your household appliances
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appliances List */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Your Appliances</CardTitle>
                  <CardDescription>
                    {userAppliances.length} devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {userAppliances.map((app) => {
                    const stats = calculateTotalStats(app.appliance_id);
                    return (
                      <button
                        key={app.appliance_id}
                        onClick={() => setSelectedAppliance(app.appliance_id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedAppliance === app.appliance_id
                            ? "bg-blue-100 border border-blue-400"
                            : "bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <p className="font-semibold text-slate-900">
                          {app.name}
                        </p>
                        <p className="text-xs text-slate-600">{app.type}</p>
                        <p className="text-xs font-medium text-red-600 mt-1">
                          {stats.co2.toFixed(2)} kg CO₂
                        </p>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Appliance Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedAppliance ? (
                <>
                  {(() => {
                    const appliance = userAppliances.find(
                      (a) => a.appliance_id === selectedAppliance
                    );
                    if (!appliance) return null;

                    const stats = calculateTotalStats(appliance.appliance_id);
                    const usageData = getApplianceUsageData(
                      appliance.appliance_id
                    );
                    const tips = getOptimizationTips(appliance);

                    return (
                      <>
                        {/* Appliance Header */}
                        <Card className="border-0 shadow-sm">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-2xl">
                                  {appliance.name}
                                </CardTitle>
                                <CardDescription>
                                  {appliance.type} • {appliance.age_years} years
                                  old
                                </CardDescription>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getEfficiencyColor(
                                  appliance.efficiency_rating
                                )}`}
                              >
                                {appliance.efficiency_rating}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-slate-600">
                                Power Rating
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                {appliance.power_watts}W
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">
                                Daily Usage
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                {appliance.usage_hours_daily}h
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">
                                Monthly Est.
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                {appliance.estimated_monthly_kgCO2} kg
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">
                                Total Used
                              </p>
                              <p className="text-lg font-bold text-red-600">
                                {stats.co2.toFixed(2)} kg
                              </p>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Usage Chart */}
                        {usageData.length > 0 && (
                          <Card className="border-0 shadow-sm">
                            <CardHeader>
                              <CardTitle>Energy Usage History</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ChartContainer
                                config={{
                                  kwh: {
                                    label: "kWh",
                                    color: "hsl(var(--chart-1))",
                                  },
                                  cost: {
                                    label: "Cost ($)",
                                    color: "hsl(var(--chart-2))",
                                  },
                                }}
                                className="h-80"
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={usageData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="left" />
                                    <YAxis
                                      yAxisId="right"
                                      orientation="right"
                                    />
                                    <ChartTooltip
                                      content={<ChartTooltipContent />}
                                    />
                                    <Legend />
                                    <Line
                                      yAxisId="left"
                                      type="monotone"
                                      dataKey="kwh"
                                      stroke="#3b82f6"
                                      name="Energy (kWh)"
                                    />
                                    <Line
                                      yAxisId="right"
                                      type="monotone"
                                      dataKey="cost"
                                      stroke="#10b981"
                                      name="Cost ($)"
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </ChartContainer>
                            </CardContent>
                          </Card>
                        )}

                        {/* Optimization Tips */}
                        <Card className="border-0 shadow-sm">
                          <CardHeader>
                            <CardTitle>Optimization Tips</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3">
                              {tips.map((tip, idx) => (
                                <li key={idx} className="flex gap-3">
                                  <span className="text-blue-600 font-bold">
                                    •
                                  </span>
                                  <span className="text-slate-700">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        {/* Summary Stats */}
                        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-blue-50">
                          <CardHeader>
                            <CardTitle>Impact Summary</CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-sm text-slate-600">
                                Energy Used
                              </p>
                              <p className="text-2xl font-bold text-blue-600">
                                {stats.kwh.toFixed(1)} kWh
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-slate-600">
                                CO₂ Produced
                              </p>
                              <p className="text-2xl font-bold text-red-600">
                                {stats.co2.toFixed(2)} kg
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-slate-600">Cost</p>
                              <p className="text-2xl font-bold text-green-600">
                                ${stats.cost.toFixed(2)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    );
                  })()}
                </>
              ) : (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-12 text-center">
                    <p className="text-slate-600">
                      Select an appliance to view details and optimization tips
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
