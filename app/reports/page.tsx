"use client"

import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateReportData, generateComparativeReport, generateTextSummary } from "@/lib/report-utils"
import { USERS } from "@/lib/data"

export default function Reports() {
  const handleDownloadUserReport = (userId: string, format: "csv" | "json" | "txt") => {
    const reportData = generateReportData(userId)

    if (format === "json") {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `report-${userId}-${new Date().toISOString().split("T")[0]}.json`
      a.click()
    } else if (format === "txt") {
      const textSummary = generateTextSummary(userId)
      const blob = new Blob([textSummary], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `report-${userId}-${new Date().toISOString().split("T")[0]}.txt`
      a.click()
    }
  }

  const handleDownloadComparativeReport = () => {
    const report = generateComparativeReport()
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `comparative-report-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Report Generation</h1>
          <p className="text-muted-foreground">Download detailed analytics reports in multiple formats</p>
        </div>

        {/* Comparative Report */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Comparative Analysis Report</h2>
              <p className="text-muted-foreground">Compare all users performance and track team progress</p>
            </div>
            <Button onClick={handleDownloadComparativeReport} className="bg-primary hover:bg-primary/90">
              Download Report
            </Button>
          </div>
        </Card>

        {/* Individual User Reports */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Individual User Reports</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {USERS.map((user) => (
              <Card key={user.user_id} className="p-6 border-primary/20">
                <h3 className="text-lg font-bold mb-4">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{user.email}</p>

                <div className="space-y-2 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Region</p>
                    <p className="font-semibold">{user.region}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Household Size</p>
                    <p className="font-semibold">{user.household_size}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Baseline</p>
                    <p className="font-semibold">{user.baseline_monthly_kgCO2} kg CO₂</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => handleDownloadUserReport(user.user_id, "json")}
                    className="w-full bg-primary hover:bg-primary/90 text-sm"
                  >
                    JSON Report
                  </Button>
                  <Button
                    onClick={() => handleDownloadUserReport(user.user_id, "txt")}
                    className="w-full bg-secondary hover:bg-secondary/90 text-sm"
                  >
                    Text Report
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Report Documentation */}
        <Card className="p-6 border-primary/20 bg-muted/30">
          <h3 className="font-bold mb-3">Report Formats</h3>
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-semibold text-foreground">JSON Format</p>
              <p className="text-muted-foreground">
                Complete structured data with all metrics and calculations for programmatic analysis
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Text Format</p>
              <p className="text-muted-foreground">Human-readable summary with key metrics and insights</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Comparative Report</p>
              <p className="text-muted-foreground">
                Team-wide analysis comparing all users and tracking collective impact
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
