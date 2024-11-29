import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { convertToSlug, PaginationDto } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { categoriesSeeder } from 'src/data/categories.seeder';

@Injectable()
export class CategoriesService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {

    const categoryExists = await this.prisma.categories.findFirst({
      where: { name: createCategoryDto.name }
    });


    if (categoryExists) {
      throw new RpcException({
        message: "La categoria ya esta registrada",
        status: HttpStatus.BAD_REQUEST
      });
    }

    const slug = convertToSlug(createCategoryDto.name);

    const category = await this.prisma.categories.create({
      data: { ...createCategoryDto, slug }
    })

    return {
      message: "Categoria creada con exito",
      category
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;

    const totalCategories = await this.prisma.categories.count();

    if (!search) {
      const lastPage = Math.ceil(totalCategories / limit);

      return {
        categories: await this.prisma.categories.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            updatedAt: "desc"
          }
        }),
        meta: {
          total: totalCategories,
          page: page,
          lastPage: lastPage,
        }
      }
    }

    const totalPages = await this.prisma.categories.count({
      where: {
        name: {
          contains: search
        },
      }
    });

    const lastPage = Math.ceil(totalPages / limit);

    return {
      categories: await this.prisma.categories.findMany({
        where: {
          name: {
            contains: search,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          updatedAt: "desc"
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

    const category = await this.prisma.categories.findFirst({
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

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto;

    const category = await this.prisma.categories.findFirst({
      where: { id },
    });

    if (!category) {
      throw new RpcException({
        message: "No se encontro la categoria",
        status: HttpStatus.NOT_FOUND
      });
    }

    const updateBrand = await this.prisma.categories.update({
      where: { id },
      data: {
        name,
      },
    });

    return {
      message: 'Categoria actualizada',
      updateBrand,
    };
  }

  async remove(id: number) {

    const categoryExists = await this.prisma.categories.findFirst({ where: { id } })

    if (!categoryExists) {
      throw new RpcException({
        message: "No se encontro la categoria",
        status: HttpStatus.NOT_FOUND
      });
    }

    const category = await this.prisma.categories.delete({
      where: { id },
    });

    return {
      message: `Se elimino la categoria ${category.name}`,
    };
  }

  async seed() {
    await this.prisma.categories.deleteMany();

    await this.prisma.categories.createMany({
      data: categoriesSeeder,
      skipDuplicates: true
    })

    return {
      message: "Se insertaron 20 categorias de prueba"
    }
  }
}
