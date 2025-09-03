import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';
import { brandsSeeder } from 'src/data';
import { FilterPaginationDto } from 'src/common/dto/filter-pagination.dto';

@Injectable()
export class BrandsService {

    constructor(private readonly prisma: PrismaService) { }

    async create(createBrandDto: CreateBrandDto) {
        const marcaExiste = await this.prisma.brands.findFirst({
            where: { name: createBrandDto.name }
        });

        if (marcaExiste) {
            throw new RpcException({
                message: "La marca ya esta registrada",
                status: HttpStatus.BAD_REQUEST
            });
        }

        const marca = await this.prisma.brands.create({
            data: createBrandDto,
        });

        return {
            message: 'Se registro la marca exitosamente',
            marca,
        };
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

        if (isActive !== undefined) {
            filters.push({ isActive });
        }


        // Si existen filtros, los combinamos en un AND; de lo contrario, la consulta no tiene filtro
        const whereClause = filters.length > 0 ? { AND: filters } : {};

        // Ejecutamos la consulta de conteo y búsqueda con el mismo whereClause
        const [totalBrands, brands] = await Promise.all([
            this.prisma.brands.count({
                where: whereClause,
            }),
            this.prisma.brands.findMany({
                take: limit,
                skip: (page! - 1) * limit!,
                orderBy: { updatedAt: 'desc' },
                where: { ...whereClause, },
            }),
        ]);

        const lastPage = Math.ceil(totalBrands / limit!);

        return {
            brands,
            meta: {
                page,
                lastPage,
                total: totalBrands,
            },
        };
    }

    async update(id: string, updateBrandDto: UpdateBrandDto) {
        const marca = await this.prisma.brands.findFirst({
            where: { id },
        });

        if (!marca) {
            throw new RpcException({
                message: "No se encontro la marca",
                status: HttpStatus.NOT_FOUND
            });
        }

        const updateBrand = await this.prisma.brands.update({
            where: { id },
            data: updateBrandDto,
        });

        return {
            message: 'Marca actualizada',
            updateBrand,
        };
    }

    async remove(id: string) {

        const marcaExists = await this.prisma.brands.findFirst({ where: { id } })

        if (!marcaExists) {
            throw new RpcException({
                message: "No se encontro la marca",
                status: HttpStatus.NOT_FOUND
            });
        }

        const marca = await this.prisma.brands.delete({
            where: { id },
        });

        return {
            message: 'Se elimino la marca',
            marca,
        };
    }

    async seed() {
        await this.prisma.brands.deleteMany();

        await this.prisma.brands.createMany({
            data: brandsSeeder,
            skipDuplicates: true
        })

        return {
            message: "Se insertaron 10 marcas de prueba"
        }
    }
}
