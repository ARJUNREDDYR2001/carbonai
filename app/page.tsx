import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/navbar"

export default function Home() {
  const metrics = [
    { label: "Avg CO₂ saved/month", value: "2.3 kg" },
    { label: "Actions completed today", value: "47" },
    { label: "Reduction if followed", value: "-12%" },
  ]

  const features = [
    { icon: "🎯", title: "Personalized suggestions", desc: "AI learns your habits" },
    { icon: "📊", title: "Predictive carbon forecast", desc: "See your impact ahead" },
    { icon: "⚡", title: "Micro-action library", desc: "1000+ tiny wins" },
    { icon: "🔒", title: "Privacy-first analytics", desc: "Your data, your control" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Navbar />

      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold text-primary">AI Carbon Coach</p>
            <h1 className="text-5xl sm:text-6xl font-bold text-balance">
              Your personal carbon coach.
              <br />
              <span className="text-primary">Small changes, big impact.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI Carbon Lifestyle Planner learns your habits and recommends 3 micro-actions daily that reduce your
              carbon footprint with minimal effort.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Free Demo
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch 90s Demo →
            </Button>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, i) => (
            <Card key={i} className="p-6 text-center border-primary/20 hover:border-primary/40 transition-colors">
              <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
              <p className="text-3xl font-bold text-primary">{metric.value}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Strip */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="p-4 rounded-lg bg-card hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Email CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Get early access</h2>
            <p className="text-muted-foreground">Download your carbon baseline and track your journey.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-lg bg-card border border-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary hover:bg-primary/90">Join</Button>
            </div>
          </div>
        </Card>
      </section>
    </main>
  )
}
