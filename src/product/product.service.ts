import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findByCategory(categoryId: string) {
    try {
      if (categoryId === '' || categoryId === null) {
        return {
          code: 'NOT_FOUND',
          message: 'Category not found',
          data: null,
        };
      }
      const products = await this.prisma.product.findMany({
        where: { categoryId },
      });

      if (products.length === 0) {
        return {
          code: 'SUCCESS',
          message: 'Empty data',
          data: null,
        };
      }

      return {
        code: 'SUCCESS',
        message: 'Successfully get products',
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get products',
        data: `${error}`,
      });
    }
  }

  async findById(id: string) {
    try {
      if (id === '' || id === null) {
        return {
          code: 'NOT_FOUND',
          message: 'Category not found',
          data: null,
        };
      }
      const product = await this.prisma.product.findFirst({
        where: { id },
      });

      if (!product) {
        return {
          code: 'NOT_FOUND',
          message: 'Empty data',
          data: null,
        };
      }

      return {
        code: 'SUCCESS',
        message: 'Successfully get product',
        data: product,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed get product',
        data: `${error}`,
      });
    }
  }

  async create(dto: CreateProductDto) {
    try {
      // Tambah product ke database
      const add = await this.prisma.product.create({
        data: {
          categoryId: dto.categoryId,
          unitId: dto.unitId,
          name: dto.name,
          price: dto.price,
          stock: dto.stock,
          imageUrl: dto.imageUrl,
        },
      });

      // Return response sukses
      return {
        code: 'CREATED',
        message: 'Successfully add product',
        data: add,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed add product',
        data: `${error}`,
      });
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    try {
      // Cek id product
      if (id === '' || id === null) {
        return {
          code: 'BAD_REQUEST',
          message: 'Id product requried',
          data: null,
        };
      }
      // Update product dan kirim ke database
      const edit = await this.prisma.product.update({
        where: { id },
        data: {
          categoryId: dto.categoryId,
          unitId: dto.unitId,
          name: dto.name,
          price: dto.price,
          stock: dto.stock,
          imageUrl: dto.imageUrl,
        },
      });

      // Return response sukses
      return {
        code: 'CREATED',
        message: 'Successfully update product',
        data: edit,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed update product',
        data: `${error}`,
      });
    }
  }

  async remove(id: string) {
    try {
      // Cek id product
      if (id === '' || id === null) {
        return {
          code: 'BAD_REQUEST',
          message: 'Id product requried',
          data: null,
        };
      }
      // Hapus product
      const deletProduct = await this.prisma.product.delete({
        where: { id },
      });

      // Return response sukses
      return {
        code: 'CREATED',
        message: 'Successfully delete product',
        data: deletProduct,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed update product',
        data: `${error}`,
      });
    }
  }
}
