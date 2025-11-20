import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStoreDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.owner_id },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new BadRequestException('User tidak ditemukan');
      }

      if (user.role !== 'OWNER') {
        throw new BadRequestException(
          'Hanya user dengan role OWNER yang dapat membuat store',
        );
      }

      const existingStore = await this.prisma.store.findUnique({
        where: { owner_id: dto.owner_id },
      });

      if (existingStore) {
        throw new ConflictException('User OWNER sudah memiliki store');
      }

      const res = await this.prisma.store.create({
        data: dto,
      });

      return {
        code: 'SUCCESS',
        message: 'Successfully add data store',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed add data store',
        data: `${error}`,
      });
    }
  }

  async findStore() {
    try {
      const res = await this.prisma.store.findFirst({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!res) {
        return {
          code: 'NOT_FOUND',
          message: 'Data store not found',
          data: null,
        };
      }

      return {
        code: 'SUCCESS',
        message: 'Successfully get data store',
        data: res,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get data store',
        data: `${error}`,
      });
    }
  }

  async update(id: string, dto: UpdateStoreDto) {
    try {
      if (dto.owner_id) {
        const user = await this.prisma.user.findFirst({
          where: { id: dto.owner_id },
          select: { id: true, role: true },
        });

        if (!user || user.role !== 'OWNER') {
          throw new BadRequestException(
            'Hanya user dengan role OWNER yang dapat menjadi pemilik store',
          );
        }

        // Cek apakah user tujuan sudah memiliki store
        const existingStore = await this.prisma.store.findUnique({
          where: { owner_id: dto.owner_id },
        });

        if (existingStore && existingStore.id !== id) {
          throw new ConflictException('User OWNER sudah memiliki store lain');
        }
      }

      const updateData = await this.prisma.store.update({
        where: {
          id,
        },
        data: dto,
      });

      return {
        code: 'SUCCESS',
        message: 'Successfully update data store',
        data: updateData,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed add data store',
        data: `${error}`,
      });
    }
  }
}
