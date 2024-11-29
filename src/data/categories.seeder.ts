import { Prisma } from "@prisma/client";

export const categoriesSeeder: Prisma.CategoriesCreateManyInput[] = [
    // Herramientas Normales
    {
        name: "Destornilladores",
        slug: "destornilladores",
    },
    {
        name: "Llaves Inglesas",
        slug: "llaves-inglesas",
    },
    {
        name: "Martillos",
        slug: "martillos",
    },
    {
        name: "Alicates",
        slug: "alicates",
    },
    {
        name: "Serruchos",
        slug: "serruchos",
    },
    {
        name: "Cintas Métricas",
        slug: "cintas-metricas",
    },
    {
        name: "Cortadores de Vidrio",
        slug: "cortadores-de-vidrio",
    },
    {
        name: "Limas",
        slug: "limas",
    },
    {
        name: "Brocas Manuales",
        slug: "brocas-manuales",
    },
    {
        name: "Llaves de Tuerca",
        slug: "llaves-de-tuerca",
    },

    // Herramientas Industriales
    {
        name: "Taladros Industriales",
        slug: "taladros-industriales",
    },
    {
        name: "Soldadoras Eléctricas",
        slug: "soldadoras-electricas",
    },
    {
        name: "Compresores de Aire",
        slug: "compresores-de-aire",
    },
    {
        name: "Amoladoras",
        slug: "amoladoras",
    },
    {
        name: "Generadores Eléctricos",
        slug: "generadores-electricos",
    },
    {
        name: "Sierras de Cinta",
        slug: "sierras-de-cinta",
    },
    {
        name: "Prensas Hidráulicas",
        slug: "prensas-hidraulicas",
    },
    {
        name: "Elevadores Hidráulicos",
        slug: "elevadores-hidraulicos",
    },
    {
        name: "Pistolas de Clavos",
        slug: "pistolas-de-clavos",
    },
    {
        name: "Equipos de Sandblasting",
        slug: "equipos-de-sandblasting",
    },
];
