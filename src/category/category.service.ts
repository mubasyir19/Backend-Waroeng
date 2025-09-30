import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany({
        include: { products: true },
      });

      if (categories.length === 0) {
        return {
          code: 'SUCCESS',
          message: 'Empty data',
          data: null,
        };
      }

      return {
        code: 'SUCCESS',
        message: 'Successfully get categories',
        data: categories,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get categories',
        data: `${error}`,
      });
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.category.findFirst({
        where: {
          id,
        },
        include: {
          products: true,
        },
      });

      return {
        code: 'SUCCESS',
        message: 'Successfully get category',
        data: data,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get category',
        data: `${error}`,
      });
    }
  }

  async create(dto: CreateCategoryDto) {
    try {
      const addData = await this.prisma.category.create({
        data: {
          name: dto.name,
        },
      });

      return {
        code: 'SUCCESS',
        message: 'Successfully add data',
        data: addData,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed add category',
        data: `${error}`,
      });
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    try {
      if (id === '' || id === null) {
        return {
          code: 'BAD_REQUEST',
          message: 'Id category requried',
          data: null,
        };
      }

      const edit = await this.prisma.category.update({
        where: { id },
        data: {
          name: dto.name,
        },
      });

      return {
        code: 'CREATED',
        message: 'Successfully update category',
        data: edit,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed update category',
        data: `${error}`,
      });
    }
  }

  async remove(id: string) {
    try {
      if (id === '' || id === null) {
        return {
          code: 'BAD_REQUEST',
          message: 'Id category requried',
          data: null,
        };
      }
      const deletProduct = await this.prisma.category.delete({
        where: { id },
      });

      return {
        code: 'CREATED',
        message: 'Successfully delete product',
        data: deletProduct,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed delete category',
        data: `${error}`,
      });
    }
  }
}
