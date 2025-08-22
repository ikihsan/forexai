"use client"

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Bot, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  Clock, 
  Award,
  ChevronRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Bot,
    title: "Advanced AI Models",
    description: "Our proprietary AI algorithms analyze market patterns, news sentiment, and technical indicators to provide accurate trading predictions.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: TrendingUp,
    title: "Real-Time Analytics",
    description: "Get live market data, advanced charting tools, and real-time performance tracking to make informed trading decisions.",
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Your funds and data are protected with enterprise-level security, encryption, and regulatory compliance.",
    color: "text-info",
    bgColor: "bg-info/10"
  },
  {
    icon: Zap,
    title: "Lightning Fast Execution",
    description: "Execute trades in milliseconds with our high-performance infrastructure and direct broker integrations.",
    color: "text-warning",
    bgColor: "bg-warning/10"
  },
  {
    icon: BarChart3,
    title: "Professional Charts",
    description: "Access advanced candlestick charts, technical indicators, and drawing tools used by professional traders.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    icon: Users,
    title: "Community Insights",
    description: "Learn from experienced traders, share strategies, and get insights from our thriving trading community.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10"
  }
]

const stats = [
  {
    icon: Award,
    value: "85%",
    label: "Average Success Rate",
    description: "Our AI models maintain consistent profitability"
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Market Monitoring",
    description: "Round-the-clock analysis and alerts"
  },
  {
    icon: Users,
    value: "15K+",
    label: "Active Traders",
    description: "Growing community of successful traders"
  },
  {
    icon: TrendingUp,
    value: "$2.5M+",
    label: "Monthly Volume",
    description: "Trusted by traders worldwide"
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary mb-6"
          >
            <Zap className="h-4 w-4" />
            Platform Features
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold gradient-text mb-6"
          >
            Everything You Need to
            <br />
            <span className="text-primary">Trade Like a Pro</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Our comprehensive platform combines cutting-edge AI technology with professional trading tools 
            to give you the edge in the forex market.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-border/50 hover:border-primary/20">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                  Learn more
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl" />
          <div className="relative p-8 md:p-12">
            <div className="text-center mb-12">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Trusted by Traders Worldwide
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-muted-foreground text-lg"
              >
                Join thousands of successful traders who trust our platform
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="font-semibold mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Trading?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our platform today and experience the power of AI-driven forex trading. 
            Start with our free tier or upgrade to premium for advanced features.
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            Get Started Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
