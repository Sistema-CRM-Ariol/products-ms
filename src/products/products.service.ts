import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { convertToSlug, PaginationDto } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { productsSeeder } from 'src/data/products.seeder';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    const { brandId, providerId, categoryId, ...newProduct } = createProductDto;

    const slug = convertToSlug(newProduct.name);

    const productExists = await this.prisma.products.findFirst({
      where: { 
        OR: [
          { name: newProduct.name },
          { slug }
        ]
      }
    });


    if (productExists) {
      throw new RpcException({
        message: "El producto ya esta registrado",
        status: HttpStatus.BAD_REQUEST
      });
    }


    const product = await this.prisma.products.create({
      data: { 
        ...newProduct,
        slug,
        brandId,
        categoryId: +categoryId,
        providerId: +providerId,

      }
    })

    return {
      message: "Producto creada con exito",
      product
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;


    if (!search) {
      const totalProducts = await this.prisma.products.count();
      const lastPage = Math.ceil(totalProducts / limit);

      const products = await this.prisma.products.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          updatedAt: "desc"
        }
      })

      return {
        products,
        meta: {
          total: totalProducts,
          page: page,
          lastPage: lastPage,
        }
      }
    }

    const totalProducts = await this.prisma.products.count({
      where: {
        name: {
          contains: search
        },
      }
    });

    const lastPage = Math.ceil(totalProducts / limit);

    const products = await this.prisma.products.findMany({
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
    })

    return {
      products,
      meta: {
        total: totalProducts,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async findOne(term: string) {
    const product = await this.prisma.products.findFirst({
      include: {
        brand: {
          select: {
            id: true, name: true
          }
        },
        category: {
          select: {
            id: true, name: true, slug: true,
          }
        },
        provider: {
          select: {
            id: true, name: true, phone1: true, phone2: true, direction: true
          }
        },
      },
      where: {
        OR: [
          { id: term },
          { slug: term },
        ]
      },
    })

    if (!product) {
      throw new RpcException({
        message: "No se encontro el producto",
        status: HttpStatus.NOT_FOUND
      });
    }

    return {
      product,
    }

  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {

    const productExists = await this.prisma.products.findFirst({ where: { id } })

    if (!productExists) {
      throw new RpcException({
        message: "No se encontro el producto",
        status: HttpStatus.NOT_FOUND
      });
    }

    const product = await this.prisma.products.delete({
      where: { id },
    });

    return {
      message: `Se elimino el producto: ${product.name}`,
    };

  }

  async seed() {
    await this.prisma.products.deleteMany();

    const getRandomItem = <T>(array: T[]): T | null => {
      if (array.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    };

    const brands = await this.prisma.brands.findMany();
    const providers = await this.prisma.providers.findMany();
    const categories = await this.prisma.categories.findMany();

    if (!brands.length || !providers.length || !categories.length) {
      throw new Error("Las tablas de marcas, proveedores o categorías están vacías.");
    }

    const products = productsSeeder.map((product) => {
      return {
        ...product,
        brandId: getRandomItem(brands)?.id || brands[0].id,
        providerId: getRandomItem(providers)?.id || providers[0].id,
        categoryId: getRandomItem(categories)?.id || categories[0].id,
      };
    });

    // return products
    await this.prisma.products.createMany({
      data: products
    })

    return {
      message: "Se insertaron 20 productos de prueba"
    }
  }
}
