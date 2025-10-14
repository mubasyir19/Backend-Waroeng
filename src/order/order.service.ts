import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma.service';

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

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
