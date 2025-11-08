"use client"

import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: "/how-it-works", label: "How it Works" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analytics", label: "Analytics" },
    { href: "/insights", label: "Insights" },
    { href: "/reports", label: "Reports" },
    { href: "/actions", label: "Actions" },
    { href: "/rewards", label: "Rewards" },
    { href: "/energy", label: "Energy" },
    { href: "/appliances", label: "Appliances" },
    { href: "/energy-reports", label: "Energy Reports" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          CarbonAI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center text-sm overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-4 py-3 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 hover:text-primary transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
