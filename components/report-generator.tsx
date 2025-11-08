"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserAnalytics, getComparisonAnalytics } from "@/lib/analytics"

interface ReportGeneratorProps {
  userId: string
  format: "pdf" | "image" | "html"
}

export async function generatePDFReport(userId: string) {
  const analytics = getUserAnalytics(userId)
  const timestamp = new Date().toLocaleDateString()

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Carbon Footprint Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        h1 { color: #10b981; }
        h2 { color: #059669; margin-top: 20px; }
        .metric { display: inline-block; margin: 15px 20px 15px 0; }
        .metric-value { font-size: 24px; font-weight: bold; color: #10b981; }
        .metric-label { font-size: 12px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f0f9ff; }
        .section { page-break-inside: avoid; margin-bottom: 30px; }
      </style>
    </head>
    <body>
      <h1>Carbon Footprint Report</h1>
      <p>Generated on: ${timestamp}</p>

      <div class="section">
        <h2>Summary</h2>
        <div class="metric">
          <div class="metric-label">Current Month</div>
          <div class="metric-value">${analytics.currentMonthEmissions} kg</div>
        </div>
        <div class="metric">
          <div class="metric-label">Baseline</div>
          <div class="metric-value">${analytics.baselineMonthly} kg</div>
        </div>
        <div class="metric">
          <div class="metric-label">Total Saved</div>
          <div class="metric-value">${analytics.totalSaved} kg</div>
        </div>
        <div class="metric">
          <div class="metric-label">Reduction</div>
          <div class="metric-value">${Math.abs(analytics.percentageChange)}%</div>
        </div>
      </div>

      <div class="section">
        <h2>Category Breakdown</h2>
        <table>
          <tr>
            <th>Category</th>
            <th>Emissions (kg)</th>
            <th>Percentage</th>
          </tr>
          ${analytics.categoryBreakdown.map((cat) => `<tr><td>${cat.name}</td><td>${cat.value}</td><td>${cat.percentage}%</td></tr>`).join("")}
        </table>
      </div>

      <div class="section">
        <h2>Actions Completed</h2>
        <p>Total: ${analytics.actionsCompleted}</p>
        <p>Green Points Earned: ${analytics.totalPoints}</p>
      </div>

      <div class="section">
        <h2>30-Day Forecast</h2>
        <p>Projected Reduction: ${analytics.forecast30Days.reduction}%</p>
        <p>Estimated Monthly Emissions: ${analytics.forecast30Days.estimatedEmissions} kg</p>
      </div>

      <div class="section">
        <p style="color: #999; font-size: 12px;">This report is based on verified emission factors from DEFRA, IEA, and EPA.</p>
      </div>
    </body>
    </html>
  `

  const blob = new Blob([htmlContent], { type: "text/html" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `carbon-report-${userId}-${timestamp}.html`
  a.click()
}

export function ReportGenerator({ userId, format }: ReportGeneratorProps) {
  const analytics = getUserAnalytics(userId)
  const comparisonData = getComparisonAnalytics()

  const handleGenerateReport = async () => {
    if (format === "pdf" || format === "html") {
      await generatePDFReport(userId)
    }
  }

  return (
    <Card className="p-6 border-primary/20">
      <h2 className="text-xl font-bold mb-4">Generate Report</h2>
      <p className="text-sm text-muted-foreground mb-4">Create a detailed report of your carbon analytics</p>
      <Button onClick={handleGenerateReport} className="bg-primary hover:bg-primary/90">
        Download {format.toUpperCase()} Report
      </Button>
    </Card>
  )
}
