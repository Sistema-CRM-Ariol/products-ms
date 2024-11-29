/*
  Warnings:

  - You are about to drop the column `descripcion` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `brands` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `brands` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `brands` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "brands_nombre_key";

-- AlterTable
ALTER TABLE "brands" DROP COLUMN "descripcion",
DROP COLUMN "nombre",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");
