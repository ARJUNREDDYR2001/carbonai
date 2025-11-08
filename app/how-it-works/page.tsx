import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"

export default function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Data Collection",
      desc: "We collect your commute type, meals, device usage, electricity patterns, and calendar events. All data stays private and secure.",
      icon: "📊",
    },
    {
      num: "2",
      title: "Carbon Estimation",
      desc: "Our engine maps activities to CO₂ using verified emission factors from IEA, DEFRA, and EPA.",
      icon: "🔬",
    },
    {
      num: "3",
      title: "Personalization",
      desc: "AI learns your habits and adapts recommendations based on your feedback and schedule.",
      icon: "🤖",
    },
    {
      num: "4",
      title: "Action Prioritization",
      desc: "We rank actions by impact × friction, suggesting achievable wins first.",
      icon: "⚡",
    },
    {
      num: "5",
      title: "Behavior Reinforcement",
      desc: "Complete actions, earn points, unlock badges, and track progress toward goals.",
      icon: "🏆",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How It Works</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered system learns your habits and recommends personalized micro-actions to reduce your carbon
            footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {steps.map((step, i) => (
            <Card
              key={i}
              className="p-6 relative border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                {step.num}
              </div>
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </Card>
          ))}
        </div>

        {/* Architecture Diagram Text */}
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <h2 className="text-2xl font-bold mb-4">System Architecture</h2>
          <div className="space-y-4 text-sm text-muted-foreground font-mono">
            <p>Web UI (React) ↔ API Layer ↔ Agent Service ↔ ML Models ↔ Emission Factor Database</p>
            <p className="pt-2 text-foreground">
              <span className="text-primary font-semibold">Optional Connectors:</span> Google Fit, Apple Health,
              Calendar, Mobility API, Smart Meter (CSV upload)
            </p>
          </div>
        </Card>

        {/* Privacy & Data */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 border-secondary/20">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>🔒</span> Privacy First
            </h3>
            <p className="text-muted-foreground">
              We collect only what you provide. Your data stays on your device or encrypted on our servers. Download or
              delete anytime.
            </p>
          </Card>
          <Card className="p-6 border-accent/20">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <span>📈</span> Transparent Estimation
            </h3>
            <p className="text-muted-foreground">
              All emission factors are sourced from recognized bodies. Tooltips explain every estimate. We're committed
              to accuracy.
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}
