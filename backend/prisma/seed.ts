import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@forextrading.com' },
    update: {},
    create: {
      email: 'admin@forextrading.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create test users
  const userPassword = await bcrypt.hash('user123', 10);
  const testUser1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      password: userPassword,
      role: 'USER',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  const testUser2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      username: 'janesmith',
      firstName: 'Jane',
      lastName: 'Smith',
      password: userPassword,
      role: 'USER',
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Create forex pairs
  const forexPairs = [
    { symbol: 'EURUSD', name: 'Euro/US Dollar', baseCurrency: 'EUR', quoteCurrency: 'USD', spread: 0.00015 },
    { symbol: 'GBPUSD', name: 'British Pound/US Dollar', baseCurrency: 'GBP', quoteCurrency: 'USD', spread: 0.00020 },
    { symbol: 'USDJPY', name: 'US Dollar/Japanese Yen', baseCurrency: 'USD', quoteCurrency: 'JPY', spread: 0.00018 },
    { symbol: 'AUDUSD', name: 'Australian Dollar/US Dollar', baseCurrency: 'AUD', quoteCurrency: 'USD', spread: 0.00022 },
    { symbol: 'USDCAD', name: 'US Dollar/Canadian Dollar', baseCurrency: 'USD', quoteCurrency: 'CAD', spread: 0.00025 },
  ];

  for (const pair of forexPairs) {
    await prisma.forexPair.upsert({
      where: { symbol: pair.symbol },
      update: {},
      create: pair,
    });
  }

  // Create sample subscriptions
  await prisma.subscription.upsert({
    where: { userId: testUser1.id },
    update: {},
    create: {
      userId: testUser1.id,
      stripeCustomerId: 'cus_test_john',
      stripeSubscriptionId: 'sub_test_john',
      stripePriceId: 'price_premium',
      status: 'ACTIVE',
      plan: 'PREMIUM',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  await prisma.subscription.upsert({
    where: { userId: testUser2.id },
    update: {},
    create: {
      userId: testUser2.id,
      stripeCustomerId: 'cus_test_jane',
      stripeSubscriptionId: 'sub_test_jane',
      stripePriceId: 'price_premium_plus',
      status: 'ACTIVE',
      plan: 'PREMIUM_PLUS',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  // Create sample trades
  const sampleTrades = [
    {
      userId: testUser1.id,
      forexPair: 'EURUSD',
      tradeType: 'BUY',
      amount: 1000,
      entryPrice: 1.0850,
      exitPrice: 1.0920,
      status: 'CLOSED',
      aiModelUsed: 'model_a_v1.0',
      profitLoss: 70,
      commission: 20,
      openedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      closedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      userId: testUser2.id,
      forexPair: 'GBPUSD',
      tradeType: 'SELL',
      amount: 1500,
      entryPrice: 1.2650,
      exitPrice: 1.2580,
      status: 'CLOSED',
      aiModelUsed: 'model_b_v1.0',
      profitLoss: 105,
      commission: 30,
      openedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      closedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const trade of sampleTrades) {
    const createdTrade = await prisma.trade.create({
      data: {
        user: { connect: { id: trade.userId } },
        forexPair: trade.forexPair,
        tradeType: trade.tradeType as any,
        amount: new Prisma.Decimal(trade.amount),
        entryPrice: new Prisma.Decimal(trade.entryPrice),
        exitPrice: trade.exitPrice !== undefined && trade.exitPrice !== null ? new Prisma.Decimal(trade.exitPrice) : undefined,
        status: trade.status as any,
        aiModelUsed: trade.aiModelUsed,
        profitLoss: trade.profitLoss !== undefined && trade.profitLoss !== null ? new Prisma.Decimal(trade.profitLoss) : undefined,
        commission: new Prisma.Decimal(trade.commission),
        openedAt: trade.openedAt,
        closedAt: trade.closedAt,
      },
    });

    // Create commission log for the trade
    await prisma.commissionLog.create({
      data: {
        userId: trade.userId,
        tradeId: createdTrade.id,
        commissionAmount: trade.commission,
        commissionRate: 0.02,
      },
    });
  }

  // Create AI model performance data
  const performanceData = [
    {
      modelName: 'model_a',
      modelVersion: 'v1.0',
      forexPair: 'EURUSD',
      totalPredictions: 100,
      correctPredictions: 72,
      successRate: 0.72,
      avgProfitLoss: 25.50,
      periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
    },
    {
      modelName: 'model_b',
      modelVersion: 'v1.0',
      forexPair: 'GBPUSD',
      totalPredictions: 85,
      correctPredictions: 68,
      successRate: 0.80,
      avgProfitLoss: 32.75,
      periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(),
    },
  ];

  for (const performance of performanceData) {
    await prisma.aIModelPerformance.create({
      data: performance,
    });
  }

  // Create sample market data
  const now = new Date();
  const marketData = [];
  
  for (let i = 0; i < 100; i++) {
    const timestamp = new Date(now.getTime() - i * 60 * 1000); // Every minute for last 100 minutes
    const basePrice = 1.0850 + (Math.random() - 0.5) * 0.01;
    
    marketData.push({
      forexPair: 'EURUSD',
      open: basePrice,
      high: basePrice + Math.random() * 0.002,
      low: basePrice - Math.random() * 0.002,
      close: basePrice + (Math.random() - 0.5) * 0.001,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      timestamp,
      timeframe: '1m',
    });
  }

  for (const data of marketData) {
    await prisma.marketData.create({
      data,
    });
  }

  console.log('Database seeded successfully!');
  console.log(`Created admin user: ${admin.email}`);
  console.log(`Created test users: ${testUser1.email}, ${testUser2.email}`);
  console.log(`Created ${forexPairs.length} forex pairs`);
  console.log(`Created ${sampleTrades.length} sample trades`);
  console.log(`Created ${performanceData.length} AI model performance records`);
  console.log(`Created ${marketData.length} market data points`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
