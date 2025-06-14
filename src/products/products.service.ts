import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { convertToSlug, PaginationDto } from 'src/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { productsSeeder } from 'src/data/products.seeder';
import { RpcException } from '@nestjs/microservices';
import { FilterPaginationDto } from 'src/common/dto/filter-pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    const { brandId, categoryId, ...newProduct } = createProductDto;

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

      }
    })

    return {
      message: "Producto creada con exito",
    }

  }

  async findAll(filterPaginationDto: FilterPaginationDto) {
    const { page, limit, search, isActive } = filterPaginationDto;

    const filters: any[] = [];

    if (search) {
      filters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { serialNumber: { contains: search, mode: 'insensitive' } },
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
    const [totalProducts, products] = await Promise.all([
      this.prisma.products.count({
        where: whereClause,
      }),
      this.prisma.products.findMany({
        take: limit,
        skip: (page! - 1) * limit!,
        orderBy: { updatedAt: 'desc' },
        where: { ...whereClause, },
        select: {
          name: true,
          slug: true,
          brand: {
            select: { name: true }
          },
          category: {
            select: { name: true }
          },
          id: true, 
          image: true,
          serialNumber: true, 
          isActive: true, 
          createdAt: true, 
        }

      }),
    ]);

    const lastPage = Math.ceil(totalProducts / limit!);

    return {
      products,
      meta: {
        page,
        lastPage,
        total: totalProducts,
      },
    };
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
    const categories = await this.prisma.categories.findMany();

    if (!brands.length || !categories.length) {
      throw new Error("Las tablas de marcas, proveedores o categorías están vacías.");
    }

    const products = productsSeeder.map((product) => {
      return {
        ...product,
        brandId: getRandomItem(brands)?.id || brands[0].id,
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

  async findProductsByIds(productIds: string[]) {
    const products = await this.prisma.products.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        image: true,
        isActive: true,
        name: true,
        priceSale: true,
        serialNumber: true,
        slug: true,
      }
    });

    return products;
  } 
}
