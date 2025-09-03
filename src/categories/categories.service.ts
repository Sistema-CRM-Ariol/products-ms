import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { convertToSlug, PaginationDto } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { categoriesSeeder } from 'src/data/categories.seeder';
import { FilterPaginationDto } from 'src/common/dto/filter-pagination.dto';

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

    async findAll(filterPaginationDto: FilterPaginationDto) {
        const { page, limit, search, isActive } = filterPaginationDto;
        const filters: any[] = [];

        if (search) {
            filters.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                ],
            });
        }

        // Si status viene definido, lo agregamos
        if (isActive !== undefined) {
            filters.push({ isActive });
        }


        // Si existen filtros, los combinamos en un AND; de lo contrario, la consulta no tiene filtro
        const whereClause = filters.length > 0 ? { AND: filters } : {};

        // Ejecutamos la consulta de conteo y búsqueda con el mismo whereClause
        const [totalCategories, categories] = await Promise.all([
            this.prisma.categories.count({
                where: whereClause,
            }),
            this.prisma.categories.findMany({
                take: limit,
                skip: (page! - 1) * limit!,
                orderBy: { updatedAt: 'desc' },
                where: { ...whereClause, },
            }),
        ]);

        const lastPage = Math.ceil(totalCategories / limit!);

        return {
            categories,
            meta: {
                page,
                lastPage,
                total: totalCategories,
            },
        };
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

        const updatedCategory = await this.prisma.categories.update({
            where: { id },
            data: updateCategoryDto,
        });

        return {
            message: 'Categoria actualizada',
            category: updatedCategory,
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
