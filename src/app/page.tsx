import { Hero } from '@/components/landing/Hero'
import { About } from '@/components/landing/About'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Quote } from '@/components/landing/Quote'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Hero />
      <About />
      <HowItWorks />
      <Quote />
      <CTA />
      <Footer />
    </div>
  )
}
