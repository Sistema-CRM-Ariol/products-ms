import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { providersSeeder } from 'src/data';

@Injectable()
export class ProvidersService {

  constructor(private prisma: PrismaService) { }

  async create(createProviderDto: CreateProviderDto) {
    const providerExist = await this.prisma.providers.findFirst({
      where: {
        OR: [
          { name: createProviderDto.name },
          { phone1: createProviderDto.phone1 },
          { phone2: createProviderDto.phone2 },
        ]
      }
    });


    if (providerExist) {
      throw new RpcException({
        message: "Ya se registro un proveedor con datos similares",
        status: HttpStatus.BAD_REQUEST
      });
    }


    const provider = await this.prisma.providers.create({
      data: { ...createProviderDto }
    })

    return {
      message: "Se registro el proveedor",
      provider,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;

    const totalProviders = await this.prisma.providers.count();

    if (!search) {
      const lastPage = Math.ceil(totalProviders / limit);

      return {
        providers: await this.prisma.providers.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            createdAt: "desc"
          }
        }),
        meta: {
          total: totalProviders,
          page: page,
          lastPage: lastPage,
        }
      }
    }


    const totalPages = await this.prisma.providers.count({
      where: {
        name: {
          contains: search
        },
      }
    });

    console.log(totalPages)

    const lastPage = Math.ceil(totalPages / limit);

    return {
      providers: await this.prisma.providers.findMany({
        where: {
          name: {
            contains: search
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      meta: {
        total: totalProviders,
        page: page,
        lastPage: lastPage,
      }
    }

  }

  async findOne(id: number) {

    const provider = await this.prisma.providers.findFirst({
      where: { id },
      include: {
        products: true,
      }
    })

    if (!provider) {
      throw new RpcException({
        message: "No se encontro el proveedor",
        status: HttpStatus.NOT_FOUND,
      });
    }

    return {
      provider
    };
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    const providerExists = await this.prisma.providers.findFirst({ where: { id } })

    if (!providerExists) {
      throw new RpcException({
        message: "No se encontro el proveedor",
        status: HttpStatus.NOT_FOUND,
      });
    }

    try {

      const provider = await this.prisma.providers.update({
        data: {
          ...updateProviderDto,
        },
        where: { id }
      })

      return {
        message: "Se actualizo la información",
        provider,
      }

    } catch (error) {

      console.log(error)

      if (error.code == 'P2002' && error.meta.target[0] == "name") {

        throw new RpcException({
          message: "El nombre pertenece a otro proveedor",
          status: HttpStatus.BAD_REQUEST,
        });
      }

      if (error.code == 'P2002' && error.meta.target.includes("phone1","phone2")) {

        throw new RpcException({
          message: "El telefono pertenece a otro proveedor",
          status: HttpStatus.BAD_REQUEST,
        });
      }

      throw new RpcException({
        message: "Error en el servidor, revise los logs del sistema",
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });

    }
  }

  async remove(id: number) {
    const provider = await this.prisma.providers.findFirst({ where: { id } })

    if (!provider) {
      throw new RpcException({
        message: "No se encontro el proveedor",
        status: HttpStatus.NOT_FOUND,
      });
    }

    await this.prisma.providers.delete({ where: { id } })

    return {
      provider,
      message: "Se elimino el proveedor del sistema"
    };
  }

  async seed() {
    await this.prisma.providers.deleteMany();

    await this.prisma.providers.createMany({
      data: providersSeeder
    })

    return {
      message: "Se insertaron los 50 proveedores de prueba"
    }
  }
}
