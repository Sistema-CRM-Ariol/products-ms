import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';

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

    const lastPage = Math.ceil(totalPages / limit);

    return {
      providers: await this.prisma.providers.findMany({
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
        total: totalProviders,
        page: page,
        lastPage: lastPage,
      }
    }

  }

  async findOne(id: number) {
    return `This action returns a #${id} provider`;
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    return `This action updates a #${id} provider`;
  }

  async remove(id: number) {
    return `This action removes a #${id} provider`;
  }
}
