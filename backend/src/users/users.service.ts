import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user as User;
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      username?: string;
      avatar?: string;
    },
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return user as User;
  }

  async getUserStats(userId: string) {
    const [totalTrades, activeTrades, totalCommissions, totalProfitLoss] = await Promise.all([
      this.prisma.trade.count({
        where: { userId },
      }),
      this.prisma.trade.count({
        where: { userId, status: 'OPEN' },
      }),
      this.prisma.commissionLog.aggregate({
        where: { userId },
        _sum: { commissionAmount: true },
      }),
      this.prisma.trade.aggregate({
        where: { userId, status: 'CLOSED' },
        _sum: { profitLoss: true },
      }),
    ]);

    return {
      totalTrades,
      activeTrades,
      totalCommissions: Number(totalCommissions._sum.commissionAmount || 0),
      totalProfitLoss: Number(totalProfitLoss._sum.profitLoss || 0),
    };
  }
}
