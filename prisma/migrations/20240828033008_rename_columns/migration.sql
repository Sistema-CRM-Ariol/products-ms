/*
  Warnings:

  - You are about to drop the column `description` on the `Marcas` table. All the data in the column will be lost.
  - Added the required column `descripcion` to the `Marcas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Marcas" DROP COLUMN "description",
ADD COLUMN     "descripcion" TEXT NOT NULL;
