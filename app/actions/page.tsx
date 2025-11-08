"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ACTIONS_CATALOG = [
  {
    id: "A001",
    title: "Walk or cycle for short commutes",
    category: "commute",
    saved: 0.9,
    friction: "low",
    duration: 15,
    tags: ["health", "zero-cost"],
  },
  {
    id: "A002",
    title: "Switch one meat meal to plant-based",
    category: "diet",
    saved: 3.3,
    friction: "medium",
    duration: 20,
    tags: ["food", "groceries"],
  },
  {
    id: "A003",
    title: "Delay AC by 1° and use fan",
    category: "energy",
    saved: 0.4,
    friction: "low",
    duration: 60,
    tags: ["comfort", "savings"],
  },
  {
    id: "A004",
    title: "Turn off lights and use LED bulbs",
    category: "energy",
    saved: 0.15,
    friction: "low",
    duration: 10,
    tags: ["energy", "home"],
  },
  {
    id: "A005",
    title: "Unplug devices when not in use",
    category: "device",
    saved: 0.08,
    friction: "low",
    duration: 5,
    tags: ["device", "energy"],
  },
  {
    id: "A006",
    title: "Take public transport 2x per week",
    category: "commute",
    saved: 2.1,
    friction: "medium",
    duration: 30,
    tags: ["commute", "health"],
  },
]

const CATEGORIES = ["All", "Commute", "Diet", "Energy", "Device"]

const FRICTION_COLORS = {
  low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export default function Actions() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filtered = ACTIONS_CATALOG.filter(
    (a) => selectedCategory === "All" || a.category.toLowerCase() === selectedCategory.toLowerCase(),
  )

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Actions Library</h1>
          <p className="text-muted-foreground">
            Browse our catalog of verified micro-actions to reduce your carbon footprint
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((action) => (
            <Card
              key={action.id}
              className="p-6 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{action.title}</h3>
                  <p className="text-xs text-muted-foreground capitalize mt-1">{action.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-muted p-3 rounded">
                  <p className="text-xs text-muted-foreground">CO₂ Saved/Day</p>
                  <p className="text-lg font-bold text-primary">{action.saved} kg</p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-lg font-bold">{action.duration} min</p>
                </div>
              </div>

              <div className="flex gap-2 items-center mb-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                    FRICTION_COLORS[action.friction as keyof typeof FRICTION_COLORS]
                  }`}
                >
                  {action.friction} friction
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {action.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Add to My Plan</Button>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
