/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Categorias` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Marcas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Productos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Proveedores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telefono]` on the table `Proveedores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Categorias_nombre_key" ON "Categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Marcas_nombre_key" ON "Marcas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Productos_nombre_key" ON "Productos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedores_nombre_key" ON "Proveedores"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedores_telefono_key" ON "Proveedores"("telefono");
