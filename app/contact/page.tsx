import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Contact() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Privacy Notice */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-8">Privacy & Legal</h1>

          <Card className="p-8 border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We collect only what users provide. Your data stays private and secure. You have the right to:</p>
              <ul className="space-y-2 ml-4">
                <li>• Download your complete data anytime</li>
                <li>• Delete your data permanently</li>
                <li>• Export your carbon history</li>
                <li>• Control data sharing preferences</li>
              </ul>
              <p className="mt-4">
                Emission factors are transparent and sourced from recognized bodies: IEA, DEFRA, and EPA.
              </p>
            </div>
          </Card>

          <Card className="p-8 border-primary/20 mb-8">
            <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>By using CarbonAI, you agree to:</p>
              <ul className="space-y-2 ml-4">
                <li>• Provide accurate information about your activities</li>
                <li>• Use the service for personal tracking only</li>
                <li>• Respect intellectual property rights</li>
                <li>• Not use the service for commercial purposes without permission</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="p-8 border-primary/20">
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-card border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-card border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-card border border-input focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tell us about your inquiry..."
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Send Message</Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold">hello@carbonai.com</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">GitHub</p>
              <p className="font-semibold">github.com/carbonai</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Follow Us</p>
              <p className="font-semibold">@CarbonAI_Coach</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
