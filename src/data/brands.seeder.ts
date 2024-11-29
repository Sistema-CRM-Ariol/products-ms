import { Prisma } from "@prisma/client";

export const brandsSeeder: Prisma.BrandsCreateInput[] = [
    {
        name: 'Bosch',
        description: 'Marca líder en herramientas eléctricas y accesorios de alta calidad.',
    },
    {
        name: 'Stanley',
        description: 'Reconocida por sus herramientas manuales y de medición de precisión.',
    },
    {
        name: 'Makita',
        description: 'Especialistas en herramientas eléctricas para uso profesional e industrial.',
    },
    {
        name: 'DeWalt',
        description: 'Innovadora en herramientas inalámbricas y equipos de construcción.',
    },
    {
        name: 'Hilti',
        description: 'Fabricante de herramientas para trabajos pesados y construcción.',
    },
    {
        name: 'Black & Decker',
        description: 'Conocida por su amplia gama de herramientas para uso doméstico y profesional.',
    },
    {
        name: 'Klein Tools',
        description: 'Famosa por herramientas diseñadas para electricistas y técnicos.',
    },
    {
        name: 'Ryobi',
        description: 'Ofrece herramientas eléctricas y equipos de jardín accesibles y funcionales.',
    },
    {
        name: 'Hitachi',
        description: 'Innovadora en herramientas de alto rendimiento y tecnología avanzada.',
    },
    {
        name: 'Craftsman',
        description: 'Calidad en herramientas manuales y equipos de jardinería.',
    }
];