import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Rewards() {
  const plans = [
    {
      name: "Free",
      price: "0",
      features: ["Dashboard & tracking", "10 actions/day", "CSV import", "5 GB data storage"],
      color: "from-primary/10 to-primary/5",
    },
    {
      name: "Pro",
      price: "9.99",
      features: ["API access", "Personalized reports", "Multi-device sync", "Priority support", "Weekly insights"],
      color: "from-secondary/10 to-secondary/5",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Company dashboards",
        "Department benchmarks",
        "Compliance exports",
        "Dedicated support",
        "Custom integrations",
      ],
      color: "from-accent/10 to-accent/5",
    },
  ]

  const badges = [
    { icon: "🌱", title: "Seedling", desc: "Complete 5 actions" },
    { icon: "🌿", title: "Sprout", desc: "Complete 25 actions" },
    { icon: "🌳", title: "Sapling", desc: "Complete 100 actions" },
    { icon: "🏔️", title: "Tree", desc: "Save 50 kg CO₂" },
    { icon: "🌲", title: "Guardian", desc: "Maintain 30-day streak" },
    { icon: "♻️", title: "Eco Hero", desc: "Save 200 kg CO₂" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Badges Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Achievements & Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((badge, i) => (
              <Card key={i} className="p-4 text-center border-primary/20 hover:border-primary/40 transition-all">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h3 className="font-bold text-sm">{badge.title}</h3>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Green Points */}
        <Card className="p-8 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 mb-16">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Green Points Marketplace</h2>
              <p className="text-muted-foreground">Earn points for each completed action and redeem for rewards</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-4xl font-bold text-emerald-600">320</p>
            </div>
          </div>
        </Card>

        {/* Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Plans & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <Card
                key={i}
                className={`p-8 border-primary/20 hover:shadow-lg transition-all ${
                  plan.highlight ? "ring-2 ring-primary scale-105" : ""
                } bg-gradient-to-br ${plan.color}`}
              >
                {plan.highlight && (
                  <div className="mb-4 inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">${plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-sm text-muted-foreground">/month</span>}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Marketplace Preview */}
        <Card className="p-8 border-primary/20">
          <h2 className="text-2xl font-bold mb-6">Rewards You Can Unlock</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { reward: "Coffee Voucher", points: 50, emoji: "☕" },
              { reward: "Reusable Bottle", points: 100, emoji: "🧴" },
              { reward: "Tree Donation", points: 200, emoji: "🌱" },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-muted rounded-lg text-center">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="font-semibold mb-1">{item.reward}</p>
                <p className="text-sm text-muted-foreground">{item.points} GreenPoints</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
