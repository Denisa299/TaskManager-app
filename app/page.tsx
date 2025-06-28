import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/landing/hero-section"
import { AboutSection } from "@/components/landing/about-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { BenefitsSection } from "@/components/landing/benefits-section"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingSidebar } from "@/components/landing/landing-sidebar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <div className="flex flex-1">
        <LandingSidebar />
        <main className="flex-1">
          <HeroSection />
          <AboutSection />
          <BenefitsSection />
          <PricingSection />
          <TestimonialsSection />
          <section className="container py-24 sm:py-32 bg-gradient-to-br from-green-50 to-blue-50">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Gata să începi?
              </h2>
              <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Încearcă TaskManager gratuit și descoperă cum poți gestiona proiectele mai eficient.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="btn-primary">
                    Înregistrează-te gratuit
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="border-green-200 text-green-700 hover:bg-green-50">
                    Autentificare
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
      <LandingFooter />
    </div>
  )
}
