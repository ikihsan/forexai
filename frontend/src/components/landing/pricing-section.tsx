"use client"

import { motion } from 'framer-motion'
import { Check, Star, Zap, Crown, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for beginners to explore forex trading',
    features: [
      'Basic market data access',
      'Simple trading charts',
      'Educational resources',
      'Community forum access',
      'Basic AI insights (limited)',
      'Email support'
    ],
    limitations: [
      'Limited to 5 trades per month',
      'Basic AI model only',
      'No real-time alerts',
      'Standard support'
    ],
    buttonText: 'Start Free',
    buttonVariant: 'outline',
    popular: false,
    icon: Star,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$29',
    period: 'month',
    description: 'Advanced AI trading with professional tools',
    features: [
      'AI Model A (Standard) predictions',
      'Real-time market data',
      'Advanced charting tools',
      'Unlimited trades',
      'Real-time alerts & notifications',
      'Priority support',
      'Risk management tools',
      'Performance analytics',
      '2% commission on profits'
    ],
    buttonText: 'Start Premium',
    buttonVariant: 'default',
    popular: true,
    icon: Zap,
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  {
    id: 'premium-plus',
    name: 'Premium Plus',
    price: '$79',
    period: 'month',
    description: 'Maximum AI power with exclusive features',
    features: [
      'AI Model B (Advanced) predictions',
      'Everything in Premium',
      'Advanced AI algorithms',
      'Custom trading strategies',
      'API access for automation',
      'Dedicated account manager',
      'White-label solutions',
      'Advanced risk analytics',
      'Priority execution',
      '1.5% commission on profits'
    ],
    buttonText: 'Go Premium Plus',
    buttonVariant: 'default',
    popular: false,
    icon: Crown,
    color: 'text-warning',
    bgColor: 'bg-warning/10'
  }
]

export function PricingSection() {
  return (
  <section id="pricing" className="py-24 bg-muted/30">
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
            <Sparkles className="h-4 w-4" />
            Pricing Plans
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold gradient-text mb-6"
          >
            Choose Your
            <br />
            <span className="text-primary">Trading Plan</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Start free and upgrade as you grow. All plans include our core trading platform 
            with different levels of AI intelligence and features.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}
              
              <Card className={`p-8 h-full ${plan.popular ? 'border-primary/50 shadow-lg scale-105' : 'border-border/50'} hover:shadow-xl transition-all duration-300`}>
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${plan.bgColor} mb-4`}>
                    <plan.icon className={`h-8 w-8 ${plan.color}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations && (
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">Limitations:</p>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start gap-3 mb-2">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full flex-shrink-0 mt-2" />
                          <span className="text-xs text-muted-foreground leading-relaxed">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.buttonVariant as "default" | "outline"}
                  size="lg"
                  asChild
                >
                  <Link href="/auth/register">
                    {plan.buttonText}
                  </Link>
                </Button>
                
                {plan.id !== 'free' && (
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    30-day money-back guarantee
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Models Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <Card className="p-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                AI Model Comparison
              </h3>
              <p className="text-muted-foreground">
                Understand the difference between our AI models
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-3">AI Model A (Standard)</h4>
                <p className="text-muted-foreground mb-4">
                  Our proven AI model with 85% accuracy rate, perfect for most traders.
                </p>
                <ul className="text-sm space-y-2">
                  <li>• Technical analysis focus</li>
                  <li>• Market trend predictions</li>
                  <li>• Risk assessment</li>
                  <li>• Entry/exit signals</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 mb-4">
                  <Crown className="h-8 w-8 text-warning" />
                </div>
                <h4 className="text-xl font-semibold mb-3">AI Model B (Advanced)</h4>
                <p className="text-muted-foreground mb-4">
                  Our most sophisticated AI with 92% accuracy, using advanced algorithms.
                </p>
                <ul className="text-sm space-y-2">
                  <li>• Everything in Model A</li>
                  <li>• Sentiment analysis</li>
                  <li>• News impact prediction</li>
                  <li>• Multi-timeframe analysis</li>
                  <li>• Custom strategy creation</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Questions? We've Got Answers
          </h3>
          <p className="text-muted-foreground mb-8">
            Can't find what you're looking for? Contact our support team.
          </p>
          <Button variant="outline" size="lg">
            View FAQ
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
