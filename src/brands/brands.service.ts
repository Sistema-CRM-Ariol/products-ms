import { Injectable, HttpStatus } from '@nestjs/common';
import { PaginationDto } from 'src/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';
import { brandsSeeder } from 'src/data';

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

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;

    const totalBrands = await this.prisma.brands.count();

    if (!search) {
      const lastPage = Math.ceil(totalBrands / limit);

      return {
        brands: await this.prisma.brands.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            updatedAt: "desc"
          }
        }),
        meta: {
          total: totalBrands,
          page: page,
          lastPage: lastPage,
        }
      }
    }

    const totalPages = await this.prisma.brands.count({
      where: {
        OR: [
          {
            name: {
              contains: search
            },
          }
        ]

      }
    });

    const lastPage = Math.ceil(totalPages / limit);

    return {
      brands: await this.prisma.brands.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search
              },
            }
          ]

        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          updatedAt: "desc"
        }
      }),
      meta: {
        total: totalBrands,
        page: page,
        lastPage: lastPage,
      }
    }
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
