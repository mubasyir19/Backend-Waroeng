import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  create(createUnitDto: CreateUnitDto) {
    return 'This action adds a new unit';
  }

  async findAll() {
    try {
      const units = await this.prisma.unit.findMany();

      return {
        code: 'SUCCESS',
        message: 'Successfully get unit',
        data: units,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get units',
        data: `${error}`,
      });
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.unit.findFirst({
        where: {
          id,
        },
      });

      return {
        code: 'SUCCESS',
        message: 'Successfully get unit',
        data: data,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get unit',
        data: `${error}`,
      });
    }
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return `This action updates a #${id} unit`;
  }

  remove(id: number) {
    return `This action removes a #${id} unit`;
  }
}
