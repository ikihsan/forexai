import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { ContactSection } from '@/components/landing/contact-section'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Ensure hash navigation works when landing directly on /#section */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try { if (location.hash) {
                const el = document.getElementById(location.hash.slice(1));
                el && el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }} catch {}
            `,
          }}
        />
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
