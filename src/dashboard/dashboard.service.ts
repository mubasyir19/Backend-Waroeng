import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async dashboardData() {
    try {
      const revenue = await this.prisma.order.aggregate({
        _sum: {
          totalPrice: true,
        },
      });

      const totalDishOrdered = await this.prisma.orderItem.aggregate({
        _sum: {
          quantity: true,
        },
      });

      // jumlah customer diambil dari jumlah order yang ada
      // karena tiap order diatas namakan 1 customer
      const totalOrder = await this.prisma.order.findMany();

      return {
        code: 'SUCCESS',
        message: 'Successfully get dashboard stats',
        data: {
          totalRevenue: revenue._sum.totalPrice ?? 0,
          totalDishOrdered: totalDishOrdered._sum.quantity ?? 0,
          totalOrder: totalOrder.length,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get most order product',
        data: `${error}`,
      });
    }
  }

  async statiticsCategory() {
    try {
      const categoryStats = await this.prisma.category.findMany({
        select: {
          id: true,
          name: true,
          products: {
            select: {
              orderItems: {
                select: { quantity: true },
              },
            },
          },
        },
      });

      const result = categoryStats.map((cat) => ({
        category: cat.name,
        totalOrdered: cat.products.reduce((acc, product) => {
          const qty = product.orderItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          return acc + qty;
        }, 0),
      }));

      return {
        code: 'SUCCESS',
        message: 'Successfully get dashboard stats',
        data: result,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get statistics category',
        data: `${error}`,
      });
    }
  }
}
