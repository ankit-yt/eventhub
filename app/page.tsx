import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Sparkles, Users, Zap, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Announcement Banner */}
      <div className="bg-accent/10 border-b border-accent/20 py-3 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-accent-foreground">
          <span className="font-semibold">New:</span> Join 5,000+ students discovering events on campus
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            EventHub
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold text-foreground text-balance leading-tight">
                Never Miss Out on Campus Life
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Discover amazing events happening around your campus. From workshops to parties, find what excites you
                and connect with your community.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/events">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto"
                >
                  Explore Events
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Get Started Free
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">5K+</div>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">500+</div>
                <p className="text-sm text-muted-foreground">Events Monthly</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">98%</div>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Tech Meetup - Tomorrow 6PM</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Networking Mixer - Friday</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Startup Pitch Night - Next Week</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Career Fair - 2 Weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card/50 py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4 text-balance">Why Students Love EventHub</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay connected and never miss out on campus events
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Smart Discovery</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI-powered recommendations based on your interests. Find events you'll actually want to attend.
              </p>
            </Card>
            <Card className="p-8 border border-border hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Instant Registration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Register for events in seconds. Get instant confirmations and event reminders sent to your phone.
              </p>
            </Card>
            <Card className="p-8 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Community First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with fellow students, make new friends, and build your network on campus.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">5K+</div>
            <p className="text-muted-foreground">Students Registered</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-accent mb-2">500+</div>
            <p className="text-muted-foreground">Events This Month</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">50+</div>
            <p className="text-muted-foreground">Campus Partners</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-accent mb-2">98%</div>
            <p className="text-muted-foreground">User Satisfaction</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 text-balance">
            Ready to Join the Community?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 text-pretty">
            Sign up now and discover events happening on your campus. It's free and takes less than a minute.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-lg">EventHub</h4>
              <p className="text-muted-foreground text-sm">Connecting students through amazing events.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
