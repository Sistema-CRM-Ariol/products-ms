/*
  Warnings:

  - You are about to drop the `Categorias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Marcas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Productos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proveedores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Productos" DROP CONSTRAINT "Productos_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Productos" DROP CONSTRAINT "Productos_marcaId_fkey";

-- DropForeignKey
ALTER TABLE "Productos" DROP CONSTRAINT "Productos_proveedorId_fkey";

-- DropTable
DROP TABLE "Categorias";

-- DropTable
DROP TABLE "Marcas";

-- DropTable
DROP TABLE "Productos";

-- DropTable
DROP TABLE "Proveedores";

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "pricePurchase" DOUBLE PRECISION NOT NULL,
    "priceSale" DOUBLE PRECISION NOT NULL,
    "slug" TEXT NOT NULL,
    "brandId" TEXT,
    "providerId" INTEGER,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "providers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone1" TEXT,
    "phone2" TEXT,
    "direction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_serialNumber_key" ON "products"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "brands_nombre_key" ON "brands"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "providers_name_key" ON "providers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "providers_phone1_key" ON "providers"("phone1");

-- CreateIndex
CREATE UNIQUE INDEX "providers_phone2_key" ON "providers"("phone2");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
