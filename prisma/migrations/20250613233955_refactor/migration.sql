/*
  Warnings:

  - You are about to drop the column `providerId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `providers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_providerId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "providerId";

-- DropTable
DROP TABLE "providers";
