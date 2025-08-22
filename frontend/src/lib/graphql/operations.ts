import { gql } from '@apollo/client'

// Authentication Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        isActive
        createdAt
      }
    }
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        isActive
        createdAt
      }
    }
  }
`

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`

// User Queries
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      firstName
      lastName
      isActive
      createdAt
      updatedAt
    }
  }
`

// Trading Queries
export const GET_USER_TRADES = gql`
  query GetUserTrades($limit: Int, $status: String) {
    getUserTrades(limit: $limit, status: $status) {
      id
      forexPair
      tradeType
      amount
      entryPrice
      exitPrice
      profitLoss
      commission
      status
      openedAt
      closedAt
      createdAt
    }
  }
`

export const CREATE_TRADE = gql`
  mutation CreateTrade($input: CreateTradeInput!) {
    createTrade(input: $input) {
      id
      forexPair
      tradeType
      amount
      entryPrice
      status
      createdAt
    }
  }
`

// Market Data Queries
export const GET_MARKET_DATA = gql`
  query GetMarketData($forexPair: String!, $limit: Int, $timeframe: String) {
    getMarketData(forexPair: $forexPair, limit: $limit, timeframe: $timeframe) {
      timestamp
      open
      high
      low
      close
      volume
    }
  }
`

// AI Predictions Query
export const GET_AI_PREDICTIONS = gql`
  query GetAIPrediction($forexPair: String!, $modelType: String) {
    getAIPrediction(forexPair: $forexPair, modelType: $modelType) {
      prediction
      confidence
      reasoning
      targetPrice
      stopLoss
    }
  }
`

// Subscription Mutations
export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($priceId: String!) {
    createSubscription(priceId: $priceId) {
      subscriptionId
      clientSecret
      status
    }
  }
`

export const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription {
    cancelSubscription
  }
`

export const GET_CURRENT_SUBSCRIPTION = gql`
  query GetCurrentSubscription {
    getCurrentSubscription {
      id
      status
      plan
      stripeCustomerId
      stripeSubscriptionId
      currentPeriodStart
      currentPeriodEnd
      cancelAtPeriodEnd
    }
  }
`
