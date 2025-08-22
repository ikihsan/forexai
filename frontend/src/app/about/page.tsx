"use client"

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Shield, 
  TrendingUp, 
  Users, 
  Award, 
  Zap,
  Brain,
  BarChart3,
  Globe,
  Lock,
  Sparkles,
  CheckCircle,
  User
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const stats = [
  { label: 'Active Traders', value: '10K+', icon: Users },
  { label: 'Successful Trades', value: '1M+', icon: TrendingUp },
  { label: 'AI Accuracy', value: '94%', icon: Brain },
  { label: 'Markets Covered', value: '50+', icon: Globe }
]

const features = [
  {
    icon: Brain,
    title: 'Advanced AI Models',
    description: 'Cutting-edge machine learning algorithms that analyze market patterns and predict forex movements with unprecedented accuracy.'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Live market data processing and instant trade analysis to help you make informed decisions at the right moment.'
  },
  {
    icon: Shield,
    title: 'Secure Trading',
    description: 'Bank-grade security with encrypted transactions and secure data storage to protect your investments and personal information.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Ultra-low latency execution ensures your trades are processed instantly without delays that could cost you profits.'
  },
  {
    icon: Award,
    title: 'Proven Results',
    description: 'Track record of consistent performance with transparent success rates and detailed historical analytics.'
  },
  {
    icon: Sparkles,
    title: 'Smart Automation',
    description: 'Automated trading strategies powered by AI that work 24/7 to capitalize on market opportunities.'
  }
]

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    description: 'Former Goldman Sachs quantitative analyst with 15 years in algorithmic trading.',
    image: '/images/team/sarah.jpg'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO & Co-Founder',
    description: 'Ex-Google AI researcher specializing in financial machine learning models.',
    image: '/images/team/marcus.jpg'
  },
  {
    name: 'Dr. Aisha Patel',
    role: 'Head of AI Research',
    description: 'PhD in Financial Engineering from MIT, published researcher in algorithmic trading.',
    image: '/images/team/aisha.jpg'
  },
  {
    name: 'James Liu',
    role: 'Head of Security',
    description: 'Cybersecurity expert with background in fintech and blockchain security.',
    image: '/images/team/james.jpg'
  }
]

const milestones = [
  { year: '2020', title: 'Company Founded', description: 'Started with a vision to democratize AI-powered trading' },
  { year: '2021', title: 'First AI Model', description: 'Launched our proprietary forex prediction algorithm' },
  { year: '2022', title: 'Series A Funding', description: 'Raised $15M to expand our AI capabilities' },
  { year: '2023', title: '10K Users', description: 'Reached 10,000 active traders on the platform' },
  { year: '2024', title: 'Global Expansion', description: 'Expanded to 50+ forex markets worldwide' }
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Badge className="mb-4" variant="secondary">
                About ForexAI Pro
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Revolutionizing Forex Trading with AI
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                We're on a mission to democratize sophisticated trading strategies through cutting-edge artificial intelligence, 
                making professional-grade forex trading accessible to everyone.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  Traditional forex trading has been dominated by institutional players with access to sophisticated tools and data. 
                  We believe that with the right AI technology, individual traders can compete on an equal footing. Our platform 
                  combines institutional-grade analytics with user-friendly design to give everyone the power of professional trading.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="p-2 bg-primary/10 rounded-lg w-fit mb-2">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Journey</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From a small startup to a leading fintech platform, here's how we've grown and evolved.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-8 mb-12 ${
                    index % 2 === 1 ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className="flex-1">
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{milestone.year}</Badge>
                        <h3 className="text-xl font-semibold">{milestone.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </Card>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 bg-primary rounded-full"></div>
                  </div>
                  <div className="flex-1 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our team combines decades of experience in finance, technology, and artificial intelligence.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center p-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-primary text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These core principles guide everything we do and shape our commitment to our users.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Transparency',
                  description: 'We believe in complete transparency with our AI predictions, success rates, and fee structure.',
                  icon: CheckCircle
                },
                {
                  title: 'Innovation',
                  description: 'Continuous research and development to stay at the forefront of AI trading technology.',
                  icon: Sparkles
                },
                {
                  title: 'Security',
                  description: 'Your financial data and investments are protected with the highest security standards.',
                  icon: Lock
                }
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center p-8 h-full">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Your Trading Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of traders who are already using AI to maximize their forex trading success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/register">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
