"use client"

import { motion } from 'framer-motion'
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  MapPin,
  TrendingUp,
  Shield,
  Users,
  ArrowUp
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'AI Models', href: '#ai-models' },
      { name: 'Trading Tools', href: '#tools' },
      { name: 'Mobile App', href: '#mobile' },
      { name: 'API', href: '#api' }
    ]
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
      { name: 'Partners', href: '/partners' },
      { name: 'Investors', href: '/investors' }
    ]
  },
  support: {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Community', href: '/community' },
      { name: 'Status', href: '/status' },
      { name: 'Security', href: '/security' }
    ]
  },
  legal: {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' },
      { name: 'Compliance', href: '/compliance' },
      { name: 'Licenses', href: '/licenses' }
    ]
  }
}

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' }
]

const trustBadges = [
  { icon: Shield, text: 'SEC Regulated' },
  { icon: Users, text: '15K+ Traders' },
  { icon: TrendingUp, text: '85% Success Rate' }
]

export function Footer() {
  const { success, error } = useToast()
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      error("Please enter a valid email address", "Invalid Email")
      return
    }
    
    // Simulate newsletter subscription
    success("Welcome aboard! You'll receive our latest market insights.", "Successfully Subscribed")
    setEmail('')
    setIsSubscribed(true)
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-background border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated with Market Insights
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get exclusive trading tips, market analysis, and AI predictions delivered 
              to your inbox. Join thousands of successful traders.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" disabled={isSubscribed}>
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </form>
            
            <p className="text-xs text-muted-foreground mt-4">
              No spam. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">ForexAI</span>
            </div>
            
            <p className="text-muted-foreground mb-6 max-w-sm">
              Empowering traders worldwide with cutting-edge AI technology and professional-grade 
              tools for forex trading success.
            </p>
            
            {/* Trust Badges */}
            <div className="space-y-3 mb-6">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3">
                  <badge.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@forexai.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>New York, NY 10001</span>
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground"
            >
              © 2024 ForexAI. All rights reserved.
            </motion.div>
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 bg-muted hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors group"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </motion.div>
            
            {/* Back to Top */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={scrollToTop}
                className="gap-2"
              >
                <ArrowUp className="h-4 w-4" />
                Back to Top
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Risk Disclaimer */}
      <div className="bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-xs text-muted-foreground text-center leading-relaxed"
          >
            <strong className="text-foreground">Risk Warning:</strong> Trading foreign exchange on margin carries a high level of risk 
            and may not be suitable for all investors. Past performance is not indicative of future results. 
            The high degree of leverage can work against you as well as for you.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
