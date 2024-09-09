-- CreateTable
CREATE TABLE "Productos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "nroSerie" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "precioCompra" DOUBLE PRECISION NOT NULL,
    "precioVenta" DOUBLE PRECISION NOT NULL,
    "slug" TEXT NOT NULL,
    "marcaId" TEXT,
    "proveedorId" INTEGER,
    "categoriaId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marcas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categorias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedores" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Productos_nroSerie_key" ON "Productos"("nroSerie");

-- CreateIndex
CREATE UNIQUE INDEX "Productos_slug_key" ON "Productos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Categorias_slug_key" ON "Categorias"("slug");

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marcas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
