import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async checkout(dto: CreateOrderDto) {
    try {
      const res = await this.prisma.order.create({
        data: {
          waiterId: dto.waiterId,
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

  async completePayment(orderId: string, dto: CreatePaymentDto) {
    try {
      const checkData = await this.findDetailOrder(orderId);
      if (!checkData) {
        return {
          code: 'NOT_FOUND',
          message: 'Order not found',
          data: null,
        };
      }

      const res = await this.prisma.payment.create({
        data: {
          orderId: dto.orderId,
          method: dto.method,
          provider: dto.provider,
          amount: dto.amount,
          paidAmount: dto.paidAmount,
          change: dto.change,
          referenceNo: dto.referenceNo,
          note: dto.note,
          status: 'SUCCESS',
        },
      });

      return {
        code: 'CREATED',
        message: 'Successfully complete payment order',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed complete payment',
        data: `${error}`,
      });
    }
  }

  findAll() {
    return `This action returns all order`;
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
}
