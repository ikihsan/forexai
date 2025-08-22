"use client"

import { useAuth } from '@/hooks/use-auth'
import { useQuery } from '@apollo/client'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Users, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react'
import { GET_USER_TRADES, GET_MARKET_DATA, GET_AI_PREDICTIONS, GET_CURRENT_SUBSCRIPTION } from '@/lib/graphql/operations'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [authLoading, isAuthenticated, router])

  const { data: tradesData, loading: tradesLoading } = useQuery(GET_USER_TRADES, {
    variables: { limit: 10, offset: 0 },
    skip: !isAuthenticated
  })

  const { data: marketData, loading: marketLoading } = useQuery(GET_MARKET_DATA, {
    variables: { forexPair: 'EURUSD', limit: 20, timeframe: '1m' },
    skip: !isAuthenticated,
    pollInterval: 30000 // Poll every 30 seconds
  })

  const { data: predictionsData, loading: predictionsLoading } = useQuery(GET_AI_PREDICTIONS, {
    variables: { forexPair: 'EURUSD', modelType: 'model_a' },
    skip: !isAuthenticated
  })

  const { data: subscriptionData } = useQuery(GET_CURRENT_SUBSCRIPTION, {
    skip: !isAuthenticated
  })

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  const trades = tradesData?.getUserTrades || []
  const markets = marketData?.getMarketData || []
  const prediction = predictionsData?.getAIPrediction
  const subscription = subscriptionData?.getCurrentSubscription

  // Calculate portfolio stats
  const totalTrades = trades.length
  const profitableTrades = trades.filter((trade: any) => trade.profit > 0).length
  const totalProfit = trades.reduce((sum: number, trade: any) => sum + (trade.profit || 0), 0)
  const totalCommission = trades.reduce((sum: number, trade: any) => sum + (trade.commission || 0), 0)
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your trading portfolio today.
            </p>
            <div className="flex items-center gap-2 mt-2">
              {subscription && (
                <>
                  <Badge variant={subscription.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {subscription.plan} Plan
                  </Badge>
                  <Badge variant={subscription.status === 'ACTIVE' ? 'success' : 'destructive'}>
                    {subscription.status}
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${totalProfit.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Commission: ${totalCommission.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {winRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {profitableTrades}/{totalTrades} trades
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTrades}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">85%</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Market Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Live Market Data
                </CardTitle>
                <CardDescription>
                  Real-time forex prices and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {marketLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                        <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {markets.map((market: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">EURUSD</div>
                          <div className="text-sm text-muted-foreground">
                            O:{market.open} H:{market.high} L:{market.low} C:{market.close}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Vol: {market.volume}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Predictions
                </CardTitle>
                <CardDescription>
                  Latest AI-powered market predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {predictionsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <div className="h-4 bg-muted rounded w-24 animate-pulse mb-2" />
                        <div className="h-3 bg-muted rounded w-32 animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prediction && (
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">EURUSD</div>
                          <Badge variant="outline">
                            {Math.round(prediction.confidence * 100)}% confidence
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Prediction: <span className="text-foreground">{prediction.prediction}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          TP: {prediction.targetPrice} • SL: {prediction.stopLoss}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Trades */}
          <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Trades
                </CardTitle>
                <CardDescription>
                  Your latest trading activity
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Trade
              </Button>
            </CardHeader>
            <CardContent>
              {tradesLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                        <div className="h-3 bg-muted rounded w-32 animate-pulse" />
                      </div>
                      <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : trades.length > 0 ? (
                <div className="space-y-3">
                  {trades.map((trade: any) => (
                    <div key={trade.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{trade.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {trade.type} • ${trade.amount} • Entry: ${trade.entryPrice}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(trade.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.profit >= 0 ? '+' : ''}${trade.profit?.toFixed(2)}
                        </div>
                        <Badge variant={trade.status === 'COMPLETED' ? 'default' : 'secondary'}>
                          {trade.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">
                    No trades yet. Start trading to see your activity here.
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Make Your First Trade
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
