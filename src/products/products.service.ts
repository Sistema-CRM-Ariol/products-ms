import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Products Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.products.count();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      products: await this.products.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
