import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async checkout(dto: CreateOrderDto) {
    try {
      const receiptCode = await this.generateReceiptCode();

      const res = await this.prisma.order.create({
        data: {
          waiterId: dto.waiterId,
          receipt_code: receiptCode,
          customer: dto.customer,
          orderType: dto.orderType,
          totalPrice: dto.totalPrice,
          status: 'PENDING',
          orderItems: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              note: item.note,
            })),
          },
        },
        include: { orderItems: true },
      });

      return {
        code: 'CREATED',
        message: 'Successfully checkout order',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed checkout order',
        data: `${error}`,
      });
    }
  }

  async findDetailOrder(orderId: string) {
    try {
      const res = await this.prisma.order.findFirst({
        where: {
          id: orderId,
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!res) {
        return {
          code: 'NOT_FOUND',
          message: 'Order not found',
          data: null,
        };
      }

      return {
        code: 'SUCCESS',
        message: 'Successfully get detail order',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed find order',
        data: `${error}`,
      });
    }
  }

  async updateStatusOrder(orderId: string, status: OrderStatus) {
    try {
      const checkData = await this.findDetailOrder(orderId);
      if (!checkData) {
        return {
          code: 'NOT_FOUND',
          message: 'Order not found',
          data: null,
        };
      }

      const res = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: status,
        },
      });

      return {
        code: 'UPDATED',
        message: 'Successfully update order status',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed checkout order',
        data: `${error}`,
      });
    }
  }

  async findAll(paginationDto?: PaginationDto) {
    try {
      const page = paginationDto?.page || 1;
      const limit = paginationDto?.limit || 10;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.order.findMany({
          include: {
            payment: true,
          },
          skip: skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.order.count(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        code: 'SUCCESS',
        message: 'Successfully get list order',
        data: data,
        meta: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: total,
          totalPages: totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get list order',
        data: `${error}`,
      });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async remove(id: string) {
    try {
      const res = await this.prisma.order.delete({
        where: { id },
      });

      return {
        code: 'DELETED',
        message: 'Successfully deleted order and related items',
        data: res,
      };
    } catch (error) {
      console.log('(backend) terjadi error hapus order:', error);
      throw new InternalServerErrorException({
        message: 'Failed to delete order',
        data: `${error}`,
      });
    }
  }

  private async generateReceiptCode(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const datePart = `${year}${month}${day}`;

    // Get sequence number untuk hari ini
    const sequence = await this.getTodaySequence();

    // Format: TRX-YYMMDD-001
    const sequenceStr = String(sequence).padStart(3, '0');

    return `TRX-${datePart}-${sequenceStr}`;
  }

  private async getTodaySequence(): Promise<number> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayOrdersCount = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return todayOrdersCount + 1;
  }
}
