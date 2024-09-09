import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { convertToSlug, PaginationDto } from 'src/common';

@Injectable()
export class CategoriesService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Products Database connected');
  }

  async create(createCategoryDto: CreateCategoryDto) {

    const categoryExists = await this.categories.findFirst({
      where: { name: createCategoryDto.name }
    });


    if (categoryExists) {
      throw new RpcException({
        message: "La categoria ya esta registrada",
        status: HttpStatus.BAD_REQUEST
      });
    }

    const slug = convertToSlug(createCategoryDto.name);

    const category = await this.categories.create({
      data: { ...createCategoryDto, slug }
    })

    return {
      message: "Categoria creada con exito",
      category
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;

    const totalCategories = await this.categories.count();

    if (!search) {
      const lastPage = Math.ceil(totalCategories / limit);

      return {
        categories: await this.categories.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: "desc"
          }
        }),
        meta: {
          total: totalCategories,
          page: page,
          lastPage: lastPage,
        }
      }
    }

    const totalPages = await this.categories.count({
      where: {
        name: {
          contains: search
        },
      }
    });

    const lastPage = Math.ceil(totalPages / limit);

    return {
      categories: await this.categories.findMany({
        where: {
          name: {
            contains: search,

          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      meta: {
        total: totalCategories,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async findOne(id: number) {

    const category = await this.categories.findFirst({
      where: { id }
    })

    if (!category) {
      throw new RpcException({
        message: "No se encontro la categoria",
        status: HttpStatus.NOT_FOUND
      });
    }

    return {
      category
    }

  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {

    const categoryExists = await this.categories.findFirst({ where: { id } })

    if (!categoryExists) {
      throw new RpcException({
        message: "No se encontro la categoria",
        status: HttpStatus.NOT_FOUND
      });
    }

    const category = await this.categories.delete({
      where: { id },
    });

    return {
      message: `Se elimino la categoria ${category.name}`,
    };
  }
}
